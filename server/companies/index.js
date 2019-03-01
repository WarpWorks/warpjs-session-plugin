const createNewCompany = require('./create-new-company');
const listAllCompanies = require('./list-all-companies');

module.exports = Object.freeze({
    get: (req, res) => listAllCompanies(req, res),
    post: (req, res) => createNewCompany(req, res)
});
