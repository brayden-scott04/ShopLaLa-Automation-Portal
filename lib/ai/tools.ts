import type Anthropic from "@anthropic-ai/sdk";
import { getStaffDirectory } from "@/lib/actions/staff";
import { NAV_GROUPS, SUBGROUP_LABELS } from "@/lib/nav";

/**
 * Read-only tools exposed to the AI assistant. No mutating actions
 * (create/delete/reset password, etc.) are exposed here on purpose —
 * the assistant can inform staff, not act on their behalf.
 */
export const chatToolDefinitions: Anthropic.Tool[] = [
  {
    name: "get_staff_directory",
    description:
      "Get the list of LaLaGreen staff accounts (username and role: admin or user). Use this to answer questions like who works here or who the admins are.",
    input_schema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "list_portal_pages",
    description:
      "List the pages available in the portal, grouped by sidebar section (Dashboard, Supply Chain, Market Ops, Visual, Others), with their names, descriptions and URLs. Market Ops pages under the Automations sub-group are the portal's automations and generators.",
    input_schema: { type: "object", properties: {}, additionalProperties: false },
  },
];

export async function runChatTool(name: string): Promise<unknown> {
  switch (name) {
    case "get_staff_directory": {
      const { data, error } = await getStaffDirectory();
      if (error) return { error };
      return data;
    }
    case "list_portal_pages":
      return NAV_GROUPS.map((group) => ({
        section: group.label,
        pages: group.items.map(({ name, description, href, subgroup }) => ({
          name,
          description,
          url: href,
          ...(subgroup ? { subgroup: SUBGROUP_LABELS[subgroup] } : {}),
        })),
      }));
    default:
      return { error: `Unknown tool: ${name}` };
  }
}
