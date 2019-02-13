const info = require('./info');

module.exports = Object.freeze({
    get: (req, res) => info(req, res)
});
