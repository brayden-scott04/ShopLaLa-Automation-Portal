import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createClient } from "@/lib/supabase/server";
import { signSession, setSessionCookie } from "@/lib/session";
import { toRole } from "@/lib/roles";
import { toLocale } from "@/lib/i18n/config";
import { getT, setLocaleCookie } from "@/lib/i18n/server";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();
  const t = await getT();

  if (typeof username !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: t("login.failed") }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: staff } = await supabase
    .from("staff")
    .select("username, password_hash, role")
    .eq("username", username.toLowerCase())
    .single();

  const passwordValid = staff
    ? await bcrypt.compare(password, staff.password_hash)
    : false;

  if (!staff || !passwordValid) {
    return NextResponse.json(
      { error: t("login.invalid") },
      { status: 401 }
    );
  }

  const token = await signSession({
    username: staff.username,
    role: toRole(staff.role),
  });
  await setSessionCookie(token);

  // Their saved language follows them to this browser. Fetched separately so a database
  // without the column (before sql/staff_language_migration.sql) can never block a login.
  const { data: pref } = await supabase
    .from("staff")
    .select("language")
    .eq("username", staff.username)
    .maybeSingle();
  if (pref?.language) await setLocaleCookie(toLocale(pref.language));

  return NextResponse.json({ ok: true });
}
