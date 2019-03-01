// This is to be a hack on RoutesInfo not yet being able to handle middlewares.

const extend = require('lodash/extend');

const casSSO = require('./../../server/middlewares/cas-sso');
// const debug = require('./debug')('wrap-controllers');
const makeResource = require('./make-resource');
const sendResource = require('./send-resource');

const HTTP_METHODS = [
    'all',
    'delete',
    'get',
    'head',
    'options',
    'patch',
    'post',
    'put',
    'trace'
];

const wrapper = (func) => (req, res) => {
    const config = req.app.get('warpjs-config');

    if (casSSO.isValidKey(config, req)) {
        func(req, res);
    } else {
        const resource = makeResource(req, {
            message: "Invalid credentials"
        });

        sendResource(res, 403, resource);
    }
};

module.exports = (controllers) => HTTP_METHODS.reduce(
    (aggregator, method) => (controllers[method])
        ? extend(aggregator, { [method]: wrapper(controllers[method]) })
        : aggregator,
    {}
);
