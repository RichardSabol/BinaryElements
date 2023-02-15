jQuery(function($) {
    $.i18n().load({
        "en": 'js/i18n/en.json',
        "sk": 'js/i18n/sk.json',
    }).done(function() {
        // $('[data-toggle="tooltip"]').tooltip({title: $.i18next("copied")})
        let lang = localStorage.getItem('language');
        let act_lang = document.documentElement.lang
        // console.log("saved is ", lang)
        // console.log("current is ", act_lang)
        if (lang !== act_lang && lang !== null) {
            // console.log("loading new language", lang)
            $.i18n().locale = lang
        }
        else{
            $.i18n().locale = act_lang
        }
        $('.locale-switcher').on('click', 'a', function(e) {
            e.preventDefault();
            let new_lang = $(this).data('locale')
            localStorage.setItem('language', new_lang);
            $.i18n().locale = new_lang;
            do_translate();
        });
        do_translate();
    });
});

function do_translate() {
    $('html').i18n();
}
