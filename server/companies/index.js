const createNewCompany = require('./create-new-company');
const listAllCompanies = require('./list-all-companies');

module.exports = Object.freeze({
    get: async (req, res) => listAllCompanies(req, res),
    post: async (req, res) => createNewCompany(req, res)
});
