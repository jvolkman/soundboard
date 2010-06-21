
/* Window Layout */

var relayout;

$(function(){
    var _header = $("#header");
    var _content = $("#content");
    var _footer = $("#footer");
    var _main = $("#main");
    
    relayout = function() {
        _content.height(_main.outerHeight(true) - _header.outerHeight(true) - _footer.outerHeight(true) - (_content.outerHeight(true) - _content.height()));
    }
    relayout();
    $(window).resize(relayout);

    $("#loginButton").click(showLogin);
    $("#loginForm").submit(doLogin);
    $("#createUserForm").submit(doCreateUser);

    // Show initial fadein for header and footer
    $("body").bind("mouseover.initfadein", function() {
    	$("#header, #footer").delay(100).animate({opacity: 1}, {duration: 1500 }); 
    	$("body").unbind("mouseover.initfadein");
    });
});

/* Header area */

function showLogin() {
    $("#login button").button();
    $("#loginTabs").tabs({
        show: function() {
            $("#login :input:text:visible:first").focus();
        }
    });
    $("#login").dialog({
        modal: true,
        draggable: false,
        resizable: false,
        width: "400px",
        title: "Login",
    });
    $("#login :input:text:visible:first").focus();
}

function doLogin() {
    $.post($("#loginForm").attr("action"), $("#loginForm").serialize(), function(data) {
        if (data.result) {
            window.location.reload();
        } else {
            $(".loginError").text("");
            if (data.type == "InvalidUsername") {
                $("#loginUsernameError").text("Invalid username");
            } else if (data.type == "InvalidPassword") {
                $("#loginPasswordError").text("Invalid password");
            }
        }
    }, "json");
    return false;
}

function doCreateUser() {
    $.post($("#createUserForm").attr("action"), $("#createUserForm").serialize(), function(data) {
        if (data.result) {
            window.location.reload();
        } else {
            $(".loginError").text("");
            if (data.type == "InvalidUsername") {
                $("#createUserUsernameError").text("User already exists");
            } else if (data.type == "InvalidPassword") {
                $("#createUserPasswordError").text("Passwords don't match");
            }
        }
    }, "json");
    return false;
}

/* Sounds */

// Load sounds on ready
$(loadSounds);

function loadCategories() {
    $("#categories").tabs();
    $.getJSON('/categories', function(data) {
        for ( var i = 0; i < data.length; i++) {
            $("#categories").tabs("add", "#category-" + data[i].id, data[i].name)
        }
        for ( var i = 0; i < data.length; i++) {
            loadSounds(data[i].id);
        }
    });
};

function loadSounds() {
	$.getJSON('/sounds', function(data) {
		for ( var i = 0; i < data.length; i++) {
			var button = $("<a href='#' class='sound'>"
					+ data[i].name
					+ "</a>");
			button
			    .attr("sound-id", data[i].id)
			    .appendTo("#sounds");
		}
		$("#sounds > .sound")
		    .button()
		    .draggable({
		        revert: true,
		        zIndex: 10000,
		        appendTo: "body",
		        helper: "clone",
		        containment: ".layout"
		    })
		    .click(function() { playSound(this.getAttribute("sound-id")); return false; })
		    ;
	});
};

function playSound(id) {
	try {
		var myAudioObj = new Audio("sound/" + id);
		myAudioObj.play();
	} catch (e) {
		audioObjSupport = false;
		basicAudioSupport = false;
	}
}


/**
 * Footer area initialization
 */
$(function() {
    var _remoteTitle = $("#remoteTitle");
    var _remoteContainer = $("#remoteContainer");
//    var _remote = $("#remote");
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
    
    /**
     * Start remote drawer sizing
     */
    function startSplitMouse(evt) {
        $("body").css("-webkit-user-select", "none");   // Safari selects A/B text on a move
        _remoteTitle._posStart = evt.pageY;
        _remoteTitle._heightStart = _remoteContainer.height();
        $(document)
            .bind("mousemove", doSplitMouse)
            .bind("mouseup", endSplitMouse);
    }
    
    /**
     * Size remote drawer
     */
    function doSplitMouse(evt) {
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
    
    /*
     * Init remote splitter
     */
//    $("#remote").splitter();
    
    
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
});

