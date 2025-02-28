
import { supabase } from '../../utils/supabaseClient';
import { NextResponse } from 'next/server';








// Handles GET request for fetching appointments
export async function GET() {
  try {
    const { data, error } = await supabase.from('appointments').select('*');

    if (error) {
      console.error('Error fetching appointments:', error.message);
      return NextResponse.json({ success: false, message: 'Error fetching appointments', error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, appointments: data }, { status: 200 });
  } catch (err) {
    console.error('Unexpected error fetching appointments:', err);
    return NextResponse.json({ success: false, message: 'Unexpected error occurred', error: err }, { status: 500 });
  }
}









/*

export async function PUT() {
  return NextResponse.json({ message: 'Hello - PUT' });
}

export async function DELETE() {
  return NextResponse.json({ message: 'Hello - DELETE' });
}*/