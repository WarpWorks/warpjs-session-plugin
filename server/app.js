const express = require('express');
const path = require('path');

const routes = require('./routes');

const repoRoot = path.dirname(require.resolve('./../package.json'));

module.exports = (config, warpCore, Persistence, baseUrl, staticUrl) => {
    const app = express();

    baseUrl = (baseUrl === '/') ? '' : baseUrl;

    app.set('base-url', baseUrl);
    app.set('static-url', staticUrl);

    app.use('/assets', express.static(path.join(repoRoot, 'assets')));

    app.use(routes(config, warpCore, Persistence, '/', baseUrl || '/').router);

    return app;
};
