# express-prometheus-metrics

Express middleware for collecting metrics with Prometheus

## Install

```sh
yarn add express-prometheus-metrics
```

## Usage

```js
const express = require('express')
const metrics = require('express-prometheus-metrics')

const app = express()

app.use(
  metrics({
    // The route to expose the metrics on
    metricsPath: '/metrics',

    // How often prometheus should collect the metrics
    interval: 60 * 1000,

    // Any routes that should be ignored
    excludeRoutes: [],

    // Percentiles for request duration summary
    requestDurationBuckets: [0.5, 0.9, 0.95, 0.99],

    // Time buckets for request duration histogram
    requestDurationHistogramBuckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],

    // Size buckets for request
    requestSizeBuckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000],

    // Size buckets for response
    responseSizeBuckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000],
  }),
)

app.listen(process.env.PORT, error => {
  if (error) throw error

  console.log(`Listening on http://localhost:${process.env.PORT}`)
  console.log(
    `Metrics available at http://localhost:${process.env.PORT}/metrics`,
  )
})
```

## Metrics Example

<details>
  <summary>View Metrics Example</summary>

  ```
  # HELP process_cpu_user_seconds_total Total user CPU time spent in seconds.
# TYPE process_cpu_user_seconds_total counter
process_cpu_user_seconds_total 0.705806 1558806366238

# HELP process_cpu_system_seconds_total Total system CPU time spent in seconds.
# TYPE process_cpu_system_seconds_total counter
process_cpu_system_seconds_total 0.058946 1558806366238

# HELP process_cpu_seconds_total Total user and system CPU time spent in seconds.
# TYPE process_cpu_seconds_total counter
process_cpu_seconds_total 0.764752 1558806366238

# HELP process_start_time_seconds Start time of the process since unix epoch in seconds.
# TYPE process_start_time_seconds gauge
process_start_time_seconds 1558806355

# HELP process_resident_memory_bytes Resident memory size in bytes.
# TYPE process_resident_memory_bytes gauge
process_resident_memory_bytes 58933248 1558806366238

# HELP nodejs_eventloop_lag_seconds Lag of event loop in seconds.
# TYPE nodejs_eventloop_lag_seconds gauge
nodejs_eventloop_lag_seconds 0.000792479 1558806366239

# HELP nodejs_active_handles_total Number of active handles.
# TYPE nodejs_active_handles_total gauge
nodejs_active_handles_total 8 1558806366238

# HELP nodejs_active_requests_total Number of active requests.
# TYPE nodejs_active_requests_total gauge
nodejs_active_requests_total 0 1558806366238

# HELP nodejs_heap_size_total_bytes Process heap size from node.js in bytes.
# TYPE nodejs_heap_size_total_bytes gauge
nodejs_heap_size_total_bytes 40144896 1558806366238

# HELP nodejs_heap_size_used_bytes Process heap size used from node.js in bytes.
# TYPE nodejs_heap_size_used_bytes gauge
nodejs_heap_size_used_bytes 31756904 1558806366238

# HELP nodejs_external_memory_bytes Nodejs external memory size in bytes.
# TYPE nodejs_external_memory_bytes gauge
nodejs_external_memory_bytes 83838 1558806366238

# HELP nodejs_heap_space_size_total_bytes Process heap space size total from node.js in bytes.
# TYPE nodejs_heap_space_size_total_bytes gauge
nodejs_heap_space_size_total_bytes{space="read_only"} 524288 1558806366238
nodejs_heap_space_size_total_bytes{space="new"} 1048576 1558806366238
nodejs_heap_space_size_total_bytes{space="old"} 32215040 1558806366238
nodejs_heap_space_size_total_bytes{space="code"} 1572864 1558806366238
nodejs_heap_space_size_total_bytes{space="map"} 2109440 1558806366238
nodejs_heap_space_size_total_bytes{space="large_object"} 2674688 1558806366238

# HELP nodejs_heap_space_size_used_bytes Process heap space size used from node.js in bytes.
# TYPE nodejs_heap_space_size_used_bytes gauge
nodejs_heap_space_size_used_bytes{space="read_only"} 35200 1558806366238
nodejs_heap_space_size_used_bytes{space="new"} 8792 1558806366238
nodejs_heap_space_size_used_bytes{space="old"} 28045920 1558806366238
nodejs_heap_space_size_used_bytes{space="code"} 1054912 1558806366238
nodejs_heap_space_size_used_bytes{space="map"} 1289464 1558806366238
nodejs_heap_space_size_used_bytes{space="large_object"} 1327648 1558806366238

# HELP nodejs_heap_space_size_available_bytes Process heap space size available from node.js in bytes.
# TYPE nodejs_heap_space_size_available_bytes gauge
nodejs_heap_space_size_available_bytes{space="read_only"} 480384 1558806366238
nodejs_heap_space_size_available_bytes{space="new"} 1022376 1558806366238
nodejs_heap_space_size_available_bytes{space="old"} 3388192 1558806366238
nodejs_heap_space_size_available_bytes{space="code"} 456512 1558806366238
nodejs_heap_space_size_available_bytes{space="map"} 776104 1558806366238
nodejs_heap_space_size_available_bytes{space="large_object"} 1486573056 1558806366238

# HELP nodejs_version_info Node.js version info.
# TYPE nodejs_version_info gauge
nodejs_version_info{version="v10.14.1",major="10",minor="14",patch="1"} 1

# HELP app_version Application version from the package.json file as string
# TYPE app_version gauge
app_version{version="0.2.5"} 1

# HELP http_request_duration_histogram_seconds Duration of HTTP requests in seconds
# TYPE http_request_duration_histogram_seconds histogram
http_request_duration_histogram_seconds_bucket{le="0.005",route="/graphql",method="POST",code="200"} 0
http_request_duration_histogram_seconds_bucket{le="0.01",route="/graphql",method="POST",code="200"} 0
http_request_duration_histogram_seconds_bucket{le="0.025",route="/graphql",method="POST",code="200"} 0
http_request_duration_histogram_seconds_bucket{le="0.05",route="/graphql",method="POST",code="200"} 1
http_request_duration_histogram_seconds_bucket{le="0.1",route="/graphql",method="POST",code="200"} 2
http_request_duration_histogram_seconds_bucket{le="0.25",route="/graphql",method="POST",code="200"} 2
http_request_duration_histogram_seconds_bucket{le="0.5",route="/graphql",method="POST",code="200"} 2
http_request_duration_histogram_seconds_bucket{le="1",route="/graphql",method="POST",code="200"} 2
http_request_duration_histogram_seconds_bucket{le="2.5",route="/graphql",method="POST",code="200"} 2
http_request_duration_histogram_seconds_bucket{le="5",route="/graphql",method="POST",code="200"} 2
http_request_duration_histogram_seconds_bucket{le="10",route="/graphql",method="POST",code="200"} 2
http_request_duration_histogram_seconds_bucket{le="+Inf",route="/graphql",method="POST",code="200"} 2
http_request_duration_histogram_seconds_sum{route="/graphql",method="POST",code="200"} 0.118276569
http_request_duration_histogram_seconds_count{route="/graphql",method="POST",code="200"} 2

# HELP http_request_duration_summary_seconds Summary of request durations in seconds
# TYPE http_request_duration_summary_seconds summary
http_request_duration_summary_seconds{quantile="0.5",route="/graphql",method="POST",code="200"} 0.058377634
http_request_duration_summary_seconds{quantile="0.9",route="/graphql",method="POST",code="200"} 0.0838918
http_request_duration_summary_seconds{quantile="0.95",route="/graphql",method="POST",code="200"} 0.0838918
http_request_duration_summary_seconds{quantile="0.99",route="/graphql",method="POST",code="200"} 0.0838918
http_request_duration_summary_seconds_sum{route="/graphql",method="POST",code="200"} 0.116755268
http_request_duration_summary_seconds_count{route="/graphql",method="POST",code="200"} 2

# HELP http_request_size_bytes Size of HTTP request in bytes
# TYPE http_request_size_bytes histogram
http_request_size_bytes_bucket{le="5",route="/graphql",method="POST",code="200"} 0
http_request_size_bytes_bucket{le="10",route="/graphql",method="POST",code="200"} 0
http_request_size_bytes_bucket{le="25",route="/graphql",method="POST",code="200"} 0
http_request_size_bytes_bucket{le="50",route="/graphql",method="POST",code="200"} 0
http_request_size_bytes_bucket{le="100",route="/graphql",method="POST",code="200"} 0
http_request_size_bytes_bucket{le="250",route="/graphql",method="POST",code="200"} 0
http_request_size_bytes_bucket{le="500",route="/graphql",method="POST",code="200"} 1
http_request_size_bytes_bucket{le="1000",route="/graphql",method="POST",code="200"} 1
http_request_size_bytes_bucket{le="2500",route="/graphql",method="POST",code="200"} 2
http_request_size_bytes_bucket{le="5000",route="/graphql",method="POST",code="200"} 2
http_request_size_bytes_bucket{le="10000",route="/graphql",method="POST",code="200"} 2
http_request_size_bytes_bucket{le="+Inf",route="/graphql",method="POST",code="200"} 2
http_request_size_bytes_sum{route="/graphql",method="POST",code="200"} 2110
http_request_size_bytes_count{route="/graphql",method="POST",code="200"} 2

# HELP http_response_size_bytes Size of HTTP response in bytes
# TYPE http_response_size_bytes histogram
http_response_size_bytes_bucket{le="5",method="POST",route="/graphql",code="200"} 2
http_response_size_bytes_bucket{le="10",method="POST",route="/graphql",code="200"} 2
http_response_size_bytes_bucket{le="25",method="POST",route="/graphql",code="200"} 2
http_response_size_bytes_bucket{le="50",method="POST",route="/graphql",code="200"} 2
http_response_size_bytes_bucket{le="100",method="POST",route="/graphql",code="200"} 2
http_response_size_bytes_bucket{le="250",method="POST",route="/graphql",code="200"} 2
http_response_size_bytes_bucket{le="500",method="POST",route="/graphql",code="200"} 2
http_response_size_bytes_bucket{le="1000",method="POST",route="/graphql",code="200"} 2
http_response_size_bytes_bucket{le="2500",method="POST",route="/graphql",code="200"} 2
http_response_size_bytes_bucket{le="5000",method="POST",route="/graphql",code="200"} 2
http_response_size_bytes_bucket{le="10000",method="POST",route="/graphql",code="200"} 2
http_response_size_bytes_bucket{le="+Inf",method="POST",route="/graphql",code="200"} 2
http_response_size_bytes_sum{method="POST",route="/graphql",code="200"} 0
http_response_size_bytes_count{method="POST",route="/graphql",code="200"} 2

# HELP http_requests_total Counter for total requests received
# TYPE http_requests_total counter
http_requests_total{route="/graphql",method="POST",code="200"} 2
  ```
<details>

## Debugging

This package uses `debug` for debug logs with the `express-prometheus-metrics` key.

Run your app with the following environment variable to output the debug logs:

```sh
DEBUG=express-prometheus-metrics node index.js
```
