/*
  Warnings:

  - You are about to drop the column `name` on the `beneficiary_device` table. All the data in the column will be lost.
  - Added the required column `device_name_id` to the `beneficiary_device` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."beneficiary_device" DROP COLUMN "name",
ADD COLUMN     "device_name_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "public"."beneficiary_device_name" (
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "structure_id" UUID NOT NULL,
    "created_by_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "beneficiary_device_name_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "beneficiary_device_name_structure_id_name_key" ON "public"."beneficiary_device_name"("structure_id", "name");

-- AddForeignKey
ALTER TABLE "public"."beneficiary_device_name" ADD CONSTRAINT "beneficiary_device_name_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "public"."structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."beneficiary_device_name" ADD CONSTRAINT "beneficiary_device_name_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."beneficiary_device" ADD CONSTRAINT "beneficiary_device_device_name_id_fkey" FOREIGN KEY ("device_name_id") REFERENCES "public"."beneficiary_device_name"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
