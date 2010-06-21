package models;
 
import javax.persistence.Column;
import javax.persistence.Entity;

import play.data.validation.Required;
import play.db.jpa.Model;
 
@Entity
public class User extends Model {
 
    @Required
    @Column(unique = true)
    public String username;
    
    @Required
    public String password;
    
    public boolean isAdmin;
    
    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }
}