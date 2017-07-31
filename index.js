const app = require('./server/app');
const middlewares = require('./server/middlewares');

function plugin(config, warpCore, Persistence) {
    return app.bind(null, config, warpCore, Persistence);
}

plugin.middlewares = middlewares;

module.exports = plugin;
