/*
  Warnings:

  - Added the required column `title` to the `notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'NewSocialSupportSubject';

-- AlterTable
ALTER TABLE "notification" ADD COLUMN     "description" TEXT,
ADD COLUMN     "structure_id" UUID,
ADD COLUMN     "title" TEXT,
ALTER COLUMN "beneficiary_id" DROP NOT NULL;

UPDATE "notification" set title = 'Échéance' where "type" = 'DueDate';
UPDATE "notification" set title = 'Échéance' where "type" = 'DueDateOneMonth';
UPDATE "notification" set title = 'Échéance' where "type" = 'EndOfSupport';
UPDATE "notification" set title = 'Commentaire' where "type" = 'NewComment';
UPDATE "notification" set title = 'Document' where "type" = 'NewDocument';
UPDATE "notification" set title = 'Intruction' where "type" = 'NewHistoryElement' and social_support_id in (
  select id from social_support where "social_support_type" in ('HelpRequestHousing', 'HelpRequest')
);
UPDATE "notification" set title = 'Synthèse' where "type" = 'NewHistoryElement' and social_support_id in (
  select id from social_support where "social_support_type" = 'Followup'
);

UPDATE "notification" set "description" = 'Nouveau commentaire' where "type" = 'NewComment';
UPDATE "notification" set "description" = 'Nouveau document' where "type" = 'NewDocument';
UPDATE "notification" set "description" = 'Nouveau intruction' where "type" = 'NewHistoryElement' and social_support_id in (
  select id from social_support where "social_support_type" in ('HelpRequestHousing', 'HelpRequest')
);
UPDATE "notification" set "description" = 'Nouvelle synthèse' where "type" = 'NewHistoryElement' and social_support_id in (
  select id from social_support where "social_support_type" = 'Followup'
);  

ALTER TABLE "notification" ALTER COLUMN "title" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;
