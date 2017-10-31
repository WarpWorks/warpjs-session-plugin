const app = require('./server/app');
const middlewares = require('./server/middlewares');

function plugin(config, warpCore, Persistence) {
    return (baseUrl, staticUrl) => app(config, warpCore, Persistence, baseUrl, staticUrl);
}

plugin.middlewares = middlewares;

module.exports = plugin;
