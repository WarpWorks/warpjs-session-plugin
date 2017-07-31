const canAccess = require('./can-access');

function hasContentRole(config, role) {
    return role.label === config.roles.content || role.label === config.roles.admin;
}

module.exports = (config, warpCore, Persistence) => {
    return canAccess.bind(null, hasContentRole.bind(null, config), config, warpCore, Persistence);
};
