const comparePassword = require('./compare-password');
const userInfo = require('./user-info');

module.exports = async (config, persistence, entity, username, password) => {
    const query = {
        [config.users.usernameField]: username
    };

    const docs = await entity.getDocuments(persistence, query);

    if (docs && docs.length) {
        if (docs.length > 1) {
            // FIXME: This should not be needed, but there are no checks
            // on the content level to eliminate duplicates.
            throw new Error(`Duplicate accounts for '${username}'.`);
        }

        const accountInstance = docs.pop();

        await comparePassword(password, accountInstance[config.users.passwordField]);
        return userInfo(persistence, entity, accountInstance);
    } else {
        // TODO: We should log this to track attacks?
        // eslint-disable-next-line no-console
        console.error(`Account '${username}' not found.`);
        throw new Error();
    }
};
