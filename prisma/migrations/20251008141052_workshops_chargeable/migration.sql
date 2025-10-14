-- AlterTable
ALTER TABLE "public"."workshop" 
  ADD COLUMN "chargeable" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "public"."workshop_attendee" 
  ADD COLUMN "payment_amount" DECIMAL(65,30),
  ADD COLUMN "payment_received" BOOLEAN;