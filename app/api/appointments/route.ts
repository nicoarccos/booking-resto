import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/app/utils/sendEmail';
import { checkSupabaseConnection } from '@/app/utils/supabaseClient';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Verificar variables de entorno críticas
console.log('🔐 JWT_SECRET configurado:', !!process.env.JWT_SECRET);

// GET - Obtener citas
export async function GET() {
  try {
    const { data: bookings, error } = await supabase
      .from('bookingsrestorant')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error al obtener reservas:', error);
      return NextResponse.json(
        { success: false, message: 'Error al obtener las reservas' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error('Error en el endpoint GET de reservas:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener las reservas' },
      { status: 500 }
    );
  }
}

// POST - Crear una nueva cita
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer_email, customer_name, guests, notes, service, date, time } = body;

    // Verificar conexión con Supabase
    const connectionStatus = await checkSupabaseConnection();
    if (!connectionStatus.success) {
      console.warn('Advertencia: Problemas de conexión con Supabase:', connectionStatus.message);
      // Continuamos con la reserva en modo emergencia
    }

    // Verificar si el horario ya está reservado
    const { data: existingBooking, error: checkError } = await supabase
      .from('bookingsrestorant')
      .select('*')
      .eq('date', date)
      .eq('time', time)
      .eq('booked', true)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 es "no se encontraron registros"
      console.error('Error al verificar disponibilidad:', checkError);
      // Continuamos con la reserva en modo emergencia
    } else if (existingBooking) {
      return NextResponse.json(
        { success: false, message: 'Este horario ya está reservado. Por favor, seleccione otro horario.' },
        { status: 409 }
      );
    }

    // Crear la reserva
    const { data: booking, error: insertError } = await supabase
      .from('bookingsrestorant')
      .insert([
        {
          customer_email,
          customer_name,
          guests,
          notes,
          service,
          date,
          time,
          booked: true
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Error al crear la reserva:', insertError);
      // Intentamos enviar el email de confirmación incluso si falla la base de datos
      try {
        await sendEmail({
          to: customer_email,
          subject: 'Reserva en Modo Emergencia - Restaurante',
          html: `
            <h2>Reserva en Modo Emergencia</h2>
            <p>Estimado/a ${customer_name},</p>
            <p>Su reserva ha sido procesada en modo emergencia debido a problemas técnicos con nuestra base de datos.</p>
            <p><strong>Detalles de su reserva:</strong></p>
            <ul>
              <li>Fecha: ${date}</li>
              <li>Hora: ${time}</li>
              <li>Número de invitados: ${guests}</li>
              <li>Servicio: ${service}</li>
              ${notes ? `<li>Notas: ${notes}</li>` : ''}
            </ul>
            <p>Por favor, contacte al restaurante para confirmar su reserva.</p>
            <p>Disculpe las molestias.</p>
          `
        });
      } catch (emailError) {
        console.error('Error al enviar email de emergencia:', emailError);
      }
      return NextResponse.json(
        { 
          success: false, 
          message: 'No se puede procesar la reserva en este momento. Por favor, intente más tarde.',
          details: insertError.message
        },
        { status: 500 }
      );
    }

    // Enviar email de confirmación
    try {
      await sendEmail({
        to: customer_email,
        subject: 'Confirmación de Reserva - Restaurante',
        html: `
          <h2>¡Reserva Confirmada!</h2>
          <p>Estimado/a ${customer_name},</p>
          <p>Su reserva ha sido confirmada exitosamente.</p>
          <p><strong>Detalles de su reserva:</strong></p>
          <ul>
            <li>Fecha: ${date}</li>
            <li>Hora: ${time}</li>
            <li>Número de invitados: ${guests}</li>
            <li>Servicio: ${service}</li>
            ${notes ? `<li>Notas: ${notes}</li>` : ''}
          </ul>
          <p>¡Esperamos su visita!</p>
        `
      });
    } catch (emailError) {
      console.error('Error al enviar email de confirmación:', emailError);
      // No retornamos error al cliente si falla el email
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Reserva creada exitosamente',
      booking 
    });
  } catch (error) {
    console.error('Error en el endpoint de reservas:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al procesar la reserva. Por favor, intente nuevamente.',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar una cita existente
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const customerEmail = searchParams.get('customer_email');
    const body = await request.json();

    if (!id || !customerEmail) {
      return NextResponse.json(
        { success: false, message: 'Missing ID or customer email' },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from('bookingsrestorant')
      .select()
      .eq('id', id)
      .eq('customer_email', customerEmail)
      .single();

    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Appointment not found or unauthorized' },
        { status: 404 }
      );
    }

    const { data, error } = await supabase
      .from('bookingsrestorant')
      .update(body)
      .eq('id', id)
      .eq('customer_email', customerEmail)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, appointment: data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar una cita
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const customerEmail = searchParams.get('customer_email');

    if (!id || !customerEmail) {
      return NextResponse.json(
        { success: false, message: 'Missing ID or customer email' },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from('bookingsrestorant')
      .select()
      .eq('id', id)
      .eq('customer_email', customerEmail)
      .single();

    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Appointment not found or unauthorized' },
        { status: 404 }
      );
    }

    const { error } = await supabase
      .from('bookingsrestorant')
      .delete()
      .eq('id', id)
      .eq('customer_email', customerEmail);

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Appointment deleted successfully' 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 