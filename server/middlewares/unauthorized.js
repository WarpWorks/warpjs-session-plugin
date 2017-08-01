const redirect = require('./../redirect');

module.exports = (config, warpCore, Persistence, err, req, res, next) => {
    redirect(res, 403, req.originalUrl);
};
