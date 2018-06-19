const canAccessAsAdmin = require('./can-access-as-admin');
const canAccessAsContentManager = require('./can-access-as-content-manager');
const requiresWarpjsUser = require('./requires-warpjs-user');
const unauthorized = require('./unauthorized');
const warpjsUser = require('./warpjs-user');

module.exports = (config, warpCore, Persistence) => Object.freeze({
    canAccessAsAdmin: (req, res, next) => canAccessAsAdmin(config, warpCore, Persistence, req, res, next),
    canAccessAsContentManager: (req, res, next) => canAccessAsContentManager(config, warpCore, Persistence, req, res, next),
    requiresWarpjsUser: (req, res, next) => requiresWarpjsUser(config, warpCore, Persistence, req, res, next),
    unauthorized: (err, req, res, next) => unauthorized(config, warpCore, Persistence, err, req, res, next),
    warpjsUser: (req, res, next) => warpjsUser(config, warpCore, Persistence, req, res, next)
});
