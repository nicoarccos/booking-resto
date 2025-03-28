import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { success: false, message: 'La fecha es requerida' },
        { status: 400 }
      );
    }

    // Obtener las reservas existentes para la fecha seleccionada
    const { data: existingBookings, error: bookingsError } = await supabase
      .from('bookingsrestorant')
      .select('time')
      .eq('date', date)
      .eq('booked', true);

    if (bookingsError) {
      console.error('Error al obtener reservas existentes:', bookingsError);
      return NextResponse.json(
        { success: false, message: 'Error al verificar disponibilidad' },
        { status: 500 }
      );
    }

    // Lista de horarios disponibles
    const availableSlots = [
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
      '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
      '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'
    ];

    // Filtrar los horarios que ya están reservados
    const bookedTimes = existingBookings?.map(booking => booking.time) || [];
    const availableTimes = availableSlots.filter(time => !bookedTimes.includes(time));

    // Formatear los horarios disponibles para el calendario
    const formattedSlots = availableTimes.map(time => ({
      id: time,
      date: date,
      day: new Date(date).toLocaleDateString('es-ES', { weekday: 'long' }),
      time_slot: time,
      booked: false
    }));

    return NextResponse.json({
      success: true,
      schedules: formattedSlots
    });
  } catch (error) {
    console.error('Error en el endpoint de horarios:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener los horarios disponibles' },
      { status: 500 }
    );
  }
} 