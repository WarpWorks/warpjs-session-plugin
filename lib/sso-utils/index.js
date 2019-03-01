const makeResource = require('./make-resource');
const sendResource = require('./send-resource');

module.exports = Object.freeze({
    ENTITIES: Object.freeze({
        MEMBER: 'Member' // FIXME: Hard-coded.
    }),
    makeResource: (req, data) => makeResource(req, data),
    sendResource: (res, status, resource) => sendResource(res, status, resource)
});
