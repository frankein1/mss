-- Some Proconnect FI have case sensitive emails, reformat emails for impacted users
update public.user set email = lower(trim(email)) where email != lower(trim(email));