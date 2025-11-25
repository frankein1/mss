-- AlterTable
ALTER TABLE "public"."social_support" ADD COLUMN     "subtype" TEXT;
UPDATE social_support
SET subtype = file_instruction.type
FROM file_instruction
WHERE file_instruction.social_support_id = social_support.id;
UPDATE social_support
SET subtype = followup.medium
FROM followup
WHERE followup.social_support_id = social_support.id;
UPDATE social_support
SET subtype = followup.medium
FROM followup
WHERE followup.social_support_id = social_support.id;
UPDATE social_support
SET subtype = appointment.subject
FROM appointment
WHERE appointment.social_support_id = social_support.id;
