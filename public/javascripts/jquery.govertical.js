/*
 * jQuery plugin which stretches a div to reach another div below it.
 * usage: $(selector).govertical([div1, div2, ...])
 * 
 * divs will be tried in order. The first one wins.
 */
(function($){
/* takes a jQuery object */
function doit(boundaries) {
    return this.each(function() {
        var $this = $(this);
        var from = $this.offset().top + $this.outerHeight(false) + parseInt($this.css("margin-bottom"));
        for (var i in boundaries) {
            var el = $(boundaries[i]);
            if (el.is(":visible")) {
                var to = el.offset().top - parseInt(el.css("margin-top"));
                $this.height($this.height() + (to - from));
                break;
            }
        }
    });
}

$.fn.govertical = function(boundaries) {
    if (boundaries) {
        if (!(boundaries instanceof Array)) {
            boundaries = [boundaries];
        }
        if ($.fn.relayout) {
            this.each(function() {
                $(this).relayout("govertical", function() {
                    doit.call($(this), boundaries);
                });
            });
        }
        return doit.call(this, boundaries);
    }
};
})(jQuery);