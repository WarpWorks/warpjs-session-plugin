const canAccess = require('./can-access');

function hasAdminRole(config, role) {
    return role.label === config.roles.admin;
}

module.exports = (config, warpCore, Persistence) => {
    return canAccess.bind(null, hasAdminRole.bind(null, config), config, warpCore, Persistence);
};
