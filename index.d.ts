import * as Prometheus from 'prom-client'
export interface MetricDefinition {
  key: string
  help: string
}

export interface MetricKeys {
  appVersion: MetricDefinition
  totalRequests: MetricDefinition
  requestDurationHistogram: MetricDefinition
  requestDurationSummary: MetricDefinition
  requestSize: MetricDefinition
  responseSize: MetricDefinition
}

export type Metric =
  | Prometheus.Metric
  | Prometheus.Counter
  | Prometheus.Histogram
  | Prometheus.Summary

export type MetricType = 'counter' | 'histogram' | 'summary' | 'gauge'

export type MetricSetup =
  | Prometheus.CounterConfiguration
  | Prometheus.SummaryConfiguration
  | Prometheus.HistogramConfiguration

export interface MiddlewareOptions {
  prefix: string
  metricsPath: string
  interval: number
  requestDurationBuckets: number[]
  requestDurationHistogramBuckets: number[]
  requestSizeBuckets: number[]
  responseSizeBuckets: number[]
  excludeRoutes: string[]
}

export interface MetricCollectors {
  requestDurationHistogram: Prometheus.Histogram
  requestDurationSummary: Prometheus.Summary
  requestSizeHistogram: Prometheus.Histogram
  responseSizeHistogram: Prometheus.Histogram
  requestCount: Prometheus.Counter
}
