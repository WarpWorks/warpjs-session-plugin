const companyResource = require('./company-resource');
const makeResource = require('./make-resource');
const sendErrorResource = require('./send-error-resource');
const sendResource = require('./send-resource');

module.exports = Object.freeze({
    ENTITIES: Object.freeze({
        MEMBER: 'Member',
        ORGANIZATION: 'Organization'
    }),
    RELATIONSHIPS: Object.freeze({
        MEMBERS: 'Members'
    }),
    companyResource: (req, companyInstance) => companyResource(req, companyInstance),
    makeResource: (req, data) => makeResource(req, data),
    sendErrorResource: (res, err, resource) => sendErrorResource(res, err, resource),
    sendResource: (res, status, resource) => sendResource(res, status, resource)
});
