module.exports = {
    default: {
        options: {
            compress: true
        },
        files: [{
            dest: 'assets/session.min.css',
            src: 'client/style.less'
        }]
    }
};
