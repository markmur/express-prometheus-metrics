'use strict'
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i]
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p]
        }
        return t
      }
    return __assign.apply(this, arguments)
  }
var __importStar =
  (this && this.__importStar) ||
  function(mod) {
    if (mod && mod.__esModule) return mod
    var result = {}
    if (mod != null)
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k]
    result['default'] = mod
    return result
  }
Object.defineProperty(exports, '__esModule', { value: true })
var Prometheus = __importStar(require('prom-client'))
/**
 * Return boolean indicating if the route has been excluded
 * @param {Array} excludeRoutes
 * @param {string} route
 * @returns {Boolean}
 */
exports.shouldLogMetrics = function(excludeRoutes, route) {
  if (excludeRoutes === void 0) {
    excludeRoutes = []
  }
  return excludeRoutes.every(function(path) {
    return !route.includes(path)
  })
}
/**
 * Determine if metric has already been registered
 * @param {String} metric
 * @returns {Boolean}
 */
exports.metricHasBeenRegistered = function(metric) {
  return Prometheus.register.getSingleMetric(metric)
}
/**
 * Return metric if already registered, otherwise return new instance
 * @param {Object} name
 * @param {String} type
 * @param {Object} options
 */
exports.createMetricRegisterWithPrefix = function(prefix) {
  return function(metric, type, options) {
    var name = metric.key,
      help = metric.help
    var key = prefix ? prefix + '_' + name : name
    var registered = exports.metricHasBeenRegistered(key)
    if (registered) {
      return registered
    }
    var metricSetup = __assign({ name: key, help: help }, options)
    switch (type) {
      case 'counter':
        return new Prometheus.Counter(metricSetup)
      case 'summary':
        return new Prometheus.Summary(metricSetup)
      case 'histogram':
        return new Prometheus.Histogram(metricSetup)
      case 'gauge':
        return new Prometheus.Gauge(metricSetup)
    }
  }
}
