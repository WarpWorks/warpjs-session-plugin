const listAllCompanies = require('./list-all-companies');

module.exports = Object.freeze({
    get: (req, res) => listAllCompanies(req, res)
});
