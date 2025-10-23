import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '@fullcalendar/daygrid'; 
import './Calendar.css';

function Calendar() {
  const [events, setEvents] = useState([
 ]);

  const handleDateClick = (info) => {
    const title = prompt('Enter event title:');
    if (title) {
      setEvents([...events, { title, date: info.dateStr }]);
    }
  };

  return (
    <>
      <div className="calendar">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          events={events}
        />
      </div>
      <h1>Youth Baseball League</h1>
      <div className="card">
        <p>
          Welcome to the Youth Baseball League! Here you can find information about teams, schedules, and more.
        </p>
      </div>
    </>
  );
}

export default Calendar;
