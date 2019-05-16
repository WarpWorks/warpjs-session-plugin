const resourceMessage = require('./resource-message');

module.exports = (resource, message) => {
    resourceMessage(resource, message);
    resource.error = true;
};
