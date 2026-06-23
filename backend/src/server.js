const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');

const server = app.listen(env.port, () => {
  logger.info(`Server running in ${env.env} mode on port ${env.port}`);
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection! Shutting down...', err);
  server.close(() => {
    process.exit(1);
  });
});
