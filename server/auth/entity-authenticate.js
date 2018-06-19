const Promise = require('bluebird');

const comparePassword = require('./compare-password');
const userInfo = require('./user-info');

module.exports = (config, persistence, entity, username, password) => {
    const query = {
        [config.users.usernameField]: username
    };

    return Promise.resolve()
        .then(() => entity.getDocuments(persistence, query))
        .then((docs) => {
            if (docs && docs.length) {
                if (docs.length > 1) {
                    // FIXME: This should not be needed, but there are no checks
                    // on the content level to eliminate duplicates.
                    throw new Error(`Duplicate accounts for '${username}'.`);
                }

                const accountInstance = docs.pop();

                return comparePassword(password, accountInstance[config.users.passwordField])
                    .then(() => userInfo(persistence, entity, accountInstance))
                ;
            } else {
                // TODO: We should log this to track attacks?
                // eslint-disable-next-line no-console
                console.error(`Account '${username}' not found.`);
                throw new Error();
            }
        })
    ;
};
