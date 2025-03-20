import { NextResponse } from 'next/server';
import { supabase, checkSupabaseConnection } from '@/app/utils/supabaseClient';
import { sendEmail } from '@/app/utils/sendEmail';

// Verificar variables de entorno críticas
console.log('🔐 JWT_SECRET configurado:', !!process.env.JWT_SECRET);

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
    // Verificar connection string de Supabase 
    console.log('🔑 SUPABASE URL configurada:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('🔑 SUPABASE ANON KEY configurada:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    // Verificar conexión a Supabase pero no bloquear si falla
    let connectionOk = true;
    let connectionError = null;
    try {
      console.log('🔍 Verificando conexión a Supabase...');
      const connectionStatus = await checkSupabaseConnection();
      if (!connectionStatus.connected) {
        console.error('⚠️ Warning: Supabase connection check failed:', connectionStatus.error, connectionStatus);
        connectionOk = false;
        connectionError = connectionStatus.error;
      } else {
        console.log('✅ Supabase connection verified successfully');
      }
    } catch (connErr) {
      console.error('❌ Connection check error:', connErr);
      connectionOk = false;
      connectionError = connErr instanceof Error ? connErr.message : 'Unknown connection error';
    }

    const body = await request.json();
    const { customer_email, customer_name, guests, notes, service, date, time } = body;

    // Validar los datos requeridos
    if (!customer_email || !customer_name || !service || !date || !time) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Si hay problemas de conexión, permitimos crear la reserva sin verificación
    if (!connectionOk) {
      console.warn('Creating appointment without database verification due to connection issues');
      
      // Intentar enviar el correo de confirmación
      const emailSubject = 'Reserva Pre-Confirmada - Your Table Awaits!';
      const emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h1 style="color: #4a5568; text-align: center; padding-bottom: 10px; border-bottom: 1px solid #eee;">¡Su Reserva está Pre-Confirmada!</h1>
          
          <div style="padding: 20px 0;">
            <p style="font-size: 16px;">Estimado/a <strong>${customer_name}</strong>,</p>
            <p style="font-size: 16px;">Hemos recibido su solicitud de reserva para el <strong>${date}</strong> a las <strong>${time}</strong>.</p>
            
            <div style="background-color: #f7fafc; border-left: 4px solid #4299e1; padding: 15px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #2c5282;">Detalles de la Reserva</h3>
              <p><strong>Servicio:</strong> ${service}</p>
              <p><strong>Cantidad de Personas:</strong> ${guests}</p>
              ${notes ? `<p><strong>Notas:</strong> ${notes}</p>` : ''}
            </div>
            
            <p><strong>Nota</strong>: Debido a problemas técnicos, su reserva se procesará manualmente. Nos comunicaremos con usted si hay algún inconveniente con su solicitud.</p>
          </div>
          
          <div style="background-color: #2c5282; color: white; padding: 15px; text-align: center; border-radius: 0 0 4px 4px;">
            <p style="margin: 0;">¡Gracias por elegirnos! Esperamos darle la bienvenida pronto.</p>
          </div>
        </div>
      `;
      
      let emailSent = false;
      try {
        const emailResult = await sendEmail({
          to: customer_email,
          subject: emailSubject,
          text: emailBody.replace(/<[^>]*>/g, ''),
          html: emailBody
        });
        
        emailSent = emailResult.success;
      } catch (e) {
        console.error('Failed to send email:', e);
      }
      
      // Devolver una respuesta parcialmente exitosa
      return NextResponse.json({ 
        success: true, 
        appointment: {
          id: Date.now(),
          customer_email,
          customer_name,
          guests,
          notes,
          service,
          date,
          time,
          booked: true,
          provisional: true
        },
        email_sent: emailSent,
        warning: 'La reserva se procesó en modo de emergencia debido a problemas de conexión con la base de datos. Por favor, contacte con el restaurante para confirmar.'
      });
    }

    let appointmentData = null;
    
    // Verificar disponibilidad en Supabase - PASO CRÍTICO
    try {
      // Hacemos una consulta estricta para verificar si el slot ya está reservado
      const { data: existingBooking, error: checkError } = await supabase
        .from('appointments')
        .select('*')
        .eq('date', date)
        .eq('time', time);

      if (checkError) {
        // Log detallado del error para depuración
        console.error('Error checking availability details:', {
          error: checkError,
          message: checkError.message,
          details: checkError.details,
          hint: checkError.hint,
          code: checkError.code
        });
        
        // En lugar de devolver un error 500, procedemos con la reserva
        console.warn('Continuing with reservation despite availability check error');
      } else {
        // Verificación estricta: Si hay CUALQUIER reserva existente para esta fecha y hora, rechazar
        if (existingBooking && existingBooking.length > 0) {
          console.log(`Slot already booked for ${date} at ${time}. Existing bookings:`, existingBooking);
          return NextResponse.json(
            { success: false, message: 'El horario seleccionado ya está reservado. Por favor, seleccione otro horario.' },
            { status: 409 }
          );
        }
      }

      // Intentamos insertar la nueva reserva (incluso si hubo error en la verificación)
      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          customer_email,
          customer_name,
          guests,
          notes,
          service,
          date,
          time,
          booked: true
        }])
        .select()
        .single();

      if (error) {
        console.error('Error inserting appointment to Supabase:', error);
        return NextResponse.json(
          { success: false, message: 'Error al guardar la reserva. Intente nuevamente.' },
          { status: 500 }
        );
      }
      
      appointmentData = data;
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { success: false, message: 'Error de base de datos. Intente nuevamente más tarde.' },
        { status: 500 }
      );
    }

    // Solo enviamos email si la reserva se guardó correctamente
    if (appointmentData) {
      // Enviar email de confirmación
      const emailSubject = 'Reserva Confirmada - Your Table Awaits!';
      const emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h1 style="color: #4a5568; text-align: center; padding-bottom: 10px; border-bottom: 1px solid #eee;">¡Su Reserva está Confirmada!</h1>
          
          <div style="padding: 20px 0;">
            <p style="font-size: 16px;">Estimado/a <strong>${customer_name}</strong>,</p>
            <p style="font-size: 16px;">Nos complace confirmar su reserva para el <strong>${date}</strong> a las <strong>${time}</strong>.</p>
            
            <div style="background-color: #f7fafc; border-left: 4px solid #4299e1; padding: 15px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #2c5282;">Detalles de la Reserva</h3>
              <p><strong>Servicio:</strong> ${service}</p>
              <p><strong>Cantidad de Personas:</strong> ${guests}</p>
              ${notes ? `<p><strong>Notas:</strong> ${notes}</p>` : ''}
            </div>
            
            <p>Si necesita modificar o cancelar su reserva, por favor contáctenos con al menos 24 horas de anticipación.</p>
          </div>
          
          <div style="background-color: #2c5282; color: white; padding: 15px; text-align: center; border-radius: 0 0 4px 4px;">
            <p style="margin: 0;">¡Gracias por elegirnos! Esperamos darle la bienvenida pronto.</p>
          </div>
        </div>
      `;
      
      let emailSuccess = false;
      try {
        console.log(`Sending confirmation email to ${customer_email}`);
        const emailResult = await sendEmail({
          to: customer_email,
          subject: emailSubject,
          text: emailBody.replace(/<[^>]*>/g, ''), // Versión sin HTML
          html: emailBody
        });
        
        emailSuccess = emailResult.success;
        if (emailResult.success) {
          console.log(`Email sent successfully to ${customer_email}`);
        } else {
          console.warn('Warning: Email confirmation not sent:', emailResult.error);
        }
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }

      // Devolver respuesta exitosa
      return NextResponse.json({ 
        success: true, 
        appointment: appointmentData,
        email_sent: emailSuccess
      });
    } else {
      // No deberíamos llegar aquí, pero por si acaso
      return NextResponse.json(
        { success: false, message: 'Error al procesar la reserva.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in POST appointment:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor. Intente nuevamente más tarde.' },
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