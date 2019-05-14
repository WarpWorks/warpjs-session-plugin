const bcrypt = require('bcrypt-nodejs');

module.exports = async (clearText, crypted) => {
    try {
        if (bcrypt.compareSync(clearText, crypted)) {
            return;
        } else {
            throw new Error(`Invalid password`);
        }
    } catch (err) {
        // The password might not be a valid bcrypt hash format.
        throw new Error(`Invalid password`);
    }
};
