const categories = require('./categories');
const companyResource = require('./company-resource');
const makeResource = require('./make-resource');
const sendErrorResource = require('./send-error-resource');
const sendResource = require('./send-resource');
const userResource = require('./user-resource');

module.exports = Object.freeze({
    ENTITIES: Object.freeze({
        ACCOUNT: 'Account',
        MEMBER: 'Member',
        ORGANIZATION: 'Organization',
        USER: 'User'
    }),
    RELATIONSHIPS: Object.freeze({
        ACCOUNTS: "Accounts",
        MEMBERS: 'Members',
        USERS: 'Users',
        WORKING_FOR: 'WorkingFor'
    }),
    STATUS: Object.freeze({
        false: 'Draft',
        true: 'InheritFromParent'
    }),
    VALID_STATUS: [ true, false ],
    categories,
    companyResource: (req, companyInstance) => companyResource(req, companyInstance),
    makeResource: (req, data) => makeResource(req, data),
    sendErrorResource: (res, err, resource) => sendErrorResource(res, err, resource),
    sendResource: (res, status, resource) => sendResource(res, status, resource),
    userResource: async (req, persistence, userEntity, userDocument) => userResource(req, persistence, userEntity, userDocument)
});
