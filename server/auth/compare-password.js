const bcrypt = require('bcrypt-nodejs');
const Promise = require('bluebird');

module.exports = (clearText, crypted) => new Promise((resolve, reject) => {
    try {
        if (bcrypt.compareSync(clearText, crypted)) {
            resolve();
        } else {
            reject(new Error());
        }
    } catch (err) {
        // The password might not be a valid bcrypt hash format.
        reject(new Error());
    }
});
