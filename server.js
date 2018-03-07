require('babel-core/register');
require('babel-polyfill');
const app = require('./app');
const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8888;
const ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.listen(port, ip);

module.exports = app;
