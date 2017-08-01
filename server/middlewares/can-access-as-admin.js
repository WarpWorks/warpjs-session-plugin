const canAccess = require('./can-access');

function hasAdminRole(config, role) {
    return role.label === config.roles.admin;
}

module.exports = (config, warpCore, Persistence, req, res, next) => {
    return canAccess(hasAdminRole.bind(null, config), config, warpCore, Persistence, req, res, next);
};
