const forEach = require('lodash/forEach');
const testHelpers = require('@quoin/node-test-helpers');
const Persistence = require('@warp-works/warpjs-mongo-persistence'); // FIXME: Create a mock-persistence
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const expect = testHelpers.expect;
const proxyquire = testHelpers.proxyquire.noCallThru().noPreserveCache();
const app = proxyquire(require.resolve('./app'), {
    'hbs-utils': () => ({
        registerWatchedPartials: () => {}
    })
});

const EXPECTED_COPYRIGHT_YEAR = (new Date()).getFullYear();

function verifyEachLink(expect, link) {
    expect(link).to.have.property('href');
    expect(link.href).to.be.a('string');
}

function verifyHal(expect, data) {
    expect(data).to.have.property('_links');
    expect(data._links).to.be.an('object');

    forEach(data._links, verifyEachLink.bind(null, expect));

    // We always have the copyrightYear
    expect(data).to.have.property('copyrightYear');
    expect(data.copyrightYear).to.equal(EXPECTED_COPYRIGHT_YEAR);
}

function initApp(config = {}, warpCore = {}) {
    const routesInfo = new RoutesInfo('/sub-path', '/base-url');
    routesInfo.route('entity', '/entity-path/type/{type}/id/{id}');

    warpjsUtils.cache.setConfig({
        headerItems: [{
            label: "Foo Bar",
            type: "FooBar",
            id: "123123123123"
        }]
    });
    return app(config, warpCore, Persistence, '/test', '/static-test');
}

function requestApp(config = {}, warpCore = {}) {
    require('@quoin/expressjs-routes-info/lib/cache').reset();
    return testHelpers.request(initApp(config, warpCore));
}

function expect406(err) {
    expect(err).to.be.an.instanceof(Error);
    expect(err.message).to.equal("Not Acceptable");
}

module.exports = {
    expect406,
    initApp,
    requestApp,
    verifyHal
};
