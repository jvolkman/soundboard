/*
 * jQuery plugin which stretches a div to reach another div below it.
 * usage: $(selector).govertical([div1, div2, ...])
 * 
 * divs will be tried in order. The first one wins.
 */
(function($){
/* this: a jQuery object */
function doit(args) {
    return this.each(function() {
        var $this = $(this);
        args = $.extend({}, $.fn.goVertical.defaults, args);
        if ($.metadata) {
            $.extend(args, $this.metadata());
        }
        if (args && args.boundary) {
            var boundary = args.boundary instanceof Array ? args.boundary : [args.boundary];
            var from = $this.offset().top + $this.outerHeight(false) + (args.includeMargins ? parseInt($this.css("margin-bottom")) : 0);
            for (var i in boundary) {
                var el = $(boundary[i]);
                if (el.is(":visible")) {
                    var to = el.offset().top - (args.includeMargins ? parseInt(el.css("margin-top")) : 0);
                    $this.height($this.height() + (to - from));
                    break;
                }
            }
        }            
    });
};

$.fn.goVertical = function(args) {
    if ($.relayout) {
        this.relayout("govertical", function() {
            doit.call($(this), args);
        });
    }
    return doit.call(this, args);
};

$.fn.goVertical.defaults = {
    includeMargins: true
};

})(jQuery);
