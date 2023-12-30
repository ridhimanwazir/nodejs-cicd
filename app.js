const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const prometheus = require('prom-client');

const app = express();
const PORT = process.env.PORT || 4000;

// Custom Metrics
const httpRequestDurationMicroseconds = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.5, 1, 1.5, 2, 2.5, 3],
});

const customCounter = new prometheus.Counter({
  name: 'custom_counter',
  help: 'A custom counter metric',
  labelNames: ['label'],
});

const customGauge = new prometheus.Gauge({
  name: 'custom_gauge',
  help: 'A custom gauge metric',
  labelNames: ['label'],
});

const customSummary = new prometheus.Summary({
  name: 'custom_summary_seconds',
  help: 'A custom summary metric',
  labelNames: ['label'],
});

// Enable collection of default metrics
prometheus.collectDefaultMetrics();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Sample data (in-memory storage)
let users = [
  { id: 1, name: 'ridhiman' },
  { id: 2, name: 'Jane Doe' },
];

// Middleware to measure the duration of HTTP requests
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const end = Date.now();
    const durationMicroseconds = end - start;
    httpRequestDurationMicroseconds
      .labels(req.method, req.route.path, res.statusCode)
      .observe(durationMicroseconds / 1000000);
  });
  next();
});

// Endpoint to increment the custom counter
app.get('/increment-counter', (req, res) => {
  customCounter.labels('example').inc();
  res.send('Counter incremented!');
});

// Endpoint to get all users
app.get('/users', (req, res) => {
  res.json(users);
});

// Endpoint to create a new user
app.post('/users', (req, res) => {
  const newUser = { id: users.length + 1, name: req.body.name };
  users.push(newUser);
  res.status(201).json(newUser);

  // Increment the custom gauge and observe the summary
  customGauge.labels('example').inc();
  customSummary.labels('example').observe(Math.random());
});

// Endpoint to expose metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  const metrics = await prometheus.register.metrics();
  res.end(metrics);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
