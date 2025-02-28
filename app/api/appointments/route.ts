import { supabase } from '@/app/utils/supabaseClient';
import { NextResponse } from 'next/server';
import { sendEmail } from '@/app/utils/sendEmail';

//get all the slots





export async function GET(req: Request) {
  try {
    const url = new URL(req.url); // Parse the request URL
    const selectedDate = url.searchParams.get('date'); // Extract the 'date' query parameter

    if (!selectedDate) {
      return NextResponse.json(
        { success: false, message: 'Date query parameter is required.' },
        { status: 400 }
      );
    }

    // Fetch available appointment slots for the specific date
    const { data, error } = await supabase
      .from('appointments_schedule') // Assuming the table is 'appointments_schedule'
      .select('*') // Replace '*' with only the necessary fields if needed
      .eq('date', selectedDate) // Filter by the selected date
      .or('is_booked.eq.false,is_booked.is.null'); // Include slots where booked is false or null

    if (error) {
      console.error('Error fetching appointment schedules:', error.message);
      return NextResponse.json(
        { success: false, message: 'Error fetching schedules', error: error.message },
        { status: 400 }
      );
    }

    // Log the available slots data to the server console
    console.log('Available Slots:', data);

    // Return the fetched data in the response
    return NextResponse.json({ success: true, schedules: data }, { status: 200 });
  } catch (err) {
    console.error('Unexpected error fetching schedules:', err);
    return NextResponse.json(
      { success: false, message: 'Unexpected error occurred', error: err },
      { status: 500 }
    );
  }
}



//post-book an appointment



export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse the incoming JSON body
    const { schedule_id, customer_email, customer_name, notes, service } = body;

    // Validate the incoming data
    if (!schedule_id || !customer_email || !customer_name || !service) {
      return NextResponse.json(
        { success: false, message: 'Schedule ID, customer email, name, and service are required fields.' },
        { status: 400 }
      );
    }

    // Insert the appointment into the database
    const { data: insertedAppointment, error: insertError } = await supabase
      .from('appointments')
      .insert([{ 
        schedule_id, 
        customer_email, 
        customer_name, 
        notes, 
        service, 
        booked: true // Set booked to true
      }])
      .select(); // Use `.select()` to retrieve the inserted row

    if (insertError) {
      console.error('Error inserting appointment:', insertError.message);
      return NextResponse.json(
        { success: false, message: 'Failed to add appointment.', error: insertError.message },
        { status: 500 }
      );
    }

    const appointment = insertedAppointment[0]; // Get the first (and only) inserted appointment

    // Fetch the corresponding schedule details from the `appointments_schedule` table using `schedule_id`
    const { data: scheduleDetails, error: scheduleError } = await supabase
      .from('appointments_schedule') // Adjusted to the correct table name
      .select('*') // Select the columns you need (date, time, time_slot)
      .eq('id', schedule_id); // Match the schedule ID

    if (scheduleError) {
      console.error('Error fetching schedule details:', scheduleError.message);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch schedule details.', error: scheduleError.message },
        { status: 500 }
      );
    }

    const schedule = scheduleDetails[0]; // Assume there's one schedule row with the given ID

    // Construct the email content
    const emailSubject = 'Appointment Confirmation';
    const emailBody = `
      <h1>Appointment Confirmation</h1>
      <p>Dear ${customer_name},</p>
      <p>Thank you for booking an appointment. Here are your appointment details:</p>
      <ul>
        <li><strong>Appointment ID:</strong> ${appointment.id}</li>
        <li><strong>Service:</strong> ${service}</li>
        <li><strong>Notes:</strong> ${notes || 'N/A'}</li>
        <li><strong>Schedule Date:</strong> ${schedule ? schedule.date : 'N/A'}</li>
        <li><strong>Schedule Time:</strong> ${schedule ? schedule.time : 'N/A'}</li>
        <li><strong>Time Slot:</strong> ${schedule ? schedule.time_slot : 'N/A'}</li>
      </ul>
      <p>We look forward to serving you!</p>
      <p>Best regards,</p>
      <p>Your Company Name</p>
    `;

    // Send the email
    const emailResult = await sendEmail({
      to: customer_email,
      subject: emailSubject,
      text: emailBody.replace(/<[^>]+>/g, ''), // Plain text version (strip HTML tags)
      html: emailBody,
    });

    if (!emailResult.success) {
      console.error('Error sending email:', emailResult.error);
      return NextResponse.json(
        { success: false, message: 'Appointment added, but email failed.', error: emailResult.error },
        { status: 500 }
      );
    }

    // Respond with success
    return NextResponse.json(
      { 
        success: true, 
        message: 'Appointment added and confirmation email sent.', 
        appointment: insertedAppointment[0] 
      }, 
      { status: 201 }
    );
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      { success: false, message: 'Unexpected error occurred.', error: err },
      { status: 500 }
    );
  }
}







//Delete appointment request



// Define types for the data you're dealing with (adjust the fields if necessary)


export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get("id");
    const customerEmail = searchParams.get("customer_email");

    if (!appointmentId || !customerEmail) {
      return NextResponse.json(
        { success: false, message: "Appointment ID and Customer Email are required." },
        { status: 400 }
      );
    }

    // Delete appointment
    const { data, error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", appointmentId)
      .eq("customer_email", customerEmail)
      .select("*"); // Retrieve deleted rows

    const count = data ? data.length : 0; // Count deleted rows

    if (error) {
      console.error("Error deleting appointment:", error.message);
      return NextResponse.json(
        { success: false, message: "Error deleting appointment.", error: error.message },
        { status: 400 }
      );
    }

    if (count === 0) {
      return NextResponse.json(
        { success: false, message: "No appointment found with the provided ID and email." },
        { status: 404 }
      );
    }

    // Send email notification
    const emailResponse = await sendEmail({
      to: customerEmail,
      subject: "Your Appointment Has Been Cancelled",
      text: `Hello,\n\nYour appointment (ID: ${appointmentId}) has been successfully cancelled. If this was a mistake, please contact us to reschedule.\n\nBest regards,\nYour Company Name`,
      html: `
        <h2>Appointment Cancelled</h2>
        <p>Dear Customer,</p>
        <p>Your appointment (ID: <b>${appointmentId}</b>) has been successfully cancelled.</p>
        <p>If this was a mistake, please contact us to reschedule.</p>
        <br/>
        <p>Best regards,</p>
        <p>Your Company Name</p>
      `,
    });

    if (!emailResponse.success) {
      console.error("Error sending cancellation email:", emailResponse.error);
    }

    return NextResponse.json(
      { success: true, message: "Appointment deleted successfully. Email sent.", deletedAppointment: data },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error deleting appointment:", err);
    return NextResponse.json(
      { success: false, message: "Unexpected error occurred.", error: err },
      { status: 500 }
    );
  }
}






//updating appointment 




export async function PATCH(request: Request) {
  try {
    // Extract ID and customer email from query string
    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get("id");
    const customerEmail = searchParams.get("customer_email");

    if (!appointmentId || !customerEmail) {
      return NextResponse.json(
        { success: false, message: "Appointment ID and Customer Email are required." },
        { status: 400 }
      );
    }

    // Get the update fields from the request body
    const body = await request.json();
    const updateFields: Partial<Record<"service" | "notes", string>> = {};
    if (body.service) updateFields.service = body.service;
    if (body.notes) updateFields.notes = body.notes;

    const isUpdatingDateOrTime = body.date || body.time_slot;

    if (Object.keys(updateFields).length === 0 && !isUpdatingDateOrTime) {
      return NextResponse.json(
        { success: false, message: "Only 'service', 'notes', 'date', or 'time_slot' can be updated." },
        { status: 400 }
      );
    }

    // Fetch the existing appointment details
    const { data: appointmentData, error: appointmentError } = await supabase
      .from("appointments")
      .select("schedule_id")
      .eq("id", appointmentId)
      .eq("customer_email", customerEmail)
      .single();

    if (appointmentError || !appointmentData) {
      return NextResponse.json(
        { success: false, message: "No appointment found with the provided ID and email." },
        { status: 404 }
      );
    }

    const scheduleId: string = appointmentData.schedule_id;

    // If updating date/time, fetch and update schedule
    if (isUpdatingDateOrTime) {
      

      await supabase
        .from("appointments_schedule")
        .update({ is_booked: false })
        .eq("id", scheduleId);

      const { data: newSchedule } = await supabase
        .from("appointments_schedule")
        .select("id, is_booked")
        .eq("date", body.date)
        .eq("time_slot", body.time_slot)
        .single();

      if (!newSchedule || newSchedule.is_booked) {
        return NextResponse.json(
          { success: false, message: "The selected time slot is unavailable." },
          { status: 400 }
        );
      }

      await supabase
        .from("appointments_schedule")
        .update({ is_booked: true })
        .eq("id", newSchedule.id);

      await supabase
        .from("appointments")
        .update({ schedule_id: newSchedule.id })
        .eq("id", appointmentId);
    }

    // If updating service or notes, apply the update
    if (Object.keys(updateFields).length > 0) {
      const { error: updateError } = await supabase
        .from("appointments")
        .update(updateFields)
        .eq("id", appointmentId)
        .eq("customer_email", customerEmail);

      if (updateError) {
        return NextResponse.json(
          { success: false, message: "Error updating appointment.", error: updateError.message },
          { status: 400 }
        );
      }
    }

    // ✅ SEND EMAIL NOTIFICATION
    const emailSubject = "Your Appointment Has Been Updated";
    const emailText = `
      Hello, your appointment has been successfully updated.\n
      ${body.date ? `New Date: ${body.date}` : ""}
      ${body.time_slot ? `New Time: ${body.time_slot}` : ""}
      ${body.service ? `Service: ${body.service}` : ""}
      ${body.notes ? `Notes: ${body.notes}` : ""}
      \nThank you!
    `;
    const emailHtml = `
      <h2>Appointment Updated Successfully</h2>
      <p>Hello,</p>
      <p>Your appointment has been successfully updated.</p>
      <ul>
        ${body.date ? `<li><strong>New Date:</strong> ${body.date}</li>` : ""}
        ${body.time_slot ? `<li><strong>New Time:</strong> ${body.time_slot}</li>` : ""}
        ${body.service ? `<li><strong>Service:</strong> ${body.service}</li>` : ""}
        ${body.notes ? `<li><strong>Notes:</strong> ${body.notes}</li>` : ""}
      </ul>
      <p>Thank you!</p>
    `;

    const emailResponse = await sendEmail({
      to: customerEmail,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    });

    if (!emailResponse.success) {
      console.error("Email sending failed:", emailResponse.error);
    }

    return NextResponse.json(
      { success: true, message: "Appointment updated successfully. Notification sent!" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Unexpected error occurred.", error: String(err) },
      { status: 500 }
    );
  }
}