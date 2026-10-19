-- Rewrites staff.permissions from the pre-2026-10 section keys to the new
-- sidebar groups (lib/nav.ts). Item ids are unchanged; only their section moved:
--   sales                               -> dashboard
--   automations, tools, configuration   -> marketOps
--   communications                      -> others
--
-- OPTIONAL: toPermissionSet() in lib/roles.ts already folds the legacy keys on
-- every read, and saving a user's access in /admin/users writes the new shape.
-- This just normalises rows nobody has re-saved. Safe to run more than once.

update staff
set permissions = jsonb_build_object(
  'dashboard', coalesce((
    select jsonb_agg(distinct v) from jsonb_array_elements(
      coalesce(permissions->'dashboard', '[]') || coalesce(permissions->'sales', '[]')
    ) v), '[]'),
  'supplyChain', coalesce(permissions->'supplyChain', '[]'),
  'marketOps', coalesce((
    select jsonb_agg(distinct v) from jsonb_array_elements(
      coalesce(permissions->'marketOps', '[]')
      || coalesce(permissions->'automations', '[]')
      || coalesce(permissions->'tools', '[]')
      || coalesce(permissions->'configuration', '[]')
    ) v), '[]'),
  'visual', coalesce(permissions->'visual', '[]'),
  'others', coalesce((
    select jsonb_agg(distinct v) from jsonb_array_elements(
      coalesce(permissions->'others', '[]') || coalesce(permissions->'communications', '[]')
    ) v), '[]')
)
where permissions is not null
  and permissions ?| array['sales', 'automations', 'tools', 'configuration', 'communications'];
