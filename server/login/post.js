const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const auth = require('./../auth');
const constants = require('./../constants');
const cookies = require('./../../lib/cookies');
const redirect = require('./../redirect');
const redirectToProperPage = require('./../redirect-to-proper-page');

module.exports = async (req, res) => {
    const username = req.body && req.body.username;
    const password = req.body && req.body.password;
    const config = req.app.get('warpjs-config');
    const warpCore = req.app.get('warpjs-core');
    const Persistence = req.app.get('warpjs-persistence');

    const persistence = new Persistence(config.persistence.host, config.persistence.name);

    try {
        const user = await auth(config, warpCore, persistence, username, password);

        // TODO: What other things we want to add here?
        const payload = { user };

        cookies.send(config, req, res, payload);

        warpjsUtils.wrapWith406(res, {
            html: async () => {
                redirectToProperPage(req, res);
            },

            [warpjsUtils.constants.HAL_CONTENT_TYPE]: async () => {
                const resource = warpjsUtils.createResource(req, {
                });
                await warpjsUtils.sendHal(req, res, resource, RoutesInfo);
            }
        });
    } catch (err) {
        warpjsUtils.wrapWith406(res, {
            html: () => {
                redirect(res, 'invalid', (req.body && req.body.redirect) || req.headers.referer);
            },

            [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => {
                const resource = warpjsUtils.createResource(req, {
                    message: constants.ERROR_MESSAGES.invalid,
                    originalMessage: err.message
                });
                warpjsUtils.sendHal(req, res, resource, RoutesInfo, 403);
            }
        });
    } finally {
        persistence.close();
    }
};
