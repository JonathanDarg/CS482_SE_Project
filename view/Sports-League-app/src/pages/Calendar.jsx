import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./Calendar.css";

function Calendar() {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    location: "",
    typeOfMatch: "",
    rating: "",
    dateTime: "",
    homeTeam: "",
    awayTeam: "",
  });

  // Load events when page loads
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch all events
  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/events");
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();

      setEvents(
        data.map((e) => ({
          id: e._id,
          title: `${e.homeTeam?.name || ""} vs ${e.awayTeam?.name || ""} @ ${e.location}`,
          date: e.dateTime,
          extendedProps: {
            location: e.location,
            rating: e.rating,
            typeOfMatch: e.typeOfMatch,
            homeTeam: e.homeTeam,
            awayTeam: e.awayTeam,
          },
        }))
      );
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  // Open modal when a date is clicked
  const handleDateClick = (info) => {
    setFormData({
      location: "",
      typeOfMatch: "",
      rating: "",
      dateTime: info.dateStr + "T12:00",
      homeTeam: "",
      awayTeam: "",
    });
    setModalOpen(true);
  };

  // Handle new event form submission
  const handleAddEvent = async (e) => {
    e.preventDefault();

    const dataToSend = {
      location: formData.location,
      typeOfMatch: formData.typeOfMatch,
      dateTime: formData.dateTime,
      homeTeam: { name: formData.homeTeam },
      awayTeam: { name: formData.awayTeam },
    };

    try {
      const res = await fetch("http://localhost:4000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) throw new Error("Failed to create event");
      setModalOpen(false);
      await fetchEvents();
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  // Handle clicking an existing event
  const handleEventClick = (info) => {
    const event = info.event;
    setSelectedEvent(event);
    setFormData({
      location: event.extendedProps.location,
      typeOfMatch: event.extendedProps.typeOfMatch,
      rating: event.extendedProps.rating || "",
      dateTime: event.startStr.slice(0, 16),
      homeTeam: event.extendedProps.homeTeam?.name || "",
      awayTeam: event.extendedProps.awayTeam?.name || "",
    });
    setEditModalOpen(true);
  };

  // Handle editing event
  const handleUpdateEvent = async (e) => {
    e.preventDefault();

    const dataToSend = {
      location: formData.location,
      typeOfMatch: formData.typeOfMatch,
      dateTime: formData.dateTime,
      homeTeam: { name: formData.homeTeam },
      awayTeam: { name: formData.awayTeam },
      rating: formData.rating,
    };

    try {
      const res = await fetch(
        `http://localhost:4000/api/events/${selectedEvent.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!res.ok) throw new Error("Failed to update event");
      setEditModalOpen(false);
      await fetchEvents();
    } catch (err) {
      console.error("Error updating event:", err);
    }
  };

  // Handle deleting event
  const handleDeleteEvent = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(
        `http://localhost:4000/api/events/${selectedEvent.id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete event");
      setEditModalOpen(false);
      await fetchEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  return (
    <div className="calendar-page">
      <h1>Baseball Game Calendar</h1>
      <div className="card">
        <p>
          Click a date to add a new event. Click an existing event to edit or
          delete it.
        </p>
      </div>

      <div className="calendar">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          events={events}
        />
      </div>

      {/* Add Event Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Event</h2>
            <form onSubmit={handleAddEvent}>
              <label>
                Location:
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Type of Match:
                <input
                  type="text"
                  value={formData.typeOfMatch}
                  onChange={(e) =>
                    setFormData({ ...formData, typeOfMatch: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Home Team:
                <input
                  type="text"
                  value={formData.homeTeam}
                  onChange={(e) =>
                    setFormData({ ...formData, homeTeam: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Away Team:
                <input
                  type="text"
                  value={formData.awayTeam}
                  onChange={(e) =>
                    setFormData({ ...formData, awayTeam: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Date and Time:
                <input
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) =>
                    setFormData({ ...formData, dateTime: e.target.value })
                  }
                  required
                />
              </label>
              <div className="modal-buttons">
                <button type="submit">Add Event</button>
                <button type="button" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit/Delete Event Modal */}
      {editModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Event</h2>
            <form onSubmit={handleUpdateEvent}>
              <label>
                Location:
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Type of Match:
                <input
                  type="text"
                  value={formData.typeOfMatch}
                  onChange={(e) =>
                    setFormData({ ...formData, typeOfMatch: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Home Team:
                <input
                  type="text"
                  value={formData.homeTeam}
                  onChange={(e) =>
                    setFormData({ ...formData, homeTeam: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Away Team:
                <input
                  type="text"
                  value={formData.awayTeam}
                  onChange={(e) =>
                    setFormData({ ...formData, awayTeam: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Date and Time:
                <input
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) =>
                    setFormData({ ...formData, dateTime: e.target.value })
                  }
                  required
                />
              </label>
              <div className="modal-buttons">
                <button type="submit">Save Changes</button>
                <button
                  type="button"
                  className="delete"
                  onClick={handleDeleteEvent}
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
