const constants = require('./../../lib/constants');

module.exports = {
    default: {
        options: {
            compress: true
        },
        files: [{
            dest: `assets/${constants.assets.css}`,
            src: 'client/style.less'
        }]
    }
};
