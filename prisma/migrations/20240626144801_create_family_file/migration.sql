CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- AlterTable
ALTER TABLE "beneficiary" ADD COLUMN     "family_file_id" UUID;
ALTER TABLE "budget" ADD COLUMN     "family_file_id" UUID;
ALTER TABLE "document" ADD COLUMN     "family_file_id" UUID;
ALTER TABLE "social_support" ADD COLUMN     "family_file_id" UUID;

-- CreateTable
CREATE TABLE "family_file" (
    "id" UUID NOT NULL,
    "structure_id" UUID NOT NULL,
    CONSTRAINT "family_file_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "budget_family_file_id_key" ON "budget"("family_file_id");

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_family_file_id_fkey" FOREIGN KEY ("family_file_id") REFERENCES "family_file"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "social_support" ADD CONSTRAINT "social_support_family_file_id_fkey" FOREIGN KEY ("family_file_id") REFERENCES "family_file"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "budget" ADD CONSTRAINT "budget_family_file_id_fkey" FOREIGN KEY ("family_file_id") REFERENCES "family_file"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "beneficiary" ADD CONSTRAINT "beneficiary_family_file_id_fkey" FOREIGN KEY ("family_file_id") REFERENCES "family_file"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "family_file" ADD CONSTRAINT "family_file_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- migrate data
ALTER TABLE family_file ADD beneficiary_id UUID;
INSERT INTO family_file (id, beneficiary_id, structure_id) SELECT gen_random_uuid(), id, structure_id FROM beneficiary;

UPDATE document d SET family_file_id = (SELECT id FROM family_file ff where ff.beneficiary_id = d.beneficiary_id);
ALTER TABLE document ALTER family_file_id SET NOT NULL;
ALTER TABLE document DROP COLUMN beneficiary_id;

UPDATE budget d SET family_file_id = (SELECT id FROM family_file ff where ff.beneficiary_id = d.beneficiary_id);
ALTER TABLE budget ALTER family_file_id SET NOT NULL;
ALTER TABLE budget DROP COLUMN beneficiary_id;

UPDATE social_support d SET family_file_id = (SELECT id FROM family_file ff where ff.beneficiary_id = d.beneficiary_id);
ALTER TABLE social_support ALTER family_file_id SET NOT NULL;

UPDATE beneficiary d SET family_file_id = (SELECT id FROM family_file ff where ff.beneficiary_id = d.id);
ALTER TABLE beneficiary ALTER family_file_id SET NOT NULL;
