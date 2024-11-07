-- AlterTable
ALTER TABLE "account" ADD COLUMN     "created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "first_access" TIMESTAMP(3);


-- **Migration User first_access : set user first_access to first login date retrieved from user activity**

-- 1. join user and user activity and filter on LOGIN activity
-- 2. order (user_id,user_activity_date) by oldest
-- 3. only keep the first value of the couple with distinct on
-- 4. update user first access field with value of user activity found
-- Time: 333,788 ms
with user_first_access as(
  select distinct on (u.id) u.id user_id,ua.date first_login_date
  from public.user u
  join user_activity ua
  on ua.user_id = u.id 
  where ua.activity = 'LOGIN'
  order by u.id,ua.date asc nulls last
)
update public.user u 
set first_access = user_first_access.first_login_date
from user_first_access
where u.id = user_first_access.user_id;

-- **Migration Account created**

-- Proconnect - set account created to current timestamp
update account a
set created = CURRENT_TIMESTAMP
where a.provider = 'ProConnect';

-- InclusionConnect - set account created to first login date
-- Time: 471,045 ms
with account_first_access as(
  select distinct on (a.id) a.id account_id,ua.date first_login_date
  from public.user u
  join user_activity ua
  on ua.user_id = u.id 
  join account a 
  on a.user_id = u.id
  where ua.activity = 'LOGIN' and a.provider = 'InclusionConnect'
  order by a.id,ua.date asc nulls last
)
update account a
set created = account_first_access.first_login_date
from account_first_access
where a.id = account_first_access.account_id;

-- Set remaining account empty created field to current timestamp
update account a
set created = CURRENT_TIMESTAMP
where a.created is null;

-- **Migration Account updated**

-- Proconnect - set account updated to current timestamp
update account a
set updated = CURRENT_TIMESTAMP
where a.provider = 'ProConnect';

-- InclusionConnect - set account updated to last login
with account_last_access as(
  select distinct on (a.id) a.id account_id,ua.date last_login_date
  from public.user u
  join user_activity ua
  on ua.user_id = u.id 
  join account a 
  on a.user_id = u.id
  where ua.activity = 'LOGIN' and a.provider = 'InclusionConnect'
  order by a.id,ua.date desc nulls last
)
update account a
set updated = account_last_access.last_login_date
from account_last_access
where a.id = account_last_access.account_id;

-- Set remaining account empty updated field to current timestamp
update account a
set updated = CURRENT_TIMESTAMP
where a.updated is null;