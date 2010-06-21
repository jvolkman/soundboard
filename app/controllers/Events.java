package controllers;

import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

import play.mvc.Controller;
import play.mvc.With;

import models.Event;
import models.User;

@With(Auth.class)
public class Events extends Controller {
	
	static final long MAX_POLL_TIME = 10000;

	private static final AtomicLong eventIndex = new AtomicLong();
	
	/**
	 * Poll for new events. This method will block the client for 10 seconds, or until an event happens.
	 * At that point the client will process any events and retry. If no lastId is provided, it will return
	 * the last 10 messages.
	 */
	public static void poll(Long lastId) {
		if (System.currentTimeMillis() - request.date.getTime() >= MAX_POLL_TIME) {
			ok();
		}
		Long lastIndex = (Long) request.args.get("event.poll.index");
		boolean query;
		if (lastIndex == null) {
			request.args.put("event.poll.index", eventIndex.get());
			query = true;
		} else {
			query = lastIndex.longValue() != eventIndex.get();
		}
		if (query) {
			List<Event> events;
			if (lastId == null) {
				// send the last 10 message
				events = Event.find("order by id desc").fetch(10);
			} else {
				events = Event.find("id > ?", lastId).fetch();
			}
			if (!events.isEmpty()) {
				renderJSON(events);
			}
		}
		// If we got here, we need to block
		suspend(50);
	}
	
	public static void chat(String message) {
		User u = Auth.getUser();
		if (message != null && !message.trim().isEmpty()) {
			new Event(Event.Type.ChatMessage, u, message, request.date).save();
			eventIndex.incrementAndGet();
		}
	}

	public static void sound(Long soundId) {
		
	}
	
	public static void members() {
	}
}
