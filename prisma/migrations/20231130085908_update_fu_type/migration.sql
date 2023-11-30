-- AlterTable
ALTER TABLE "followup_type" ADD COLUMN     "used" BOOLEAN NOT NULL DEFAULT false;

update followup_type set used = true where id in (
    select "B" FROM _followup_to_followup_type
);

update followup_type set used = true where id in (
    select "type_id" FROM help_request
);
