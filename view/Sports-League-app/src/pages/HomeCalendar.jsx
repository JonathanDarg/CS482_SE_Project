import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import "./Calendar.css";

function HomeCalendar() {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const calendarRef = useRef(null);
  const listRef = useRef(null);

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
          title: `${e.homeTeam?.name || "Home"} vs ${e.awayTeam?.name || "Away"} @ ${e.location}`,
          date: e.dateTime,
          extendedProps: {
            location: e.location,
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

  const handleDatesSet = (dateInfo) => {
    // Sync the list view with the calendar view
    if (listRef.current) {
      const listApi = listRef.current.getApi();
      try {
        const start = dateInfo.start instanceof Date ? dateInfo.start : new Date(dateInfo.start);
        const end = dateInfo.end instanceof Date ? dateInfo.end : new Date(dateInfo.end);
        const mid = new Date((start.getTime() + end.getTime()) / 2);
        listApi.gotoDate(mid);
      } catch (err) {
        listApi.gotoDate(dateInfo.start);
      }
    }
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl mb-3 inline-block relative">
            Calendar
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-linear-to-r from-orange-500 to-orange-600"></div>
          </h2>
          <p className="text-xl text-gray-600 mt-6">
            View upcoming events and games
          </p>
        </div>

        {/* Calendar and List View */}
        <div className="flex gap-12 items-start">
          {/* Calendar View */}
          <div className="flex-1 cursor-pointer" onClick={() => setModalOpen(true)}>
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next",
                center: "title",
                right: "dayGridMonth,timeGridWeek",
              }}
              events={events}
              editable={false}
              selectable={false}
              height="600px"
              datesSet={handleDatesSet}
            />
          </div>

          {/* List View */}
          <div className="w-80">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Event List</h3>
            </div>
            <FullCalendar
              ref={listRef}
              plugins={[listPlugin]}
              initialView="listMonth"
              headerToolbar={false}
              events={events}
              editable={false}
              selectable={false}
              height="550px"
            />
          </div>
        </div>

      </div>
    </section>
  );
}

export default HomeCalendar;