const canAccessAsAdmin = require('./can-access-as-admin');
const canAccessAsContentManager = require('./can-access-as-content-manager');
const requiresWarpjsUser = require('./requires-warpjs-user');
const unauthorized = require('./unauthorized');
const warpjsUser = require('./warpjs-user');

module.exports = (config, warpCore, Persistence) => {
    return {
        canAccessAsAdmin: canAccessAsAdmin.bind(null, config, warpCore, Persistence),
        canAccessAsContentManager: canAccessAsContentManager.bind(null, config, warpCore, Persistence),
        requiresWarpjsUser: requiresWarpjsUser.bind(null, config, warpCore, Persistence),
        unauthorized: unauthorized.bind(null, config, warpCore, Persistence),
        warpjsUser: warpjsUser.bind(null, config, warpCore, Persistence)
    };
};
