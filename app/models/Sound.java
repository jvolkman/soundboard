package models;
 
import java.security.MessageDigest;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import javax.persistence.Basic;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OrderBy;

import play.data.validation.Required;
import play.db.jpa.Model;
import play.exceptions.UnexpectedException;
import play.libs.Codec;
 
@Entity
public class Sound extends Model {
	@Required
	public String originalName;
	
	@Required
	public String name;

	@Required
	public String mime;
	
	@Required
	@Basic(fetch = FetchType.LAZY)
	@Lob
	public byte[] data;

	@Required
	@ManyToOne
	public User addedBy;
	
	@Required
	public Date addedDate;
	
	@ManyToMany
	@OrderBy(value="name")
	public List<Tag> tags;
	
	public String hash;
	
	public Sound(String name, String mime, User addedBy, Date addedDate, byte[] data) {
		this.name = name;
		this.originalName = name;
		this.mime = mime;
		this.addedBy = addedBy;
		this.addedDate = addedDate;
		this.data = data;
		this.tags = new LinkedList<Tag>();
	}
	
	public void setData(byte[] data) {
	    this.data = data;
	    setHash(MD5(data));
	}
	
	private void setHash(String hash) {
	    this.hash = hash;
	}

    private static String MD5(byte[] value) {
        try {
            MessageDigest messageDigest = MessageDigest.getInstance("MD5");
            messageDigest.reset();
            messageDigest.update(value);
            byte[] digest = messageDigest.digest();
            return Codec.byteToHexString(digest);
        } catch (Exception ex) {
            throw new UnexpectedException(ex);
        }
    }

}