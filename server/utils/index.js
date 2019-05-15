const getDomain = require('./get-domain');
const getMemberEntity = require('./get-member-entity');
const getOrganization = require('./get-organization');
const getPersistence = require('./get-persistence');

module.exports = Object.freeze({
    getDomain: async (req) => getDomain(req),
    getMemberEntity: async (req) => getMemberEntity(req),
    getOrganization: async (persistence, domain) => getOrganization(persistence, domain),
    getPersistence: (req) => getPersistence(req)
});
