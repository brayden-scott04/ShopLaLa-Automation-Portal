-- Calendar: widen the allowed task colours (adds pink, teal, cyan, indigo, brown, gray).
alter table calendar_tasks drop constraint calendar_tasks_color_check;
alter table calendar_tasks add constraint calendar_tasks_color_check
  check (color in ('red','orange','yellow','green','blue','purple','pink','teal','cyan','indigo','brown','gray'));
