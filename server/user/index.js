const info = require('./info');
const updateUser = require('./update-user');

module.exports = Object.freeze({
    get: async (req, res) => info(req, res),
    patch: async (req, res) => updateUser(req, res),
    put: async (req, res) => updateUser(req, res) // NOTE: Added because SSO server cannot do PATCH
});
