/*
 * Drawer
 * Author: Jeremy Volkman <jvolkman@gmail.com>
 * 
 * 
 */
(function($){
	
$.fn.drawer = function(args) {
	args = $.extend({}, $.fn.drawer.defaults, args);
	this.each(function(){
		var $container = $(this);
		var $handles = $(args.handleSelector, $container);
		
	    /**
	     * Start remote drawer sizing
	     */
	    function startSplitMouse(evt) {
	        $("body").css("-webkit-user-select", "none");   // Safari selects A/B text on a move
	        var drag = { posStart: evt.pageY, heightStart: $container.height() };
	        $container.data("drawer.drag", drag);
	        $(document)
	            .bind("mousemove", doSplitMouse)
	            .bind("mouseup", endSplitMouse);
	    }
	    
	    /**
	     * Size remote drawer
	     */
	    function doSplitMouse(evt) {
	    	var drag = $container.data("drag");
	    	var diff = evt.pageY - drag.posStart;
	    	
	    	var footerDiff = _footer.outerHeight(true) - _remoteContainer.height();
	    	var headerHeight = _header.outerHeight(true);
	    	var mainHeight = _main.outerHeight(true);
	    	var titleHeight = _remoteTitle.outerHeight(true);
	    	
	    	var diff = evt.pageY - _remoteTitle._posStart;
	        var newHeight = Math.max(_remoteTitle._heightStart - diff, titleHeight);
	        if (newHeight + footerDiff + headerHeight > mainHeight) {
	        	newHeight = mainHeight - headerHeight - footerDiff;
	        }
	        remoteContainerHeight(newHeight);
	        relayout();
	    }
	    
	    /**
	     * End remote drawer sizing
	     */
	    function endSplitMouse(evt) {
	        $("body").css("-webkit-user-select", "text");   // let Safari select text again
	        $(document)
	            .unbind("mousemove", doSplitMouse)
	            .unbind("mouseup", endSplitMouse);
	        updateRemoteCookies();
	    }
	    
	    /**
	     * Handler to start remote drawer sizing
	     */
	    _remoteTitle.mousedown(startSplitMouse);
		
	});
};

$.fn.drawer.defaults = {
	titleSelector: ".drawer-handle",
	minHeight: null,
	maxHeight: null,
	minHightFn: null,
	maxHeightFn: null
};

this.each()
	var _remoteTitle = $("#remoteTitle");
    var _remoteContainer = $("#remoteContainer");
//	    var _remote = $("#remote");
    var _header = $("#header");
    var _footer = $("#footer");
    var _main = $("#main");

    /**
     * Store layout cookies for current state
     */
	function updateRemoteCookies() {
		if ($("#playRemoteOption").is(":checked")) {
			$.cookie("remote.enabled", true, { expires: 365 });
			if (_remoteContainer.is(":hidden")) {
				$.cookie("remote.minimized", true, { expires: 365 });
			} else {
				$.cookie("remote.minimized", null);
				$.cookie("remote.height", _remoteContainer.height());
			}				
		} else {
			$.cookie("remote.enabled", null);
		}
	}
	
	/**
	 * Open the remote drawer
	 */
	function openRemote(showToggle, immediate) {
        animateRemote("show", showToggle, immediate);
    }

	/**
	 * Close the remote drawer
	 */
    function closeRemote(showToggle, immediate) {
        animateRemote("hide", showToggle, immediate);
    }

	/**
	 * Animate the remote drawer
	 */
    function animateRemote(what, showToggle, immediate) {
        _remoteContainer.animate({height: what, opacity: what}, {
        	duration: immediate ? 0 : 500, 
        	complete: function() { relayout(); updateRemoteCookies(); }, 
        	step: function() { relayout(); updateRemoteHeight(); }, 
        	easing: "swing"
        });
        $("#remoteToggle").animate({opacity: showToggle ? 1 : 0}, {duration: immediate ? 0 : 500, easing: "swing"});
        if (what == "show") {
            $("#remoteToggle").removeClass("ui-icon-plusthick").addClass("ui-icon-closethick");
        } else {
            $("#remoteToggle").removeClass("ui-icon-closethick").addClass("ui-icon-plusthick");
        }
    }

	/**
	 * Change handler for "Play Remote" option
	 */
    $("#playRemoteOption").change(function() {
        if ($(this).is(":checked")) {
			if ($.cookie("remote.minimized")) {
            	closeRemote(true);
        	} else {
        		openRemote(true);
        	}
        } else {
            closeRemote(false);
        }
    });
    
    /**
     * Change handler for "Mute" option
     */
    $("#muteOption").change(function() {
        if ($(this).is(":checked")) {
			$.cookie("muted", true, { expires: 365 });
        } else {
			$.cookie("muted", null);
        }
    });

    $("#remoteToggle").button().click(function() {
        if (_remoteContainer.is(":visible")) {
            closeRemote(true);
        } else {
            openRemote(true);
        }
        $(this).blur();
    });
    
    /**
     * Keep Remote drawer from passing header
     */
    function containRemote() {
    	if (_remoteContainer.is(":visible")) {
        	maxHeight = _main.outerHeight(true) - _header.outerHeight(true) - (_footer.outerHeight(true) - _remoteContainer.height());
        	if (_footer.outerHeight(true) + _header.outerHeight(true) > _main.outerHeight(true)) {
        		remoteContainerHeight(maxHeight);
            } else {
            	desiredHeight = $.cookie("remote.height") || _remoteContainer.height();
            	remoteContainerHeight(Math.min(desiredHeight, maxHeight));
            }
        }
    }

    /**
     * Resize handler to invoke containRemote
     */
    $(window).resize(containRemote);
    
    /**
     * Set #remote and #remoteContainer heights
     */
    function remoteContainerHeight(height) {
        _remoteContainer.height(height);
        updateRemoteHeight();
    }    	
    
    /**
     * Set #remote height
     */
    function updateRemoteHeight() {
    	return;
    	var titleHeight = _remoteTitle.outerHeight(true);
    	var remoteMargins = _remote.outerHeight(true) - _remote.height();
    	_remote.height(_remoteContainer.height() - titleHeight - remoteMargins - 1); // why -1? not sure
    }
    

    
    /*
     * Init remote splitter
     */
//	    $("#remote").splitter();
    
    
    /*
     *  Initialize elements from stored cookies 
     */
    if ($.cookie("muted")) {
        $("#muteOption").attr("checked", "checked");
    } else {
        $("#muteOption").removeAttr("checked", null);
    }
    
    var cookieHeight = $.cookie("remote.height");
    if (cookieHeight) {
    	_remoteContainer.css("height", cookieHeight + "px");
    }
    
    if ($.cookie("remote.enabled") && $("#playRemoteOption").is(":enabled")) {
        $("#playRemoteOption").attr("checked", "checked");
    	if ($.cookie("remote.minimized")) {
    		closeRemote(true, true);
    	} else {
    		openRemote(true, true);
    	}
    } else {
        $("#playRemoteOption").removeAttr("checked", null);
    }
})(jQuery);