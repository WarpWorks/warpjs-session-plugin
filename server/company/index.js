const del = require('./delete');
const info = require('./info');
const patch = require('./patch');

module.exports = Object.freeze({
    delete: (req, res) => del(req, res),
    get: (req, res) => info(req, res),
    patch: (req, res) => patch(req, res)
});
