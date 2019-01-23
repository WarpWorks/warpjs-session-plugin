const findProperRedirectPage = require('./../lib/find-proper-redirect-page');

module.exports = (req, res) => {
    const redirectUrl = findProperRedirectPage(req);
    res.redirect(redirectUrl);
};
