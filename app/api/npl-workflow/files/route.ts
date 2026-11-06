import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getT } from "@/lib/i18n/server";
import { FILE_TITLE_MAX, MAX_FILE_BYTES, isValidScope, type WorkflowFile } from "@/lib/npl-workflow/constants";
import { workflowAccess } from "./_access";

// Attachment upload for the New Product Launch Workflow. A route handler rather than a server
// action because server action bodies are capped at 1 MB and the packing list alone is larger.

export async function POST(req: NextRequest) {
  const access = await workflowAccess();
  if (!access.ok) {
    return NextResponse.json({ error: access.status === 401 ? "Unauthorized" : "Forbidden" }, { status: access.status });
  }
  if (!access.canEdit) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const t = await getT();

  const form = await req.formData();
  const file = form.get("file");
  const scopeType = String(form.get("scopeType") ?? "");
  const scopeId = String(form.get("scopeId") ?? "");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: t("errors.nplFileRequired") }, { status: 400 });
  }
  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: t("errors.nplFileTooLarge", { max: MAX_FILE_BYTES / 1024 / 1024 }) }, { status: 400 });
  }
  if (!isValidScope(scopeType, scopeId)) return NextResponse.json({ error: "Invalid scope" }, { status: 400 });

  const fileName = file.name.slice(0, 200) || "file";
  const title = (String(form.get("title") ?? "").trim() || fileName).slice(0, FILE_TITLE_MAX);
  const data = Buffer.from(await file.arrayBuffer()).toString("base64");

  const { data: row, error } = await createServiceClient()
    .from("npl_workflow_files")
    .insert({
      scope_type: scopeType,
      scope_id: scopeId,
      title,
      file_name: fileName,
      mime_type: file.type || "application/octet-stream",
      size: file.size,
      data,
      created_by: access.username,
    })
    .select("id")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const saved: WorkflowFile = { id: row.id, scopeType, scopeId, title, fileName, size: file.size };
  return NextResponse.json({ data: saved });
}
