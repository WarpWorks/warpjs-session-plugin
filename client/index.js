const warpjsUtils = require('@warp-works/warpjs-utils');

const template = require('./templates/index.hbs');

(($) => {
    $(document).ready(() => {
        warpjsUtils.getCurrentPageHAL($)
            .then((result) => {
                const content = template(result.data);

                $('#warpjs-content-placeholder').html(content);
            });
    });
})(jQuery);
