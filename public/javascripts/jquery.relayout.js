/*
 * Relayout
 * Author: Jeremy Volkman <jvolkman@gmail.com>
 * 
 * 
 * This jQuery plugin simplifies updating screen layouts of elements
 * that require javascript positioning.
 * 
 * Usage:
 *   $(selector).relayout(namespace, layout-fn);
 *     Initializes a relayout handler. layout-fn will be passed a single HTML element parameter
 *   
 *   $(selector).relayout(namespace, null);
 *     Removes a relayout handler.
 *     
 *   $(selector).relayout()
 *     Executes all relayout handlers on matching elements
 *     
 *   $.relayout();
 *     Executes all document-configured relayout handlers
 */

(function($){
$.fn.relayout = function(namespace, handler) {
	if (namespace) {
		if (handler instanceof Function) {
		    /* Add handler */
		    return this.each(function(){
		        var $this = $(this);
		        var handlers = $this.data("relayout.handlers");
		        if (!handlers) {
		            handlers = {};
		            $this.data("relayout.handlers", handlers);
		        }
		        handlers[namespace] = handler;
		        $this.addClass("relayout");
		    });
		} else if (handler == null) {
		    /* Remove handler */
		    return this.each(function(){
		        var $this = $(this);
		        var handlers = $this.data("relayout.handlers");
		        if (handlers) {
		            delete handlers[namespace];
		        }
		        $this.removeClass("relayout");
		    });
		}
	} else {
	    /* Execute handlers */
	    return this.each(function(){
	        var $this = $(this);
	        var handlers = $this.data("relayout.handlers");
	        if (handlers) {
	            for (i in handlers) {
	                handlers[i].call(this);
	            }
	        }
	    });
	}
	return this;
};

/* Function to call all relayout methods */
$.relayout = function() {
    $(".relayout").relayout();
};

/* Handler for generic window resize */
$(window).resize(function() { $.relayout(); });
})(jQuery);
