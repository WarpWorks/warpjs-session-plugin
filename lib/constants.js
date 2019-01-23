const packageJson = require('./../package.json');

const basename = packageJson.name.replace(/@/g, '').replace(/\//g, '-');
const version = packageJson.version;
const versionedName = `${basename}-${version}`;

module.exports = Object.freeze({
    basename,
    version,
    versionedName,
    assets: Object.freeze({
        css: `${versionedName}.min.css`,
        js: `${versionedName}.min.js`
    }),
    keys: Object.freeze({
        baseUrl: 'base-url',
        config: 'warpjs-config',
        core: 'warpjs-core',
        persistence: 'warpjs-persistence',
        staticUrl: 'static-url'
    })
});
