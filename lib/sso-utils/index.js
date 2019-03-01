const makeResource = require('./make-resource');
const sendResource = require('./send-resource');

module.exports = Object.freeze({
    makeResource: (req, data) => makeResource(req, data),
    sendResource: (res, status, resource) => sendResource(res, status, resource)
});
