/* 
 * Header 
 */
$(function(){
	// Header toolbar 
	$("#sb-header-toolbar-btn-volume").button({
    	text: false, 
    	icons:{primary: "ui-icon-volume-on"}
    }).click(tbVolumeHandler);
    $("#sb-header-toolbar-btn-remote").button({
    	text: false, 
    	icons:{primary: "ui-icon-signal-diag"}, 
    	disabled: (window._username === undefined)
	}).change(tbRemoteHandler);
    $("#sb-header-toolbar-btn-add").button({
    	text: false, 
    	icons:{primary: "ui-icon-plus", secondary: "ui-icon-triangle-1-s"}
    });

    // Login button
    $("#sb-login-button").click(showLogin);
    
    function tbVolumeHandler() {
    	switch($(this).is(":checked")) {
    	case true: alert("Volume on"); break;
    	case false: alert("Volume off"); break;
    	}
    }
    
    function tbRemoteHandler() {
    }
});

/* 
 * Login window 
 */
$(function() {
    $("#sb-login-form").submit(doLogin);
    $("#sb-create-user-form").submit(doCreateUser);
});

function showLogin() {
    $("#sb-login button").button();
    $("#sb-login-tabs").tabs({
        show: function() {
            $("#sb-login :input:text:visible:first").focus();
        }
    });
    $("#sb-login").dialog({
        modal: true,
        draggable: false,
        resizable: false,
        width: "400px",
        title: "Login",
    });
    $("#sb-login :input:text:visible:first").focus();
}

function doLogin() {
    $.post($("#sb-login-form").attr("action"), $("#sb-login-form").serialize(), function(data) {
        if (data.result) {
            window.location.reload();
        } else {
            $("#sb-login .sb-validation-box").hide();
            if (data.type == "InvalidUsername") {
                $("#sb-login-error-box .sb-validation-text").text("Invalid username");
            } else if (data.type == "InvalidPassword") {
                $("#sb-login-error-box .sb-validation-text").text("Invalid password");
            }
            $("#sb-login-error-box").show();
        }
    }, "json");
    return false;
}

function doCreateUser() {
    $.post($("#sb-create-user-form").attr("action"), $("#sb-create-user-form").serialize(), function(data) {
        if (data.result) {
            window.location.reload();
        } else {
            $("#sb-login .sb-validation-box").hide();
            if (data.type == "InvalidUsername") {
                $("#sb-create-user-error-box .sb-validation-text").text("User already exists");
            } else if (data.type == "InvalidPassword") {
                $("#sb-create-user-error-box .sb-validation-text").text("Passwords don't match");
            }
            $("#sb-create-user-error-box").show();
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

/*
 * Sound playback
 */

var _currentSounds = [];

function playSound(id) {
	var myAudioObj = new Audio("sound/" + id);
//	myAudioObj.first().volume = 0.0;
	myAudioObj.play();
}
