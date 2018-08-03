const warpjsUtils = require('@warp-works/warpjs-utils');

const template = require('./template.hbs');

(($) => $(document).ready(() => warpjsUtils.getCurrentPageHAL($)
    .then((result) => {
        const content = template(result.data);

        $(warpjsUtils.constants.CONTENT_PLACEHOLDER).html(content);
        warpjsUtils.documentReady($);
    })
))(jQuery);
