import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SITE_URL } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/unsubscribed?status=invalid", SITE_URL));
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.redirect(new URL("/unsubscribed?status=error", SITE_URL));
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const { error } = await supabase
    .from("subscribers")
    .update({
      is_active: false,
      unsubscribed_at: new Date().toISOString(),
    })
    .eq("unsubscribe_token", token);

  if (error) {
    return NextResponse.redirect(new URL("/unsubscribed?status=error", SITE_URL));
  }

  return NextResponse.redirect(new URL("/unsubscribed?status=success", SITE_URL));
}
