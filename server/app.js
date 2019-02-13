const bodyParser = require('body-parser');
const express = require('express');
const hbs = require('hbs');
const hbsUtils = require('hbs-utils')(hbs);
const path = require('path');
const warpjsUtils = require('@warp-works/warpjs-utils');

const casSSO = require('./middlewares/cas-sso');
const constants = require('./../lib/constants');
// const debug = require('./debug.js')('app.js');
const routes = require('./routes');
const ssoRoutes = require('./sso-routes');

const repoRoot = path.dirname(require.resolve('./../package.json'));

module.exports = (config, warpCore, Persistence, baseUrl, staticUrl) => {
    const app = express();

    // debug(`config=`, config);

    baseUrl = (baseUrl === '/') ? '' : baseUrl;

    app.set('view engine', 'hbs');
    app.set('views', warpjsUtils.getHandlebarsViewsDir());

    const handlebarsPartialsDir = warpjsUtils.getHandlebarsPartialsDir();
    hbsUtils.registerWatchedPartials(handlebarsPartialsDir, {
        precompile: true,
        name: (template) => {
            const newTemplateName = template.replace(/_/g, '-');
            return newTemplateName;
        }
    });

    app.set(constants.keys.baseUrl, baseUrl);
    app.set(constants.keys.staticUrl, staticUrl);
    app.set(constants.keys.config, config);
    app.set(constants.keys.core, warpCore);
    app.set(constants.keys.persistence, Persistence);

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use('/assets', express.static(path.join(repoRoot, 'assets')));

    app.use(routes('/', baseUrl || '/').router);

    if (casSSO.isCasSSO(config)) {
        app.use('/sso', ssoRoutes('/sso', baseUrl || '/').router);
    }

    return app;
};
