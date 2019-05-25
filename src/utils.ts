import * as Prometheus from 'prom-client'

import { MetricType, MetricSetup, MetricDefinition } from '..'

/**
 * Return boolean indicating if the route has been excluded
 * @param {Array} excludeRoutes
 * @param {string} route
 * @returns {Boolean}
 */
export const shouldLogMetrics = (
  excludeRoutes: string[] = [],
  route: string,
): boolean => excludeRoutes.every(path => !route.includes(path))

/**
 * Determine if metric has already been registered
 * @param {String} metric
 * @returns {Boolean}
 */
export const metricHasBeenRegistered = (metric: string): Prometheus.Metric =>
  Prometheus.register.getSingleMetric(metric)

/**
 * Return metric if already registered, otherwise return new instance
 * @param {Object} name
 * @param {String} type
 * @param {Object} options
 */
export const createMetricRegisterWithPrefix = (prefix: string) => (
  metric: MetricDefinition,
  type: MetricType,
  options: {
    labelNames: string[]
    buckets?: number[]
    percentiles?: number[]
  },
): any => {
  const { key: name, help } = metric

  const key: string = prefix ? `${prefix}_${name}` : name

  const registered: Prometheus.Metric = metricHasBeenRegistered(key)

  if (registered) {
    return registered
  }

  const metricSetup: MetricSetup = { name: key, help, ...options }

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
