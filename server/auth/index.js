const Promise = require('bluebird');

const comparePassword = require('./compare-password');
const entityAuthenticate = require('./entity-authenticate');
const userInfo = require('./user-info');

module.exports = (config, warpCore, persistence, username, password) => Promise.resolve()
    .then(() => warpCore.getDomainByName(persistence, config.domainName))
    .then((domain) => domain.getEntityByName(config.users.entity))
    .then((entity) => entityAuthenticate(config, persistence, entity, username, password))
    .then(
        (user) => user,
        () => {
            // The user was not found, let's try to see if it's the default
            // admin login.
            if (config.admin && config.admin.username === username) {
                return comparePassword(password, config.admin.password)
                    .then(() => userInfo.DEFAULT_ADMIN_USER)
                ;
            }
            throw new Error(); // Invalid user and invalid admin.
        }
    )
;
