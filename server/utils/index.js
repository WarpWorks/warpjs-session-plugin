const getDomain = require('./get-domain');
const getMemberEntity = require('./get-member-entity');
const getOrganization = require('./get-organization');
const getPersistence = require('./get-persistence');
const getUserEntity = require('./get-user-entity');
const resourceMessage = require('./resource-message');

module.exports = Object.freeze({
    getDomain: async (req) => getDomain(req),
    getMemberEntity: async (req) => getMemberEntity(req),
    getOrganization: async (persistence, domain) => getOrganization(persistence, domain),
    getPersistence: (req) => getPersistence(req),
    getUserEntity: async (req) => getUserEntity(req),
    resourceMessage: (resource, message) => resourceMessage(resource, message)
});
