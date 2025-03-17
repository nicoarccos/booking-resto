import { NextResponse } from 'next/server';
import { supabase } from '@/app/utils/supabaseClient';
import { sendEmail } from '@/app/utils/sendEmail';

// GET - Obtener citas
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    const { data, error } = await supabase
      .from('appointments')
      .select('*');

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    const filteredData = date
      ? data.filter(appointment => appointment.date === date)
      : data;

    return NextResponse.json({ success: true, appointments: filteredData });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Crear una nueva cita
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { schedule_id, customer_email, customer_name, notes, service, date, time } = body;

    // Validar los datos requeridos
    if (!customer_email || !customer_name || !service || (!schedule_id && (!date || !time))) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Si se proporciona schedule_id, obtener los detalles del horario
    if (schedule_id) {
      const { data: scheduleDetails, error: scheduleError } = await supabase
        .from('appointments_schedule')
        .select('*')
        .eq('id', schedule_id)
        .single();

      if (scheduleError || !scheduleDetails) {
        return NextResponse.json(
          { success: false, message: 'Invalid schedule ID' },
          { status: 400 }
        );
      }

      // Usar la fecha y hora del horario
      body.date = scheduleDetails.date;
      body.time = scheduleDetails.time;
    }

    // Verificar disponibilidad
    const { data: existingBooking } = await supabase
      .from('appointments')
      .select('*')
      .eq('date', body.date)
      .eq('time', body.time);

    if (existingBooking && existingBooking.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Time slot is already booked' },
        { status: 409 }
      );
    }

    // Crear la cita
    const { data, error } = await supabase
      .from('appointments')
      .insert([{
        ...body,
        booked: true
      }])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    // Enviar email de confirmación
    try {
      const emailSubject = 'Appointment Confirmation';
      const emailBody = `
        <h1>Appointment Confirmation</h1>
        <p>Dear ${customer_name},</p>
        <p>Your appointment has been confirmed for ${body.date} at ${body.time}.</p>
        <p>Service: ${service}</p>
        ${notes ? `<p>Notes: ${notes}</p>` : ''}
        <p>Thank you for choosing our service!</p>
      `;
      
      await sendEmail({
        to: customer_email,
        subject: emailSubject,
        text: emailBody.replace(/<[^>]*>/g, ''), // Versión sin HTML
        html: emailBody
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // No retornamos error aquí ya que la cita se creó correctamente
    }

    return NextResponse.json({ success: true, appointment: data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
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
      .from('appointments')
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
      .from('appointments')
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
      .from('appointments')
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
      .from('appointments')
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