const bodyParser = require('body-parser');
const express = require('express');
const hbs = require('hbs');
const hbsUtils = require('hbs-utils')(hbs);
const path = require('path');
const warpjsUtils = require('@warp-works/warpjs-utils');

const routes = require('./routes');

const repoRoot = path.dirname(require.resolve('./../package.json'));

module.exports = (config, warpCore, Persistence, baseUrl, staticUrl) => {
    const app = express();

    baseUrl = (baseUrl === '/') ? '' : baseUrl;

    app.set('view engine', 'hbs');
    app.set('views', warpjsUtils.getHandlebarsViewsDir());

    const handlebarsPartialsDir = warpjsUtils.getHandlebarsPartialsDir();
    hbsUtils.registerWatchedPartials(
        handlebarsPartialsDir,
        {
            precompile: true,
            name: (template) => {
                const newTemplateName = template.replace(/_/g, '-');
                return newTemplateName;
            }
        }
    );

    app.set('base-url', baseUrl);
    app.set('static-url', staticUrl);
    app.set('warpjs-config', config);
    app.set('warpjs-core', warpCore);
    app.set('warpjs-persistence', Persistence);

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use('/assets', express.static(path.join(repoRoot, 'assets')));

    app.use(routes('/', baseUrl || '/').router);

    return app;
};
