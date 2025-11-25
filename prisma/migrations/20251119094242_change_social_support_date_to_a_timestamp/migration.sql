-- AlterTable
ALTER TABLE "public"."social_support" ALTER COLUMN "date" SET DATA TYPE TIMESTAMP(3);
UPDATE "public"."social_support"
SET date = date_trunc('day', social_support.date) + appointment.time
FROM appointment
WHERE social_support.id = appointment.social_support_id
AND appointment.time IS NOT NULL;
