-- AlterTable
ALTER TABLE "notification" ADD COLUMN  "beneficiary_id" UUID NULL;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

UPDATE "notification" n set "beneficiary_id" = (select "beneficiary_id" from help_request i where i.id = n.help_request_id) where help_request_id is not null;
UPDATE "notification" n set "beneficiary_id" = (select "beneficiary_id" from followup i where i.id = n.followup_id) where followup_id is not null;
UPDATE "notification" n set "beneficiary_id" = (select "beneficiary_id" from document i where i.key = n.document_id) where document_id is not null;

DELETE FROM "notification" WHERE "beneficiary_id" IS NULL;

ALTER TABLE "notification" ALTER COLUMN  "beneficiary_id" SET NOT NULL;