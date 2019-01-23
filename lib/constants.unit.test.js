const cloneDeep = require('lodash/cloneDeep');
const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./constants');

const expect = testHelpers.expect;

describe("lib/constants", () => {
    let clone;

    before(() => {
        clone = cloneDeep(moduleToTest);
    });

    after(() => {
        expect(clone).to.be.empty();
    });

    it("should expose an object", () => {
        expect(moduleToTest).to.be.an('object');
    });

    context("basename", () => {
        after(() => {
            delete clone.basename;
        })

        it("should define 'basename'", () => {
            expect(moduleToTest).to.have.property('basename');
            expect(moduleToTest.basename).to.be.a('string');
        });
    });

    context("version", () => {
        after(() => {
            delete clone.version;
        });

        it("should define 'version'", () => {
            expect(moduleToTest).to.have.property('version');
            expect(moduleToTest.version).to.be.a('string');
        });
    });

    context("versionedName", () => {
        after(() => {
            delete clone.versionedName;
        });

        it("should define 'versionedName'", () => {
            expect(moduleToTest).to.have.property('versionedName');
            expect(moduleToTest.versionedName).to.be.a('string');
        });
    });

    context("assets", () => {
        let assetsClone;

        before(() => {
            assetsClone = cloneDeep(moduleToTest.assets);
        });

        after(() => {
            expect(assetsClone).to.be.empty();
            delete clone.assets;
        });

        it("should define 'assets'", () => {
            expect(moduleToTest).to.have.property('assets');
            expect(moduleToTest.assets).to.be.an('object');
        });

        context("assets.css", () => {
            after(() => {
                delete assetsClone.css;
            });

            it("should define 'assets.css'", () => {
                expect(moduleToTest.assets).to.have.property('css');
                expect(moduleToTest.assets.css).to.be.a('string');
            });
        });

        context("assets.js", () => {
            after(() => {
                delete assetsClone.js;
            });

            it("should define 'assets.js'", () => {
                expect(moduleToTest.assets).to.have.property('js');
                expect(moduleToTest.assets.js).to.be.a('string');
            });
        });
    });

    context("keys", () => {
        let keysClone;

        before(() => {
            keysClone = cloneDeep(moduleToTest.keys);
        });

        after(() => {
            expect(keysClone).to.be.empty();
            delete clone.keys;
        });

        it("should define 'keys'", () => {
            expect(moduleToTest).to.have.property('keys');
            expect(moduleToTest.keys).to.be.an('object');
        });

        [
            'baseUrl',
            'config',
            'core',
            'persistence',
            'staticUrl'
        ].forEach((key) => {
            context(`keys.${key}`, () => {
                after(() => { delete keysClone[key]; });

                it(`should define 'keys.${key}'`, () => {
                    expect(keysClone).to.have.property(key);
                    expect(keysClone[key]).to.be.a('string');
                });
            });
        });
    });

});
