-- Lets an admin rename a staff member (renameStaffMember in lib/actions/staff.ts).
--
-- The tasks tables already reference staff.username with ON UPDATE CASCADE.
-- The calendar tables were created with the default NO ACTION, which makes
-- Postgres reject a rename for anyone who owns/belongs to a calendar or created/
-- is assigned a calendar task. This recreates those four FKs with ON UPDATE
-- CASCADE, keeping each one's existing ON DELETE behaviour unchanged.

begin;

alter table calendars
  drop constraint calendars_owner_username_fkey,
  add constraint calendars_owner_username_fkey
    foreign key (owner_username) references staff(username)
    on update cascade on delete cascade;

alter table calendar_members
  drop constraint calendar_members_username_fkey,
  add constraint calendar_members_username_fkey
    foreign key (username) references staff(username)
    on update cascade on delete cascade;

alter table calendar_task_assignees
  drop constraint calendar_task_assignees_username_fkey,
  add constraint calendar_task_assignees_username_fkey
    foreign key (username) references staff(username)
    on update cascade on delete cascade;

alter table calendar_tasks
  drop constraint calendar_tasks_created_by_fkey,
  add constraint calendar_tasks_created_by_fkey
    foreign key (created_by) references staff(username)
    on update cascade on delete no action;

commit;
