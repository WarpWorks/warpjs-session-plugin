const constants = require('./../constants');
const redirect = require('./../redirect');

module.exports = (config, warpCore, Persistence, req, res, next) => {
    if (req[constants.WARPJS_USER_REQ_KEY]) {
        next();
    } else {
        redirect(res, 401, req.originalUrl);
    }
};
