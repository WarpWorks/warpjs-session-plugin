const loadGruntConfig = require('load-grunt-config');
const path = require('path');

module.exports = function gruntfile(grunt) {
    loadGruntConfig(grunt, {
        configPath: path.join(__dirname, 'grunt', 'config'),
        jitGrunt: {
            customTasksDir: path.join('grunt', 'tasks'),
            staticMappings: {}
        },
        data: {
            packageJson: require('./package.json')
        }
    });
};
