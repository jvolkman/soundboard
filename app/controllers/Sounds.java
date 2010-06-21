package controllers;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.FilenameFilter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import javax.persistence.Basic;
import javax.persistence.FetchType;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;

import models.Sound;
import models.Tag;
import models.User;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;

import play.Play;
import play.data.Upload;
import play.data.validation.Required;
import play.mvc.*;

@With(Auth.class)
public class Sounds extends Controller {

    private static List<String> extensions = Arrays.asList(new String[] { "wav", "mp3", "ogg" });

    @Unguarded
    public static void listTags() {
        List<Tag> tags = Tag.findAll();
        List<SerializableTag> serializableCategories = new ArrayList<SerializableTag>(tags.size());
        for (Tag tag : tags) {
            serializableCategories.add(new SerializableTag(tag));
        }
        renderJSON(serializableCategories);
    }

    @Unguarded
    public static void listSounds(Long tagId) {
        List<Sound> sounds;
        if (tagId == null) {
            sounds = Sound.find("order by name").fetch();
        } else {
            Tag tag = Tag.findById(tagId);
            if (tag == null) {
                sounds = Collections.emptyList();
            } else {
                sounds = tag.sounds;
            }
        }
        List<SerializableSound> serializableSounds = new ArrayList<SerializableSound>(sounds.size());
        for (Sound sound : sounds) {
            serializableSounds.add(new SerializableSound(sound));
        }
        renderJSON(serializableSounds);
    }
    
    @Unguarded
    public static void getFile(Long soundId) {
        Sound sound = Sound.findById(soundId);
        if (sound == null) {
            notFound();
        } else {
            renderBinary(new ByteArrayInputStream(sound.data), sound.data.length);
        }
    }

    @Unguarded
    public static void getTagInfo(Long tagId) {
        Tag tag = Tag.findById(tagId);
        if (tag == null) {
            notFound();
        } else {
            renderJSON(new SerializableTag(tag));
        }
    }

    @Unguarded
    public static void getSoundInfo(Long soundId) {
        Sound sound = Sound.findById(soundId);
        if (sound == null) {
            notFound();
        } else {
            renderJSON(new SerializableSound(sound));
        }
    }

    public static void addSounds(List<Upload> soundFiles) {
    	soundFiles = (List<Upload>) request.args.get("__UPLOADS");
    	User user = Auth.getUser();
    	List<SerializableSound> result = new ArrayList<SerializableSound>();
        for (Upload file : soundFiles) {
        	byte[] soundBytes = file.asBytes();
            String name = file.getFileName();
            Sound sound = new Sound(name, "mp3", user, request.date, soundBytes).save();
            result.add(new SerializableSound(sound));
        }
        renderJSON(result);
    }

    private static class SerializableSound {
        Long id;
        String name;
        String addedBy;
        String category;
        Long[] tags;

        private SerializableSound(Sound sound) {
            this.id = sound.id;
            this.name = sound.name;
            this.addedBy = sound.addedBy.username;
            this.tags = new Long[sound.tags.size()];
            int i = 0;
            for (Tag tag : sound.tags){
                this.tags[i++] = tag.id;
            }
        }
    }

    private static class SerializableTag {
        Long id;
        String name;
        String addedBy;
        Date addedDate;
        
        private SerializableTag(Tag tag) {
            this.id = tag.id;
            this.name = tag.name;
            this.addedBy = tag.addedBy.username;
            this.addedDate = tag.addedDate;
        }
    }
}
