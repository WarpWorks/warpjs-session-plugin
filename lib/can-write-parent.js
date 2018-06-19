const Promise = require('bluebird');

// require() below to avoid circular.
module.exports = (persistence, entity, instance, user) => Promise.resolve()
    .then(() => entity.getParent(persistence, instance))
    .then((parent) => parent && parent.entity && parent.instance && require('./has-write-access')(persistence, parent.entity, parent.instance, user))
;
