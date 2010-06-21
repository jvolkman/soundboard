package models;

import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import javax.persistence.Basic;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;

import play.data.validation.Required;
import play.db.jpa.Model;

@Entity
public class Tag extends Model {
    @Required
    public String name;
    
    @ManyToMany(mappedBy="tags", fetch=FetchType.LAZY)
    @OrderBy(value="name")
    public List<Sound> sounds;
    
    @Required
    @ManyToOne
    public User addedBy;
    
    @Required
    public Date addedDate;
    
    public Tag(String name, User addedBy, Date addedDate) {
        this.name = name;
        this.addedBy = addedBy;
        this.addedDate = addedDate;
    }
}
