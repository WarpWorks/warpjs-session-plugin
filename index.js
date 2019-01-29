const RoutesInfo = require('@quoin/expressjs-routes-info');

const app = require('./server/app');
const canEdit = require('./lib/can-edit');
const casSSO = require('./server/middlewares/cas-sso');
const middlewares = require('./server/middlewares');

function plugin(config, warpCore, Persistence) {
    return (baseUrl, staticUrl) => app(config, warpCore, Persistence, baseUrl, staticUrl);
}

plugin.middlewares = (config, warpCore, Persistence) => middlewares(config, warpCore, Persistence);
plugin.canEdit = (config, persistence, entity, instance, user) => canEdit(config, persistence, entity, instance, user);
plugin.isCasSSO = (config) => casSSO.isCasSSO(config);

plugin.getLoginUrl = (config, req) => casSSO.isCasSSO(config)
    ? casSSO.getLoginUrl(config, req)
    : RoutesInfo.expand('W2:plugin:session:login', {})
;

plugin.getLogoutUrl = (config, req) => casSSO.isCasSSO(config)
    ? casSSO.getLogoutUrl(config, req)
    : RoutesInfo.expand('W2:plugin:session:logout', {})
;

module.exports = plugin;
