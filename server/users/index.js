const listAllUsers = require('./list-all-users');

module.exports = Object.freeze({
    get: async (req, res) => listAllUsers(req, res)
});
