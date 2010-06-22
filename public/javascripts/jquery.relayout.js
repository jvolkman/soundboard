(function($){
$.fn.relayout = function(namespace, handler) {
    if (namespace && handler) {
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
    } else if (!namespace && !handler) {
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
