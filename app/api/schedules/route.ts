import { NextResponse } from 'next/server';
import { supabase } from '@/app/utils/supabaseClient';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { success: false, message: 'Date parameter is required' },
        { status: 400 }
      );
    }

    // Intentar obtener citas reservadas de Supabase, pero si falla, continuar con una lista vacía
    let bookedTimes: string[] = [];
    try {
      const { data: bookedAppointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('time')
        .eq('date', date);

      if (!appointmentsError && bookedAppointments) {
        bookedTimes = bookedAppointments.map(app => app.time);
      } 
    } catch (e) {
      console.warn('Error connecting to Supabase, proceeding with empty booked appointments:', e);
      // Continuar con lista vacía
    }

    // Generar horarios disponibles (12:00 PM a 9:00 PM con intervalos de 1 hora)
    const availableSlots = [];
    const startHour = 12; // 12 PM
    const endHour = 21;   // 9 PM

    for (let hour = startHour; hour < endHour; hour++) {
      const formattedHour = hour <= 12 ? hour : hour - 12;
      const ampm = hour < 12 ? 'AM' : 'PM';
      const timeSlot = `${formattedHour}:00 ${ampm}`;
      
      if (!bookedTimes.includes(timeSlot)) {
        availableSlots.push({
          id: hour - startHour + 1, // ID único basado en la hora
          date: date,
          day: new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
          time_slot: timeSlot,
          booked: false
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      schedules: availableSlots 
    });
  } catch (error) {
    console.error('Error in schedules API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 