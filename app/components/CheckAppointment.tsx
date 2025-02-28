// components/CheckAppointments.tsx

"use client";
import { useEffect } from 'react';

export default function CheckAppointments() {
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Fetch the appointments from the API route
        const response = await fetch('/api/booked.ts');
        const result = await response.json();

        if (response.ok) {
          // Log the fetched appointments to the console
          console.log('Appointments fetched:', result.appointments);
        } else {
          console.error('Error fetching appointments:', result.message);
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
      }
    };

    fetchAppointments();
  }, []); // Empty dependency array means this runs once when the component mounts

  return <div>Check the console for fetched appointments!</div>;
}



/*
export default function CheckConnection() {
  const makeApiCall = async () => {
    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hello: "world" }),
      });

      const data = await response.json();
      console.log('Response from API:', data);
    } catch (error) {
      console.error('Error making API call:', error);
    }
  };

  return <button onClick={makeApiCall}>Make API Call</button>;
}*/


