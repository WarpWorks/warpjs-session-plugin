const app = require('./server/app');
const canEdit = require('./lib/can-edit');
const middlewares = require('./server/middlewares');

function plugin(config, warpCore, Persistence) {
    return (baseUrl, staticUrl) => app(config, warpCore, Persistence, baseUrl, staticUrl);
}

plugin.middlewares = (config, warpCore, Persistence) => middlewares(config, warpCore, Persistence);
plugin.canEdit = (config, persistence, entity, instance, user) => canEdit(config, persistence, entity, instance, user);

module.exports = plugin;
