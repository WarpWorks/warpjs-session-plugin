const RoutesInfo = require('@quoin/expressjs-routes-info');

const fullUrl = require('./full-url');

const DEFAULT_DESTINATION = '/';

module.exports = (req) => {
    if (req.body.redirect) {
        return req.body.redirect;
    }

    const referrer = req.headers.referer;
    if (referrer) {
        const pageUrl = fullUrl.fromReq(req);
        const referrerUrl = fullUrl.fromBase(referrer, pageUrl);

        if (referrerUrl.host !== req.headers.host) {
            // They logged in from another site?
            return DEFAULT_DESTINATION;
        } else if (referrerUrl.pathname === RoutesInfo.expand('W2:plugin:session:login', {})) {
            // We are on the login form, send to home page.
            return DEFAULT_DESTINATION;
        } else {
            return referrer;
        }
    } else {
        return DEFAULT_DESTINATION;
    }
};
