const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./config/logger');
const env = require('./config/env');
const errorMiddleware = require('./common/middlewares/error.middleware');
const notFoundMiddleware = require('./common/middlewares/not-found.middleware');

const app = express();

app.use(helmet());
// CORS configuration - allowing the configured frontend origin to access the API
app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

// App level router placeholder (Task 4 will mount routes here)
const routes = require('./routes');
app.use('/api/v1', routes);

// Not Found and Error Middlewares
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
