// 4.1 4.2 4.8 4.9 4.10 4.11 4.12 4.13 4.14 4.15 4.17 4.18 4.19

const http = require('http');
const app = require('./app');
const config = require('./utils/config');
const logger = require('./utils/logger');

const server = http.createServer(app);

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
