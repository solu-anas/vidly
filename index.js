const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

const port = process.env.PORT || 8000;
const server = app.listen(port, () => { winston.info(`Listening to Port ${port} ...`) });

module.exports = server;