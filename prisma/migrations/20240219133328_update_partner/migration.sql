-- CreateIndex
CREATE UNIQUE INDEX "partner_organization_structure_id_siret_key" ON "partner_organization"("structure_id", "siret");
