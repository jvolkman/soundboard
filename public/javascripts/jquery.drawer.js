/*
 * Drawer
 * Author: Jeremy Volkman <jvolkman@gmail.com>
 * 
 * 
 */
(function($){

$.fn.drawer = function(opts) {
	extendedOpts = $.extend({}, $.fn.drawer.defaults, opts);
	return this.each(function(){
	    // Copy
	    var args = $.extend({}, extendedOpts);
		var $container = $(this);
		var $handle = $(args.handle, $container);
		
		$handle.css("cursor", (args.direction == "up") ? "n-resize" : "s-resize");
		$container.data("drawer.args", args);
		$container.data("drawer.height", $container.height());
		
	    /**
	     * Start drawer sizing
	     */
	    function startResize(evt) {
	        $("body").css("-webkit-user-select", "none");   // Safari selects A/B text on a move
	        $("body").css("-moz-user-select", "none"); 
	        $container.css("-moz-user-select", "none"); 
	        var drag = { 
	        		posStart: evt.pageY, 
	        		innerHeightStart: $container.height(),
	        		outerHeightStart: $container.outerHeight(false), 
	        		topStart: $container.offset().top,
	        		bottomStart: $container.offset().top + $container.outerHeight(false)
	        };
	        $container.data("drawer.drag", drag);
	        $(document)
	            .bind("mousemove", doResize)
	            .bind("mouseup", endResize);
	    }
	    
	    /**
	     * Size drawer
	     */
	    function doResize(evt) {
	    	var drag = $container.data("drawer.drag");
	    	var diff = evt.pageY - drag.posStart;
	    	resizeDrawer($container, args.direction == "up" ? -diff : diff, drag);
	    }
	    
	    /**
	     * End remote drawer sizing
	     */
	    function endResize(evt) {
	        $("body").css("-webkit-user-select", null);   // let Safari select text again
	        $("body").css("-moz-user-select", null);
	        $container.css("-moz-user-select", null); 
	        $container.data("drawer.drag", null);
	        $(document)
	            .unbind("mousemove", doResize)
	            .unbind("mouseup", endResize);
	        drawerSizeChanged($container, $container.height());
	    }
	    
	    /**
	     * Handler to start remote drawer sizing
	     */
	    $handle.mousedown(startResize);
	    
	    if ($.relayout) {
	    	$container.relayout("drawer", function() {
	    		var $container = $(this);
	    		if (!$container.data("drawer.sizing")) {
		    		$container.data("drawer.sizing", true);
		    		resizeDrawer($container, 0);
		    		$container.data("drawer.sizing", null);
	    		}
	    	});
	    }
	});
};

$.fn.drawerMoveIn = function(amt) {
	return this.each(function() { 
		var $container = $(this);
		console.log("moveIn: " + amt);
		resizeDrawer($container, -amt);
	});
};

$.fn.drawerDragging = function() {
	if ($(this).data("drawer.drag")) return true;
	return false;
}

function resizeDrawer($container, amt, start) {
	var args = $container.data("drawer.args");
	var height = $container.height();
	var outerHeight = $container.outerHeight();
	if (!start) {
		start = {
				innerHeightStart: height,
				outerHeightStart: outerHeight,
				topStart: $container.offset().top,
				bottomStart: $container.offset().top + outerHeight
		};
	}
	
	// Normalize amt
	if (-amt > height) amt = -height;
	var innerHeightNew = Math.max(start.innerHeightStart + amt, 0);
	var outerHeightNew = Math.max(start.outerHeightStart + amt, 0);
	var topNew = (args.direction == "up") ? (start.topStart - amt) : (start.topStart);
	var bottomNew = (args.direction == "up") ? (start.bottomStart) : (start.bottomStart + amt);
	
	if (args.collisionDetector instanceof Function) {
//		var curHeight = $container.height();
    	var cArgs = {
    		innerHeightStart: start.innerHeightStart,
    		outerHeightStart: start.outerHeightStart,
    		innerHeightNew: innerHeightNew,
    		outerHeightNew: outerHeightNew,
    		amount: amt,
    		topStart: start.topStart,
    		bottomStart: start.bottomStart,
    		topNew: topNew,
    		bottomNew: bottomNew
    	};
    	var allowedHeight = args.collisionDetector.call($container, cArgs);
    	if (allowedHeight) innerHeightNew = allowedHeight;
    		
	}
	$container.data("drawer.sizing", true);
    $container.height(innerHeightNew);
    drawerSizeChanging($container, innerHeightNew);
	$container.data("drawer.sizing", null);
}

function sizeChange($container, newHeight, fn) {
    // Integrate with relayout plugin
	$container.data("drawer.height", newHeight);
	if ($.relayout) {
        $.relayout();
    }
    if (fn instanceof Function) {
        fn.call($container, newHeight);
    }
}

function drawerSizeChanging($container, newHeight) {
    sizeChange($container, newHeight, $container.data("drawer.args").sizeChanging);
}

function drawerSizeChanged($container, newHeight) {
    sizeChange($container, newHeight, $container.data("drawer.args").sizeChanged);
}

$.fn.drawer.defaults = {
    handle: ".drawer-handle",
    collisionDetector: null,
    direction: "up", // or "down"
	sizeChanging: null,
	sizeChanged: null,
	drawerOpening: null,
    drawerOpened: null,
	drawerClosing: null,
	drawerClosed: null,
};

//this.each()
//	var _remoteTitle = $("#remoteTitle");
//    var _remoteContainer = $("#remoteContainer");
////	    var _remote = $("#remote");
//    var _header = $("#header");
//    var _footer = $("#footer");
//    var _main = $("#main");
//
//    /**
//     * Store layout cookies for current state
//     */
//	function updateRemoteCookies() {
//		if ($("#playRemoteOption").is(":checked")) {
//			$.cookie("remote.enabled", true, { expires: 365 });
//			if (_remoteContainer.is(":hidden")) {
//				$.cookie("remote.minimized", true, { expires: 365 });
//			} else {
//				$.cookie("remote.minimized", null);
//				$.cookie("remote.height", _remoteContainer.height());
//			}				
//		} else {
//			$.cookie("remote.enabled", null);
//		}
//	}
//	
//	/**
//	 * Open the remote drawer
//	 */
//	function openRemote(showToggle, immediate) {
//        animateRemote("show", showToggle, immediate);
//    }
//
//	/**
//	 * Close the remote drawer
//	 */
//    function closeRemote(showToggle, immediate) {
//        animateRemote("hide", showToggle, immediate);
//    }
//
//	/**
//	 * Animate the remote drawer
//	 */
//    function animateRemote(what, showToggle, immediate) {
//        _remoteContainer.animate({height: what, opacity: what}, {
//        	duration: immediate ? 0 : 500, 
//        	complete: function() { relayout(); updateRemoteCookies(); }, 
//        	step: function() { relayout(); updateRemoteHeight(); }, 
//        	easing: "swing"
//        });
//        $("#remoteToggle").animate({opacity: showToggle ? 1 : 0}, {duration: immediate ? 0 : 500, easing: "swing"});
//        if (what == "show") {
//            $("#remoteToggle").removeClass("ui-icon-plusthick").addClass("ui-icon-closethick");
//        } else {
//            $("#remoteToggle").removeClass("ui-icon-closethick").addClass("ui-icon-plusthick");
//        }
//    }
//
//	/**
//	 * Change handler for "Play Remote" option
//	 */
//    $("#playRemoteOption").change(function() {
//        if ($(this).is(":checked")) {
//			if ($.cookie("remote.minimized")) {
//            	closeRemote(true);
//        	} else {
//        		openRemote(true);
//        	}
//        } else {
//            closeRemote(false);
//        }
//    });
//    
//    /**
//     * Change handler for "Mute" option
//     */
//    $("#muteOption").change(function() {
//        if ($(this).is(":checked")) {
//			$.cookie("muted", true, { expires: 365 });
//        } else {
//			$.cookie("muted", null);
//        }
//    });
//
//    $("#remoteToggle").button().click(function() {
//        if (_remoteContainer.is(":visible")) {
//            closeRemote(true);
//        } else {
//            openRemote(true);
//        }
//        $(this).blur();
//    });
//    
//    /**
//     * Keep Remote drawer from passing header
//     */
//    function containRemote() {
//    	if (_remoteContainer.is(":visible")) {
//        	maxHeight = _main.outerHeight(true) - _header.outerHeight(true) - (_footer.outerHeight(true) - _remoteContainer.height());
//        	if (_footer.outerHeight(true) + _header.outerHeight(true) > _main.outerHeight(true)) {
//        		remoteContainerHeight(maxHeight);
//            } else {
//            	desiredHeight = $.cookie("remote.height") || _remoteContainer.height();
//            	remoteContainerHeight(Math.min(desiredHeight, maxHeight));
//            }
//        }
//    }
//
//    /**
//     * Resize handler to invoke containRemote
//     */
//    $(window).resize(containRemote);
//    
//    /**
//     * Set #remote and #remoteContainer heights
//     */
//    function remoteContainerHeight(height) {
//        _remoteContainer.height(height);
//        updateRemoteHeight();
//    }    	
//    
//    /**
//     * Set #remote height
//     */
//    function updateRemoteHeight() {
//    	return;
//    	var titleHeight = _remoteTitle.outerHeight(true);
//    	var remoteMargins = _remote.outerHeight(true) - _remote.height();
//    	_remote.height(_remoteContainer.height() - titleHeight - remoteMargins - 1); // why -1? not sure
//    }
//    
//
//    
//    /*
//     * Init remote splitter
//     */
////	    $("#remote").splitter();
//    
//    
//    /*
//     *  Initialize elements from stored cookies 
//     */
//    if ($.cookie("muted")) {
//        $("#muteOption").attr("checked", "checked");
//    } else {
//        $("#muteOption").removeAttr("checked", null);
//    }
//    
//    var cookieHeight = $.cookie("remote.height");
//    if (cookieHeight) {
//    	_remoteContainer.css("height", cookieHeight + "px");
//    }
//    
//    if ($.cookie("remote.enabled") && $("#playRemoteOption").is(":enabled")) {
//        $("#playRemoteOption").attr("checked", "checked");
//    	if ($.cookie("remote.minimized")) {
//    		closeRemote(true, true);
//    	} else {
//    		openRemote(true, true);
//    	}
//    } else {
//        $("#playRemoteOption").removeAttr("checked", null);
//    }
})(jQuery);