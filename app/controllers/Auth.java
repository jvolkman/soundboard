package controllers;

import java.util.HashMap;
import java.util.Map;

import models.User;
import play.libs.Crypto;
import play.mvc.Before;
import play.mvc.Controller;
import play.mvc.Http;

public class Auth extends Controller {
    @Before(unless={"login", "createUser"})
    static void checkAccess() throws Throwable {
        if(!isAuthenticated() && !loginFromRememberMeCookie()) {
            Unguarded unguarded = getActionAnnotation(Unguarded.class);
            if(unguarded == null) {
                unguarded = getControllerInheritedAnnotation(Unguarded.class);
                if (unguarded == null) {
                    forbidden();
                }
            }
        } else {
            User u = getUser();
            if (u != null) {
                renderArgs.put("user", u);
            }
        }
    }

    private static boolean loginFromRememberMeCookie() {
        Http.Cookie remember = request.cookies.get("rememberme");
        if(remember != null && remember.value.indexOf("-") > 0) {
            String sign = remember.value.substring(0, remember.value.indexOf("-"));
            String username = remember.value.substring(remember.value.indexOf("-") + 1);
            if(Crypto.sign(username).equals(sign)) {
                session.put("username", username);
                return true;
            }
        }
        return false;
    }
    
    static boolean isAuthenticated() {
        return session.contains("username");
    }
    
    static String getUsername() {
        return session.get("username");
    }
    
    static User getUser() {
        String username = getUsername();
        if (username != null) {
            return User.find("username = ?", username).first();
        }
        return null;
    }
    
    public static void login(String username, String password, boolean remember) {
        User u = User.find("username = ?", username).first();
        if (u == null) {
            renderJSON(new LoginResult(false, "InvalidUsername"));
        } else if (!u.password.equals(Crypto.passwordHash(password))) {
            renderJSON(new LoginResult(false, "InvalidPassword"));
        } else {
            if(remember) {
                response.setCookie("rememberme", Crypto.sign(username) + "-" + username, "90d");
            }
            session.put("username", u.username);
            renderArgs.put("user", u);
            renderJSON(new LoginResult(true, null));
        }
    }
    
    public static void createUser(String username, String password, String passwordConfirm, boolean remember) {
        if (!password.equals(passwordConfirm)) {
            renderJSON(new LoginResult(false, "InvalidPassword"));
            return;
        }
        User u = User.find("username = ?", username).first();
        if (u != null) {
            renderJSON(new LoginResult(false, "InvalidUsername"));
        } else {
            User newUser = new User(username, Crypto.passwordHash(password));
            newUser.save();
            login(username, password, remember);
        }
    }
 
    public static void logout() {
        session.remove("username");
        response.removeCookie("rememberme");
        Board.index();
    }
    
    private static class LoginResult {
        boolean result;
        String type;
        private LoginResult(boolean result, String type) {
            this.result = result;
            this.type = type;
        }
    }

}
