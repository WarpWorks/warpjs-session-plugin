const packageJson = require('./../../package.json');

module.exports = {
    assets: {
        src: [
            'assets'
        ]
    },
    test: {
        src: [
            'reports',
            '.nyc_output'
        ]
    },
    pack: {
        src: [
            `${packageJson.name.replace(/@/g, '').replace(/\//g, '-')}-*.tgz`
        ]
    }
};
