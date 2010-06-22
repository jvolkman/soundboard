/*
 * jQuery plugin which stretches a div to reach another div below it.
 * usage: $(selector).govertical([div1, div2, ...])
 * 
 * divs will be tried in order. The first one wins.
 */
jQuery.fn.govertical = function(boundaries) {
    if (boundaries) {
        if (!(boundaries instanceof Array)) {
            boundaries = [boundaries];
            $(this).data("govertical.boundaries", boundaries);
        }
    }
    this.each(function(){
        var boundaries = $(this).data("govertical.boundaries");
        if (boundaries) {
            var from = $(this).offset().top + $(this).outerHeight(false) + parseInt($(this).css("margin-bottom"));
            for (var i in boundaries) {
                var el = $(boundaries[i]);
                if (el.is(":visible")) {
                    var to = el.offset().top;
                    $(this).height($(this).height() + (to - from));
                    break;
                }
            }
        }
    });
};
