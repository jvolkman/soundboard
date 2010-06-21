package controllers;

import java.util.ArrayList;
import java.util.List;

import play.mvc.*;

@With(Auth.class)
public class Board extends Controller {

    @Unguarded
    public static void index() {
        render();
    }
   
}