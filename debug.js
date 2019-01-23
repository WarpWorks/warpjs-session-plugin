const debug = require('debug');

module.exports = (message) => debug(`W2:plugin:session:${message}`);
