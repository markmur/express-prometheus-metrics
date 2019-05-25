'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.defaultOptions = {
  prefix: '',
  metricsPath: '/metrics',
  interval: 5 * 1000,
  requestDurationBuckets: [0.5, 0.9, 0.95, 0.99],
  requestDurationHistogramBuckets: [
    0.005,
    0.01,
    0.025,
    0.05,
    0.1,
    0.25,
    0.5,
    1,
    2.5,
    5,
    10,
  ],
  requestSizeBuckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000],
  responseSizeBuckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000],
  excludeRoutes: [],
}
exports.defaultMetrics = {
  appVersion: {
    key: 'app_version',
    help: 'Application version from the package.json file as string',
  },
  totalRequests: {
    key: 'http_requests_total',
    help: 'Counter for total requests received',
  },
  requestDurationHistogram: {
    key: 'http_request_duration_histogram_seconds',
    help: 'Duration of HTTP requests in seconds',
  },
  requestDurationSummary: {
    key: 'http_request_duration_summary_seconds',
    help: 'Summary of request durations in seconds',
  },
  requestSize: {
    key: 'http_request_size_bytes',
    help: 'Size of HTTP request in bytes',
  },
  responseSize: {
    key: 'http_response_size_bytes',
    help: 'Size of HTTP response in bytes',
  },
}
