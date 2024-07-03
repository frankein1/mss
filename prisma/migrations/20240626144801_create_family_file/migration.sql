CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- AlterTable
ALTER TABLE "beneficiary" ADD COLUMN     "family_file_id" UUID;
ALTER TABLE "budget" ADD COLUMN     "family_file_id" UUID;
ALTER TABLE "document" ADD COLUMN     "family_file_id" UUID;
ALTER TABLE "social_support" ADD COLUMN     "family_file_id" UUID;
ALTER TABLE "notification" ADD COLUMN     "family_file_id" UUID;

-- CreateTable
CREATE TABLE "family_file" (
    "id" UUID NOT NULL,
    "structure_id" UUID NOT NULL,
    CONSTRAINT "family_file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_family_file_referents" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "budget_family_file_id_key" ON "budget"("family_file_id");
CREATE UNIQUE INDEX "_family_file_referents_AB_unique" ON "_family_file_referents"("A", "B");
CREATE INDEX "_family_file_referents_B_index" ON "_family_file_referents"("B");

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_family_file_id_fkey" FOREIGN KEY ("family_file_id") REFERENCES "family_file"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "social_support" ADD CONSTRAINT "social_support_family_file_id_fkey" FOREIGN KEY ("family_file_id") REFERENCES "family_file"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "budget" ADD CONSTRAINT "budget_family_file_id_fkey" FOREIGN KEY ("family_file_id") REFERENCES "family_file"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "beneficiary" ADD CONSTRAINT "beneficiary_family_file_id_fkey" FOREIGN KEY ("family_file_id") REFERENCES "family_file"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "family_file" ADD CONSTRAINT "family_file_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_family_file_referents" ADD CONSTRAINT "_family_file_referents_A_fkey" FOREIGN KEY ("A") REFERENCES "family_file"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_family_file_referents" ADD CONSTRAINT "_family_file_referents_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "notification" ADD CONSTRAINT "notification_family_file_id_fkey" FOREIGN KEY ("family_file_id") REFERENCES "family_file"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- migrate data
ALTER TABLE family_file ADD beneficiary_id UUID;
INSERT INTO family_file (id, beneficiary_id, structure_id) SELECT gen_random_uuid(), id, structure_id FROM beneficiary;

UPDATE document d SET family_file_id = (SELECT id FROM family_file ff where ff.beneficiary_id = d.beneficiary_id);
ALTER TABLE document ALTER family_file_id SET NOT NULL;

UPDATE budget d SET family_file_id = (SELECT id FROM family_file ff where ff.beneficiary_id = d.beneficiary_id);
ALTER TABLE budget ALTER family_file_id SET NOT NULL;
ALTER TABLE budget DROP COLUMN beneficiary_id;

UPDATE social_support d SET family_file_id = (SELECT id FROM family_file ff where ff.beneficiary_id = d.beneficiary_id);
ALTER TABLE social_support ALTER family_file_id SET NOT NULL;

UPDATE beneficiary d SET family_file_id = (SELECT id FROM family_file ff where ff.beneficiary_id = d.id);
ALTER TABLE beneficiary ALTER family_file_id SET NOT NULL;

INSERT INTO  _family_file_referents ("A", "B")
  SELECT ff.id, br."B"
    FROM family_file ff, beneficiary b, _beneficiary_referents br
    WHERE br."A" = b.id AND b.id = ff.beneficiary_id;

ALTER TABLE family_file DROP beneficiary_id;

DROP TABLE _beneficiary_referents;


