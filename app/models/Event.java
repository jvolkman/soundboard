package models;

import java.util.Date;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.Transient;

import play.data.validation.Required;
import play.db.jpa.Model;

@Entity
public class Event extends Model {

    public static enum Type {
        Basic, ChatMessage, TagAdded, SoundPlayed, SoundAdded, SoundRemoved, SoundMoved
    }

    @Required
    public Date date;

    @Required
    public String type;

    @ManyToOne
    @Basic(fetch = FetchType.LAZY)
    public User user;

    @ManyToOne
    @Basic(fetch = FetchType.LAZY)
    public Sound sound;

    @ManyToOne
    @Basic(fetch = FetchType.LAZY)
    public Tag tag;

    public String message;

    public Event() {}
    
    public Event(Type type, User user, String message, Date date) {
        this.user = user;
        this.message = message;
        this.date = date;
        this.type = type.toString();
    }

    public Event(Type type, User user, Sound sound, Date date) {
        this.user = user;
        this.sound = sound;
        this.date = date;
        this.type = type.toString();
    }

    public Event(Type type, User user, Tag tag, Date date) {
        this.user = user;
        this.tag = tag;
        this.date = date;
        this.type = type.toString();
    }

}