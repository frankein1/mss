/*
  Warnings:

  - You are about to drop the column `partner_organisation_id` on the `support_program` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "support_program" DROP CONSTRAINT "support_program_partner_organisation_id_fkey";

-- AlterTable
ALTER TABLE "support_program" DROP COLUMN "partner_organisation_id";

-- CreateTable
CREATE TABLE "_partner_organization_to_support_program" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_partner_organization_to_support_program_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_partner_organization_to_support_program_B_index" ON "_partner_organization_to_support_program"("B");

-- AddForeignKey
ALTER TABLE "_partner_organization_to_support_program" ADD CONSTRAINT "_partner_organization_to_support_program_A_fkey" FOREIGN KEY ("A") REFERENCES "partner_organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_partner_organization_to_support_program" ADD CONSTRAINT "_partner_organization_to_support_program_B_fkey" FOREIGN KEY ("B") REFERENCES "support_program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
