'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
var url_1 = __importDefault(require('url'))
var path_1 = __importDefault(require('path'))
var express_1 = __importDefault(require('express'))
var prom_client_1 = __importDefault(require('prom-client'))
var debug_1 = __importDefault(require('debug'))
var pkginfo_1 = __importDefault(require('pkginfo'))
var utils_1 = require('./utils')
var config_1 = require('./config')
var debug = debug_1.default('express-prometheus-metrics')
var middleware = {
  exports: {},
}
pkginfo_1.default(module, 'name', 'version')
pkginfo_1.default(middleware, {
  dir: path_1.default.dirname(module.parent.filename),
  include: ['name', 'version'],
})
var appVersion = middleware.exports.version
var registerMetricsCollectors = function(middlewareOptions) {
  var options = Object.assign({}, config_1.defaultOptions, middlewareOptions)
  var registerMetric = utils_1.createMetricRegisterWithPrefix(options.prefix)
  debug('Initialising Prometheus with the following options:')
  debug(JSON.stringify(options))
  var metrics = config_1.defaultMetrics
  debug('Collecting the following metrics:')
  debug(JSON.stringify(metrics, null, 2))
  // Collect default metrics from Prometheus
  prom_client_1.default.collectDefaultMetrics({
    timeout: options.interval,
    prefix: options.prefix,
  })
  var version = registerMetric(metrics.appVersion, 'gauge', {
    labelNames: ['version'],
  })
  version.labels(appVersion).set(1)
  var requestDurationHistogram = registerMetric(
    metrics.requestDurationHistogram,
    'histogram',
    {
      labelNames: ['method', 'route', 'code'],
      buckets: options.requestDurationHistogramBuckets,
    },
  )
  var requestDurationSummary = registerMetric(
    metrics.requestDurationSummary,
    'summary',
    {
      labelNames: ['method', 'route', 'code'],
      percentiles: options.requestDurationBuckets,
    },
  )
  var requestSizeHistogram = registerMetric(metrics.requestSize, 'histogram', {
    labelNames: ['method', 'route', 'code'],
    buckets: options.requestSizeBuckets,
  })
  var responseSizeHistogram = registerMetric(
    metrics.responseSize,
    'histogram',
    {
      labelNames: ['method', 'route', 'code'],
      buckets: options.responseSizeBuckets,
    },
  )
  var requestCount = registerMetric(metrics.totalRequests, 'counter', {
    labelNames: ['route', 'method', 'code'],
  })
  return {
    requestDurationHistogram: requestDurationHistogram,
    requestDurationSummary: requestDurationSummary,
    requestSizeHistogram: requestSizeHistogram,
    responseSizeHistogram: responseSizeHistogram,
    requestCount: requestCount,
  }
}
var prometheusMiddleware = function(options) {
  var collectors = registerMetricsCollectors(options)
  var metricsPath = options.metricsPath
  var app = express_1.default()
  app.get(metricsPath, function(req, res) {
    debug('Request to /metrics endpoint')
    res.set('Content-Type', prom_client_1.default.register.contentType)
    return res.end(prom_client_1.default.register.metrics())
  })
  var requestHandler = function(req, res, next) {
    var startTime = Date.now()
    var requestLength = parseInt(req.get('content-length'), 10) || 0
    var stopRequestDurationSummary = collectors.requestDurationSummary.startTimer()
    var stopRequestDurationHistogram = collectors.requestDurationHistogram.startTimer()
    res.once('finish', function() {
      var endTime = Date.now()
      var route = url_1.default.parse(req.url).pathname
      if (route && utils_1.shouldLogMetrics(options.excludeRoutes, route)) {
        stopRequestDurationSummary({
          route: route,
          method: req.method,
          code: res.statusCode,
        })
        stopRequestDurationHistogram({
          route: route,
          method: req.method,
          code: res.statusCode,
        })
        debug(req.method + ' ' + route + ' (' + res.statusCode + ')')
        collectors.requestCount.inc({
          route: req.url,
          method: req.method,
          code: res.statusCode,
        })
        var responseLength = parseInt(res.get('Content-Length'), 10) || 0
        collectors.requestSizeHistogram.observe(
          {
            route: route,
            method: req.method,
            code: res.statusCode,
          },
          requestLength,
        )
        collectors.responseSizeHistogram.observe(
          { method: req.method, route: route, code: res.statusCode },
          responseLength,
        )
        debug(
          'Metrics updated (' +
            req.method +
            ' ' +
            route +
            '):\n      request length: ' +
            requestLength +
            '\n      response length: ' +
            responseLength +
            '\n      response time: ' +
            (endTime - startTime) +
            'ms',
        )
      }
    })
    return next()
  }
  app.use(requestHandler)
  return app
}
module.exports = prometheusMiddleware
