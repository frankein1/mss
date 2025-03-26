-- This is an empty migration.

-- Migrate appointment times from UTC to central european time
-- - add 1 hour to appointments before 25-03-30 2am
-- - add 2 hours to appointments after 25-03-30 2am to account for summer time
-- - no appointment has been set in production after end of summer time (25-10-26) so this is not taken into account
with appointment_time_update as (
  select 
    a.id as appointment_id,
    a.external_rdvsp_id,
    ss.date,
    a.time,
    case
      when ss.date < '2025-03-30 02:00:00 Europe/Paris' then a.time + '1 hour'
      else a.time + '2 hour'
    end as updated_time
  from social_support ss
  join appointment a on a.social_support_id = ss.id
  where a.time is not null
)
update appointment a
set "time" = appointment_time_update.updated_time
from appointment_time_update
where a.id = appointment_time_update.appointment_id;
