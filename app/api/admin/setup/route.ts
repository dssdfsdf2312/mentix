import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();

  try {
    // Check if admin_settings table exists and has a password
    const { data: existing } = await supabase
      .from("admin_settings")
      .select("value")
      .eq("key", "admin_password")
      .single();

    if (existing) {
      return NextResponse.json({ 
        message: "Admin password already set",
        password: existing.value 
      });
    }

    // Insert default password
    const { error } = await supabase
      .from("admin_settings")
      .insert({ 
        key: "admin_password", 
        value: "mentix2024" 
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      message: "Admin password initialized successfully",
      password: "mentix2024"
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || "Setup failed" 
    }, { status: 500 });
  }
}

export async function GET() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("admin_settings")
      .select("value")
      .eq("key", "admin_password")
      .single();

    if (error) {
      return NextResponse.json({ 
        error: "Password not set. Run POST /api/admin/setup to initialize" 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "Admin password exists",
      password: data.value
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
