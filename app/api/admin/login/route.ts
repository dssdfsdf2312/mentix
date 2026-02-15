import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { password } = await request.json();

  if (!password) {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("admin_settings")
    .select("value")
    .eq("key", "admin_password")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  if (password !== data.value) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  // Set a session cookie
  const cookieStore = await cookies();
  const token = Buffer.from(`admin:${Date.now()}`).toString("base64");
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });

  return NextResponse.json({ success: true });
}
