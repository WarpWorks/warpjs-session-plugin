module.exports = (resource, message) => {
    resource.message = resource.message ? `${resource.message}; ${message}` : message;
};
