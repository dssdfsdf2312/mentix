import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();
  const { slot_id, client_name, client_email, client_phone, client_message, duration } = body;

  if (!slot_id || !client_name || !client_email || !duration) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Check slot availability
  const { data: slot, error: slotError } = await supabase
    .from("availability_slots")
    .select("*")
    .eq("id", slot_id)
    .eq("is_booked", false)
    .single();

  if (slotError || !slot) {
    return NextResponse.json(
      { error: "Slot is no longer available" },
      { status: 409 }
    );
  }

  // Create Zoom meeting
  let zoomData = null;
  try {
    const zoomRes = await fetch(
      `${request.nextUrl.origin}/api/zoom/create-meeting`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: `1-on-1 Coaching: ${client_name}`,
          start_time: `${slot.date}T${slot.start_time}`,
          duration,
        }),
      }
    );
    if (zoomRes.ok) {
      zoomData = await zoomRes.json();
    }
  } catch (e) {
    console.error("Zoom meeting creation failed:", e);
  }

  // Mark slot as booked
  await supabase
    .from("availability_slots")
    .update({ is_booked: true, updated_at: new Date().toISOString() })
    .eq("id", slot_id);

  // Create booking
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      slot_id,
      client_name,
      client_email,
      client_phone: client_phone || null,
      client_message: client_message || null,
      duration,
      status: "confirmed",
      zoom_meeting_id: zoomData?.id?.toString() || null,
      zoom_join_url: zoomData?.join_url || null,
      zoom_start_url: zoomData?.start_url || null,
    })
    .select()
    .single();

  if (bookingError) {
    // Revert slot booking
    await supabase
      .from("availability_slots")
      .update({ is_booked: false, updated_at: new Date().toISOString() })
      .eq("id", slot_id);
    return NextResponse.json(
      { error: bookingError.message },
      { status: 500 }
    );
  }

  // Send confirmation email
  try {
    await fetch(`${request.nextUrl.origin}/api/email/send-confirmation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        booking_id: booking.id,
        client_name,
        client_email,
        date: slot.date,
        start_time: slot.start_time,
        duration,
        zoom_join_url: zoomData?.join_url || null,
      }),
    });
  } catch (e) {
    console.error("Email sending failed:", e);
  }

  // Notion calendar automation
  try {
    await fetch(`${request.nextUrl.origin}/api/notion/create-event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_name,
        client_email,
        date: slot.date,
        start_time: slot.start_time,
        duration,
        zoom_join_url: zoomData?.join_url || null,
      }),
    });
  } catch (e) {
    console.error("Notion event creation failed:", e);
  }

  return NextResponse.json({ booking, zoom: zoomData });
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let query = supabase
    .from("bookings")
    .select("*, availability_slots(*)")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bookings: data });
}
