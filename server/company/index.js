const del = require('./delete');
const info = require('./info');
const patch = require('./patch');

module.exports = Object.freeze({
    delete: async (req, res) => del(req, res),
    get: async (req, res) => info(req, res),
    patch: async (req, res) => patch(req, res),
    put: async (req, res) => patch(req, res) // NOTE: Added because SSO server cannot do PATCH
});
