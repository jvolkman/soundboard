/*
 * goVertical
 * Author: Jeremy Volkman <jvolkman@gmail.com>
 * 
 * 
 * jQuery plugin which stretches a div to reach another div below it.
 * Usage:
 *   $(selector).goVertical({boundary: <selector>});
 * OR
 *   $(selector).goVertical({boundary: [<selector1>, <selector2>, ...]});
 *   (divs will be tried in selection order. The first one wins.)
 * 
 * Options: 
 *   includeMargins: include margins in calculations (default: true)
 * 
 */
(function($){
/* this: a jQuery object */
function doit(args) {
    var from = this.offset().top + this.outerHeight(false) + (args.includeMargins ? parseInt(this.css("margin-bottom")) : 0);
    var $subject = this;

    outer:
    for (var i in args.boundary) {
    	var $boundary = $(args.boundary[i]);
    	for (var j = 0; j < $boundary.length; j++) {
            var $el = $($boundary[j]);
            if ($el.is(":visible")) {
                var to = $el.offset().top - (args.includeMargins ? parseInt($el.css("margin-top")) : 0);
                $subject.height($subject.height() + (to - from));
                break outer;
            }
        };
    }
};

$.fn.goVertical = function(args) {
    var opts = $.extend({}, $.fn.goVertical.defaults, args);
    return this.each(function() {
		var $this = $(this);
		var localOpts = opts;
		if ($.metadata) {
            localOpts = $.extend({}, opts, $this.metadata());
        }
		if (localOpts.boundary) {
		    if (!(localOpts.boundary instanceof Array)) {
		    	localOpts.boundary = [localOpts.boundary];
		    }
			if ($.relayout) {
		        $this.relayout("govertical", function() {
		            doit.call($(this), localOpts);
		        });
		    }
		    return doit.call($this, localOpts);
		}
	});
};

$.fn.goVertical.defaults = {
    includeMargins: true
};

})(jQuery);
