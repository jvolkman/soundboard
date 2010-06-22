/*
 * Relayout
 * Author: Jeremy Volkman <jvolkman@gmail.com>
 * 
 * 
 * This jQuery plugin simplifies updating screen layouts of elements
 * that require javascript positioning.
 * 
 * Usage:
 *   $(selector).setRelayout(namespace, layout-fn);
 *     Initializes a relayout handler. layout-fn will be passed a single HTML element parameter
 *   
 *   $(selector).unsetRelayout(namespace);
 *     Removes a relayout handler.
 *     
 *   $(selector).relayout()
 *     Executes all relayout handlers on matching elements
 *     
 *   $.relayout();
 *     Executes all document-configured relayout handlers
 */

(function($){
$.fn.relayout = function() {
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
};

$.fn.setRelayout = function(namespace, handler) {
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
};

$.fn.unsetRelayout = function(namespace) {
    /* Remove handler */
    return this.each(function(){
        var $this = $(this);
        var handlers = $this.data("relayout.handlers");
        if (handlers) {
            delete handlers[namespace];
        }
        $this.removeClass("relayout");
    });
};

/* Function to call all relayout methods */
$.relayout = function() {
    $(".relayout").relayout();
};

/* Handler for generic window resize */
$(window).resize(function() { $.relayout(); });
})(jQuery);
