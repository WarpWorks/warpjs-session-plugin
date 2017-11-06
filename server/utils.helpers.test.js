const _ = require('lodash');
const testHelpers = require('@quoin/node-test-helpers');
const Persistence = require('@warp-works/warpjs-mongo-persistence'); // FIXME: Create a mock-persistence

const app = require('./app');

const expect = testHelpers.expect;

const EXPECTED_COPYRIGHT_YEAR = (new Date()).getFullYear();

function verifyEachLink(expect, link) {
    expect(link).to.have.property('href');
    expect(link.href).to.be.a('string');
}

function verifyHal(expect, data) {
    expect(data).to.have.property('_links');
    expect(data._links).to.be.an('object');

    _.forEach(data._links, verifyEachLink.bind(null, expect));

    // We always have the copyrightYear
    expect(data).to.have.property('copyrightYear');
    expect(data.copyrightYear).to.equal(EXPECTED_COPYRIGHT_YEAR);
}

function initApp(config = {}, warpCore = {}) {
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