/*
  Warnings:

  - You are about to drop the `appointment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."appointment" DROP CONSTRAINT "appointment_agent_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."appointment" DROP CONSTRAINT "appointment_social_support_id_fkey";

-- DropTable
DROP TABLE "public"."appointment";

DELETE FROM "public"."social_support" WHERE "social_support_type"='Appointment';
