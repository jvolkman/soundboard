/*
 * goVertical
 * Author: Jeremy Volkman <jvolkman@gmail.com>
 * 
 * 
 * jQuery plugin which stretches a div to reach another div below it.
 * Usage:
 *   $(selector).goVertical({boundary: <selector>});
 *   (divs will be tried in selection order. The first one wins.)
 * 
 * Options: 
 *   includeMargins: include margins in calculations (default: true)
 * 
 */
(function($){
/* this: a jQuery object */
function doit(args) {
    var $boundary = $(args.boundary);
    var from = this.offset().top + this.outerHeight(false) + (args.includeMargins ? parseInt(this.css("margin-bottom")) : 0);
    var $subject = this;
    $(args.boundary).each(function() {
        var $this = $(this);
        if ($this.is(":visible")) {
            var to = $this.offset().top - (args.includeMargins ? parseInt($this.css("margin-top")) : 0);
            $subject.height($subject.height() + (to - from));
            return false;
        }
    });
};

$.fn.goVertical = function(args) {
    args = $.extend({}, $.fn.goVertical.defaults, args);
	return this.each(function() {
		var $this = $(this);
		if ($.metadata) {
            args = $.extend({}, args, $this.metadata());
        }
		if (args.boundary) {
			if ($.relayout) {
		        $this.relayout("govertical", function() {
		            doit.call($(this), args);
		        });
		    }
		    return doit.call($this, args);
		}
	});
};

$.fn.goVertical.defaults = {
    includeMargins: true
};

})(jQuery);
