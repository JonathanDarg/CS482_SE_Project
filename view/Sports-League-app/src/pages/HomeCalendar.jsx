import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import "./Calendar.css";

function HomeCalendar() {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/events");
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();

      setEvents(
        data.map((e) => ({
          id: e._id,
          title: `${e.typeOfMatch} @ ${e.location}`,
          date: e.dateTime,
        }))
      );
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  return (
    <div className="flex">
      <div className="w-[600px] h-[800px] shrink-0 mr-8 cursor-pointer">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "dayGridMonth,timeGridWeek,listWeek",
          }}
          events={events}
          editable={false}
          selectable={false}
          height="50%"
          dateClick={() => setModalOpen(true)}
          eventClick={() => setModalOpen(true)}
        />
      </div>

      {/* Modal / Popup for full calendar view */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg w-[90%] h-[90%] overflow-auto">
            <button
              className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-400"
              onClick={() => setModalOpen(false)}
            >
              Close
            </button>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
              }}
              events={events}
              editable={false}
              selectable={false}
              height="100%"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default HomeCalendar;
