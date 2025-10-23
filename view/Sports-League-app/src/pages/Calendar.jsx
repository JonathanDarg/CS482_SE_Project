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
    <div className="calendar-page">
      <h1>Youth Baseball League</h1>
      <div className="card">
        <p>
          Click on a date on the calendar to enter gameday information.
        </p>
      </div>
      <div className="calendar">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          events={events}
        />
      </div>
    </div>
  );
}

export default Calendar;
