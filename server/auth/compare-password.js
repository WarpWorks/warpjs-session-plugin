module.exports = async (clearText, crypted) => {
    if (!clearText || !crypted || (clearText !== crypted)) {
        throw new Error(`Invalid password`);
    }
};
