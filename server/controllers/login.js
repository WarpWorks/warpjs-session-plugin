const Promise = require('bluebird');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./../constants');
const redirect = require('./../redirect');
const redirectToProperPage = require('./redirect-to-proper-page');

module.exports = (config, warpCore, Persistence, req, res) => {
    const username = req.body && req.body.username;
    const password = req.body && req.body.password;

    const persistence = new Persistence(config.persistence.host, config.persistence.name);

    return Promise.resolve()
        .then(() => warpCore.getDomainByName(config.domainName))
        .then((domain) => domain.authenticateUser(persistence, username, password))
        .then(
            (user) => user,
            (error) => {
                // Could not find the user, but let's try to see if it's the
                // admin login.
                if (config.admin &&
                        config.admin.username === username &&
                        bcrypt.compareSync(password, config.admin.password)
                ) {
                    // TODO: This reflect a real user
                    return {
                        Name: "Default admin",
                        Roles: [{
                            type: "Role",
                            label: "admin"
                        }],
                        UserName: "admin",
                        type: "User",
                        _id: "-1"
                    };
                }
                throw error;
            }
        )
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
        .catch(() => {
            warpjsUtils.wrapWith406(res, {
                html: () => {
                    redirect(res, 'invalid', req.body.redirect || req.headers.referer);
                },

                [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => {
                    const resource = warpjsUtils.createResource(req, {
                        message: constants.ERROR_MESSAGES.invalid
                    });
                    warpjsUtils.sendHal(req, res, resource, RoutesInfo, 403);
                }
            });
        })
        .finally(() => {
            persistence.close();
        });
};
