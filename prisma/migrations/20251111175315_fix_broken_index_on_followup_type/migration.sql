-- DropIndex
DROP INDEX "public"."followup_type_name_owned_by_structured_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "followup_type_owned_by_structured_id_name_key" ON "public"."followup_type"("owned_by_structured_id", "name");

-- include name in the index on id, for faster lookup in lateral joins
CREATE INDEX "followup_type_id_include_name_idx" ON "public"."followup_type" ("id") INCLUDE ("name");
