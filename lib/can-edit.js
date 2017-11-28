const Promise = require('bluebird');

const hasWriteAccess = require('./has-write-access');

/**
 *  If user has admin role defined by the config, then automatically allow.
 *  Otherwise, validate each role for the instance. If not authorized, validate
 *  from parent.
 */
module.exports = (config, persistence, entity, instance, user) => Promise.resolve()
    .then(() => Boolean(user && user.Roles && user.Roles.filter((role) => role.Name === config.roles.admin).length))
    .then((canWrite) => canWrite || hasWriteAccess(persistence, entity, instance, user))
;
