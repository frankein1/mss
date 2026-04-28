-- DropIndex
DROP INDEX "public"."beneficiary_structure_id_birth_name_normalized_idx";

-- DropIndex
DROP INDEX "public"."beneficiary_structure_id_first_name_normalized_idx";

-- DropIndex
DROP INDEX "public"."beneficiary_structure_id_usual_name_normalized_idx";

-- DropIndex
DROP INDEX "public"."followup_type_id_include_name_idx";

-- CreateTable
CREATE TABLE "public"."beneficiary_device" (
    "id" UUID NOT NULL,
    "beneficiary_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "partner_organisation_name" VARCHAR(200),
    "precisions" VARCHAR(500),
    "start_date" DATE,
    "end_date" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "beneficiary_device_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "beneficiary_device_beneficiary_id_idx" ON "public"."beneficiary_device"("beneficiary_id");

-- AddForeignKey
ALTER TABLE "public"."beneficiary_device" ADD CONSTRAINT "beneficiary_device_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "public"."beneficiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
