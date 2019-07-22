const extend = require('lodash/extend');
const jwt = require('jsonwebtoken');
const omit = require('lodash/omit');

const debug = require('./debug')('cookies');

const ALGORITHM = 'HS256';
const COOKIE_OPTIONS = {
    signed: true,
    httpOnly: true,
    sameSite: 'Lax'
};

const VERIFY_OPTIONS = {
    algorithms: [ ALGORITHM ]
};

const get = (config, req, res) => {
    if (req.signedCookies) {
        const cookie = req.signedCookies[config.jwtCookieName];

        if (cookie) {
            try {
                const verifiedCookie = jwt.verify(cookie, config.jwtSecret, VERIFY_OPTIONS);
                return Object.freeze(omit(verifiedCookie, 'error'));
            } catch (e) {
                // TODO: Log this error
                return Object.freeze({ error: 'Invalid token' });
            }
        }
    }

    return Object.freeze({});
};

const send = (config, req, res, payload) => {
    const data = get(config, req, res);
    debug(`send(): data=`, data);

    const newPayload = extend({}, data, payload);

    const token = jwt.sign(omit(newPayload, [ 'iat', 'exp' ]), config.jwtSecret, {
        algorithm: ALGORITHM,
        expiresIn: '1d'
    });

    res.cookie(config.jwtCookieName, token, COOKIE_OPTIONS);
};

module.exports = Object.freeze({
    get: (config, req, res) => get(config, req, res),
    send: (config, req, res, payload) => send(config, req, res, payload)
});
