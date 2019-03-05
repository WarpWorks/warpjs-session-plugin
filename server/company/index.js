const info = require('./info');
const patch = require('./patch');

module.exports = Object.freeze({
    get: (req, res) => info(req, res),
    patch: (req, res) => patch(req, res)
});
