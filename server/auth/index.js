const comparePassword = require('./compare-password');
const entityAuthenticate = require('./entity-authenticate');
const userInfo = require('./user-info');

module.exports = async (config, warpCore, persistence, username, password) => {
    const domain = await warpCore.getDomainByName(config.domainName);
    const entity = await domain.getEntityByName(config.users.entity);

    try {
        const user = await entityAuthenticate(config, persistence, entity, username, password);
        return user;
    } catch (err) {
        // The user was not found, let's try to see if it's the default
        // admin login.
        if (config.admin && config.admin.username === username) {
            await comparePassword(password, config.admin.password);
            return userInfo.DEFAULT_ADMIN_USER;
        }
        throw new Error(); // Invalid user and invalid admin.
    }
};
