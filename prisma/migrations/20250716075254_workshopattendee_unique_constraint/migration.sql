/*
  Warnings:

  - A unique constraint covering the columns `[workshop_id,beneficiary_id]` on the table `workshop_attendee` will be added. If there are existing duplicate values, this will fail.

*/

-- CreateIndex
CREATE UNIQUE INDEX "workshop_attendee_workshop_id_beneficiary_id_key" ON "workshop_attendee"("workshop_id", "beneficiary_id") WHERE "beneficiary_id" IS NOT NULL;