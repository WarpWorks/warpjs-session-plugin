const Promise = require('bluebird');

const canWriteParent = require('./can-write-parent');
const userHasRole = require('./user-has-role');

module.exports = (persistence, entity, instance, user) => Promise.resolve()
    .then(() => entity.getRelationshipByName('WriteAccess'))
    .then((relationship) => relationship ? relationship.getDocuments(persistence, instance) : [])
    .then((roles) => roles.reduce(
        (canAlreadyWrite, role) => canAlreadyWrite || userHasRole(user, role),
        false
    ))
    .then((canWrite) => canWrite || canWriteParent(persistence, entity, instance, user))
;
