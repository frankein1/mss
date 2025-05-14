CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS btree_gin;
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE OR REPLACE FUNCTION immutable_unaccent(text) RETURNS text
AS $$
  SELECT public.unaccent('public.unaccent', $1);
$$ LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT;
-- AlterTable
ALTER TABLE "beneficiary" ADD COLUMN     "birth_name_normalized" TEXT GENERATED ALWAYS AS(lower(immutable_unaccent(birth_name))) STORED,
ADD COLUMN     "first_name_normalized" TEXT GENERATED ALWAYS AS(lower(immutable_unaccent(first_name))) STORED,
ADD COLUMN     "usual_name_normalized" TEXT GENERATED ALWAYS AS(lower(immutable_unaccent(usual_name))) STORED;

-- CreateIndex
CREATE INDEX "beneficiary_structure_id_usual_name_normalized_idx" ON "beneficiary" USING GIN ("structure_id" , "usual_name_normalized" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "beneficiary_structure_id_birth_name_normalized_idx" ON "beneficiary" USING GIN ("structure_id" , "birth_name_normalized" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "beneficiary_structure_id_first_name_normalized_idx" ON "beneficiary" USING GIN ("structure_id" , "first_name_normalized" gin_trgm_ops);
