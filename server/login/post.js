const Promise = require('bluebird');
const jwt = require('jsonwebtoken');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const auth = require('./../auth');
const constants = require('./../constants');
const redirect = require('./../redirect');
const redirectToProperPage = require('./../redirect-to-proper-page');

module.exports = (req, res) => {
    const username = req.body && req.body.username;
    const password = req.body && req.body.password;
    const config = req.app.get('warpjs-config');
    const warpCore = req.app.get('warpjs-core');
    const Persistence = req.app.get('warpjs-persistence');

    const persistence = new Persistence(config.persistence.host, config.persistence.name);

    return Promise.resolve()
        .then(() => auth(config, warpCore, persistence, username, password))
        .then((user) => {
            // TODO: What other things we want to add here?
            const payload = {
                user
            };

            const token = jwt.sign(payload, config.jwtSecret, {
                algorithm: 'HS256',
                expiresIn: '1d'
            });

            res.cookie(config.jwtCookieName, token, { signed: true, httpOnly: true, sameSite: true });
            warpjsUtils.wrapWith406(res, {
                html: () => {
                    redirectToProperPage(req, res);
                },

                [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => {
                    const resource = warpjsUtils.createResource(req, {
                    });
                    warpjsUtils.sendHal(req, res, resource, RoutesInfo);
                }
            });
        })
        .catch((err) => warpjsUtils.wrapWith406(res, {
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
        }))
        .finally(() => persistence.close())
    ;
};
