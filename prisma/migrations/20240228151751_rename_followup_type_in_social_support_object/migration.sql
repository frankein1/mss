-- Prisma does not allow for now to specify column names in join tables.
-- It associates A or B based on model alphabetical order. See https://github.com/prisma/prisma/issues/10243
-- Model name change introduce a foreign key change.
BEGIN;

ALTER TABLE "_social_support_to_followup_type"
ADD COLUMN "tmp_social_support_id" UUID;

ALTER TABLE "_social_support_to_followup_type"
ADD CONSTRAINT "_social_support_to_followup_type_tmp_social_support_id_fkey" FOREIGN KEY ("tmp_social_support_id") REFERENCES "social_support"("id") ON DELETE CASCADE ON UPDATE CASCADE;

UPDATE "_social_support_to_followup_type"
SET "tmp_social_support_id" = "B";

-- DropForeignKey
ALTER TABLE "_social_support_to_followup_type" DROP CONSTRAINT "_social_support_to_followup_type_A_fkey";

-- DropForeignKey
ALTER TABLE "_social_support_to_followup_type" DROP CONSTRAINT "_social_support_to_followup_type_B_fkey";

DROP INDEX "_social_support_to_followup_type_AB_unique";

UPDATE "_social_support_to_followup_type"
SET "B" = "A";

UPDATE "_social_support_to_followup_type"
SET "A" = "tmp_social_support_id";

ALTER TABLE "_social_support_to_followup_type" DROP CONSTRAINT "_social_support_to_followup_type_tmp_social_support_id_fkey";

ALTER TABLE "_social_support_to_followup_type" DROP COLUMN "tmp_social_support_id";

CREATE UNIQUE INDEX "_social_support_to_followup_type_AB_unique" ON "_social_support_to_followup_type"("A", "B");

-- AddForeignKey
ALTER TABLE "_social_support_to_followup_type"
ADD CONSTRAINT "_social_support_to_followup_type_A_fkey" FOREIGN KEY ("A") REFERENCES "social_support"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_social_support_to_followup_type"
ADD CONSTRAINT "_social_support_to_followup_type_B_fkey" FOREIGN KEY ("B") REFERENCES "followup_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;
