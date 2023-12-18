const helmet = require('helmet');
const compression = require('compression');

module.exports = function(app) {
    console.log('Setting Production environment ...')
    app.use(helmet());
    app.use(compression());
};