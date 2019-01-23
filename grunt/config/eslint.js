module.exports = {
    options: {
        fix: true,
        useEslintrc: false,
        parserOptions: {
            ecmaVersion: 8
        }
    },
    node: {
        options: {
            baseConfig: {
                root: true,
                extends: '@quoin/eslint-config-quoin'
            },
            rules: {
                'no-console': 'warn',
                'node/no-deprecated-api': 'warn'
            }
        },
        src: [
            '*.js',
            '!*.test.js',
            'grunt/**/*.js',
            'lib/**/*.js',
            '!lib/**/*.test.js',
            'server/**/*.js',
            '!server/**/*.test.js'
        ]
    },
    client: {
        options: {
            baseConfig: {
                root: true,
                extends: '@quoin/eslint-config-quoin/client'
            },
            envs: [
                'jquery',
                'node'
            ],
            globals: [
                '$warp'
            ],
            rules: {
            }
        },
        src: [
            'client/**/*.js',
            '!client/**/*.test.js'
        ]
    },
    test: {
        options: {
            baseConfig: {
                root: true,
                extends: '@quoin/eslint-config-quoin/node-test'
            }
        },
        src: [
            '*.test.js',
            'client/**/*.test.js',
            'server/**/*.test.js'
        ]
    }

};
