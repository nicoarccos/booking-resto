"use client";
import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react'; // FullCalendar React component
import dayGridPlugin from '@fullcalendar/daygrid'; // dayGrid plugin for month view
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // Plugin for events interaction
import React from 'react';
import AddAppointment from './AddAppointments'; // Import AddAppointment to display filtered slots
import { AvailableSlot } from './types';

export default function FullCalendarComponent() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // State for the selected date
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);

  useEffect(() => {
    if (selectedDate) {
      // Fetch available slots for the selected date
      fetch(`/api/schedules?date=${selectedDate}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          if (data.success) {
            setAvailableSlots(data.schedules || []);
          } else {
            console.error('Error in response:', data.message);
            setAvailableSlots([]);
          }
        })
        .catch(error => {
          console.error('Error fetching slots:', error);
          setAvailableSlots([]);
        });
    }
  }, [selectedDate]);

  // Handle date click
  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.dateStr);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
          }}
          events={events}
          dateClick={handleDateClick}
          height="auto"
        />
      </div>

      {selectedDate && (
        <div className="card mt-8">
          <h3 className="text-xl font-sans text-primary mb-6">
            Available Times for {selectedDate}
          </h3>
          <AddAppointment 
            selectedDate={selectedDate}
            availableSlots={availableSlots}
          />
        </div>
      )}
    </div>
  );
}



