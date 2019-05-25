import url from 'url'
import path from 'path'
import express from 'express'
import Prometheus from 'prom-client'
import createDebugger from 'debug'
import setPackageInfo from 'pkginfo'

import { MetricCollectors, MiddlewareOptions, MetricKeys } from '..'
import { shouldLogMetrics, createMetricRegisterWithPrefix } from './utils'
import { defaultOptions, defaultMetrics } from './config'

const debug = createDebugger('express-prometheus-metrics')

const middleware: { exports: { version?: string } } = {
  exports: {},
}

setPackageInfo(module, 'name', 'version')

setPackageInfo(middleware, {
  dir: path.dirname(module.parent.filename),
  include: ['name', 'version'],
})

const appVersion: string = middleware.exports.version

const registerMetricsCollectors = (
  middlewareOptions: MiddlewareOptions,
): MetricCollectors => {
  const options: MiddlewareOptions = Object.assign(
    {},
    defaultOptions,
    middlewareOptions,
  )

  const registerMetric = createMetricRegisterWithPrefix(options.prefix)

  debug(`Initialising Prometheus with the following options:`)
  debug(JSON.stringify(options))

  const metrics: MetricKeys = defaultMetrics

  debug('Collecting the following metrics:')
  debug(JSON.stringify(metrics, null, 2))

  // Collect default metrics from Prometheus
  Prometheus.collectDefaultMetrics({
    timeout: options.interval,
    prefix: options.prefix,
  })

  const version = registerMetric(metrics.appVersion, 'gauge', {
    labelNames: ['version'],
  })

  version.labels(appVersion).set(1)

  const requestDurationHistogram = registerMetric(
    metrics.requestDurationHistogram,
    'histogram',
    {
      labelNames: ['method', 'route', 'code'],
      buckets: options.requestDurationHistogramBuckets,
    },
  )

  const requestDurationSummary = registerMetric(
    metrics.requestDurationSummary,
    'summary',
    {
      labelNames: ['method', 'route', 'code'],
      percentiles: options.requestDurationBuckets,
    },
  )

  const requestSizeHistogram = registerMetric(
    metrics.requestSize,
    'histogram',
    {
      labelNames: ['method', 'route', 'code'],
      buckets: options.requestSizeBuckets,
    },
  )

  const responseSizeHistogram = registerMetric(
    metrics.responseSize,
    'histogram',
    {
      labelNames: ['method', 'route', 'code'],
      buckets: options.responseSizeBuckets,
    },
  )

  const requestCount = registerMetric(metrics.totalRequests, 'counter', {
    labelNames: ['route', 'method', 'code'],
  })

  return {
    requestDurationHistogram,
    requestDurationSummary,
    requestSizeHistogram,
    responseSizeHistogram,
    requestCount,
  }
}

const prometheusMiddleware = (
  options: MiddlewareOptions,
): express.Application => {
  const collectors: MetricCollectors = registerMetricsCollectors(options)

  const { metricsPath } = options

  const app = express()

  app.get(metricsPath, (req: express.Request, res: express.Response) => {
    debug('Request to /metrics endpoint')
    res.set('Content-Type', Prometheus.register.contentType)
    return res.end(Prometheus.register.metrics())
  })

  const requestHandler = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const startTime = Date.now()
    const requestLength = parseInt(req.get('content-length'), 10) || 0

    const stopRequestDurationSummary = collectors.requestDurationSummary.startTimer()
    const stopRequestDurationHistogram = collectors.requestDurationHistogram.startTimer()

    res.once('finish', () => {
      const endTime = Date.now()
      const route: string = url.parse(req.url).pathname

      if (route && shouldLogMetrics(options.excludeRoutes, route)) {
        stopRequestDurationSummary({
          route,
          method: req.method,
          code: res.statusCode,
        })

        stopRequestDurationHistogram({
          route,
          method: req.method,
          code: res.statusCode,
        })

        debug(`${req.method} ${route} (${res.statusCode})`)

        collectors.requestCount.inc({
          route: req.url,
          method: req.method,
          code: res.statusCode,
        })

        const responseLength: number =
          parseInt(res.get('Content-Length'), 10) || 0

        collectors.requestSizeHistogram.observe(
          {
            route,
            method: req.method,
            code: res.statusCode,
          },
          requestLength,
        )

        collectors.responseSizeHistogram.observe(
          { method: req.method, route, code: res.statusCode },
          responseLength,
        )

        debug(`Metrics updated (${req.method} ${route}):
      request length: ${requestLength}
      response length: ${responseLength}
      response time: ${endTime - startTime}ms`)
      }
    })

    return next()
  }

  app.use(requestHandler)

  return app
}

module.exports = prometheusMiddleware
