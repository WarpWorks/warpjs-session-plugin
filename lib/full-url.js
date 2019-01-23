const url = require('url');

module.exports = Object.freeze({
    fromReq: (req) => new url.URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`),
    fromBase: (path, base) => new url.URL(path, base)
});
