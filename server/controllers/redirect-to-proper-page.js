const RoutesInfo = require('@quoin/expressjs-routes-info');
const url = require('url');

module.exports = (req, res) => {
    const referrer = req.headers.referer;
    if (req.body.redirect) {
        res.redirect(req.body.redirect);
    } else if (referrer) {
        // TODO: During logout, if user is in protected page, login out would
        // bring him to the login page.
        const referrerUrl = url.parse(referrer);

        if (referrerUrl.host !== req.headers.host) {
            // They logged in from another site?
            res.redirect('/');
        } else if (referrerUrl.pathname === RoutesInfo.expand('W2:plugin:session:login')) {
            // We are on the login form, so just send to home page.
            res.redirect('/');
        } else {
            res.redirect(referrer);
        }
    } else {
        res.redirect('/');
    }
};
