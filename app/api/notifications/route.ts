import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/session";
import { getUnreadNotificationCount, listNotifications } from "@/lib/actions/notifications";

// Polled every NOTIFICATIONS_POLL_MS by the Dashboard panel and the sidebar badge. A plain GET
// rather than a server action so a background poll never queues behind the page's own actions.
// `?count=1` returns only the unread count (the sidebar badge).
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (req.nextUrl.searchParams.get("count") === "1") {
    const { data, error } = await getUnreadNotificationCount();
    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json({ unread: data }, { headers: { "Cache-Control": "no-store" } });
  }

  const { data, error } = await listNotifications();
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
}
