const sendResource = require('./send-resource');

module.exports = (res, err, resource) => {
    // eslint-disable-next-line no-console
    console.error("Error:", err);
    resource.message = err.message;
    sendResource(res, 500, resource);
};
