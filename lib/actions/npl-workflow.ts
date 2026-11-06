"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { getSession } from "@/lib/session";
import { getMyPermissions } from "@/lib/permissions";
import { canManageProfiles, isAllowed } from "@/lib/roles";
import {
  workflowContentSchema,
  type WorkflowContent,
  type WorkflowData,
  type WorkflowFile,
} from "@/lib/npl-workflow/constants";
import defaultContent from "@/lib/npl-workflow/default-content.json";
import { getT } from "@/lib/i18n/server";

// New Product Launch Workflow. Anyone with access to the page can read it; only admins and
// leaders can change it. Both tables have RLS on with no policies, so every read and write goes
// through the service client after the checks below.

type Result<T> = { data: T | null; error: string | null };

const SECTION = "marketOps" as const;
const ITEM = "new-product-launch-workflow";

async function requireViewer() {
  const session = await getSession();
  if (!session) return { session: null, canEdit: false, error: "Unauthorized" as const };
  const { role, permissions } = await getMyPermissions();
  if (!isAllowed(role, permissions, SECTION, ITEM)) {
    return { session: null, canEdit: false, error: "Forbidden" as const };
  }
  return { session, canEdit: canManageProfiles(role), error: null };
}

async function requireEditor() {
  const res = await requireViewer();
  if (!res.session) return res;
  if (!res.canEdit) return { session: null, canEdit: false, error: "Forbidden" as const };
  return res;
}

export async function getWorkflow(): Promise<Result<WorkflowData>> {
  const { session, canEdit, error } = await requireViewer();
  if (!session) return { data: null, error };

  const db = createServiceClient();
  const [docRes, filesRes] = await Promise.all([
    db.from("npl_workflow").select("content, revision, updated_at, updated_by").eq("id", 1).maybeSingle(),
    db
      .from("npl_workflow_files")
      .select("id, scope_type, scope_id, title, file_name, size")
      .order("created_at"),
  ]);
  if (docRes.error) return { data: null, error: docRes.error.message };
  if (filesRes.error) return { data: null, error: filesRes.error.message };

  const files: WorkflowFile[] = (filesRes.data ?? []).map((f) => ({
    id: f.id,
    scopeType: f.scope_type,
    scopeId: f.scope_id,
    title: f.title,
    fileName: f.file_name,
    size: f.size,
  }));

  return {
    data: {
      content: (docRes.data?.content ?? defaultContent) as WorkflowContent,
      revision: docRes.data?.revision ?? 0,
      updatedAt: docRes.data?.updated_at ?? null,
      updatedBy: docRes.data?.updated_by ?? null,
      files,
      canEdit,
    },
    error: null,
  };
}

/**
 * Saves the whole document. `expectedRevision` is the revision the editor started from; if
 * someone else saved in the meantime the save is refused instead of overwriting their changes.
 */
export async function saveWorkflowContent(
  content: WorkflowContent,
  expectedRevision: number,
): Promise<Result<{ revision: number; updatedAt: string; updatedBy: string }>> {
  const { session, error } = await requireEditor();
  if (!session) return { data: null, error };
  const t = await getT();

  const parsed = workflowContentSchema.safeParse(content);
  if (!parsed.success) return { data: null, error: t("errors.nplInvalidContent") };

  const db = createServiceClient();
  const now = new Date().toISOString();
  const row = { content: parsed.data, updated_at: now, updated_by: session.username };

  if (expectedRevision === 0) {
    const { error: insertError } = await db.from("npl_workflow").insert({ id: 1, revision: 1, ...row });
    if (insertError) {
      return { data: null, error: insertError.code === "23505" ? t("errors.nplConflict") : insertError.message };
    }
    return { data: { revision: 1, updatedAt: now, updatedBy: session.username }, error: null };
  }

  const { data, error: updateError } = await db
    .from("npl_workflow")
    .update({ revision: expectedRevision + 1, ...row })
    .eq("id", 1)
    .eq("revision", expectedRevision)
    .select("revision");
  if (updateError) return { data: null, error: updateError.message };
  if (!data?.length) return { data: null, error: t("errors.nplConflict") };
  return { data: { revision: expectedRevision + 1, updatedAt: now, updatedBy: session.username }, error: null };
}

export async function deleteWorkflowFile(id: string): Promise<Result<true>> {
  const { session, error } = await requireEditor();
  if (!session) return { data: null, error };

  const { error: deleteError } = await createServiceClient().from("npl_workflow_files").delete().eq("id", id);
  if (deleteError) return { data: null, error: deleteError.message };
  return { data: true, error: null };
}
