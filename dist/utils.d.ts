import * as Prometheus from 'prom-client';
import { MetricType, MetricDefinition } from '..';
/**
 * Return boolean indicating if the route has been excluded
 * @param {Array} excludeRoutes
 * @param {string} route
 * @returns {Boolean}
 */
export declare const shouldLogMetrics: (excludeRoutes: string[], route: string) => boolean;
/**
 * Determine if metric has already been registered
 * @param {String} metric
 * @returns {Boolean}
 */
export declare const metricHasBeenRegistered: (metric: string) => Prometheus.Metric;
/**
 * Return metric if already registered, otherwise return new instance
 * @param {Object} name
 * @param {String} type
 * @param {Object} options
 */
export declare const createMetricRegisterWithPrefix: (prefix: string) => (metric: MetricDefinition, type: MetricType, options: {
    labelNames: string[];
    buckets?: number[];
    percentiles?: number[];
}) => any;
