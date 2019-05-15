const createUser = require('./create-user');
const listAllUsers = require('./list-all-users');

module.exports = Object.freeze({
    get: async (req, res) => listAllUsers(req, res),
    post: async (req, res) => createUser(req, res)
});
