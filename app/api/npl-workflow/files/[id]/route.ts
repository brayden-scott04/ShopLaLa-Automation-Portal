import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { workflowAccess } from "../_access";

// Downloads one New Product Launch Workflow attachment. Anyone who can open the page can download.

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/npl-workflow/files/[id]">) {
  const access = await workflowAccess();
  if (!access.ok) {
    return NextResponse.json({ error: access.status === 401 ? "Unauthorized" : "Forbidden" }, { status: access.status });
  }

  const { id } = await ctx.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: row, error } = await createServiceClient()
    .from("npl_workflow_files")
    .select("file_name, mime_type, data")
    .eq("id", id)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const bytes = Buffer.from(row.data, "base64");
  const ascii = row.file_name.replace(/[^\x20-\x7e]/g, "_").replace(/["\\]/g, "_");
  return new NextResponse(bytes, {
    headers: {
      "Content-Type": row.mime_type,
      "Content-Length": String(bytes.length),
      "Content-Disposition": `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(row.file_name)}`,
      "Cache-Control": "private, no-store",
    },
  });
}
