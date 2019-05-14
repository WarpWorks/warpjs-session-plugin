const info = require('./info');

module.exports = Object.freeze({
    get: async (req, res) => info(req, res)
});
