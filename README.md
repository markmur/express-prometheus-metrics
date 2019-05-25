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
