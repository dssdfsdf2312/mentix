import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  
  const { data: slots, error } = await supabase
    .from("availability_slots")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const now = new Date();
  const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const utcDate = now.toISOString().split("T")[0];

  return NextResponse.json({
    serverInfo: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      localDate,
      utcDate,
      serverTime: now.toISOString(),
    },
    recentSlots: slots?.map(slot => ({
      id: slot.id,
      date: slot.date,
      start_time: slot.start_time,
      is_booked: slot.is_booked,
    })) || []
  });
}
