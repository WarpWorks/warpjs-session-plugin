const getDomain = require('./get-domain');
const getMemberEntity = require('./get-member-entity');
const getPersistence = require('./get-persistence');

module.exports = Object.freeze({
    getDomain: async (req) => getDomain(req),
    getMemberEntity: async (req) => getMemberEntity(req),
    getPersistence: (req) => getPersistence(req)
});
