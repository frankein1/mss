ALTER TABLE "structure" RENAME COLUMN "lastActivity" TO "last_activity";

update structure s set "last_activity" = (
        select "date" from user_activity ua where ua.structure_id = s.id order by "date" desc limit 1
    ) where s."last_activity" is null;