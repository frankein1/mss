// Copy this file to migrate-data-inclusion-v1-unmatched.overrides.<env>.ignore.ts and fill in your overrides.
// e.g. migrate-data-inclusion-v1-unmatched.overrides.prod.ignore.ts
//
// Used for two cases:
//   1. Ambiguous matches — multiple v1 structures share the same name+zipcode or SIRET.
//      Find candidates in `ambiguousByNameDetails` / `ambiguousBySiretDetails` in the dry-run report.
//   2. SIRET fallback confirmation — entries in `matchedBySiretFallbackDetails` are NOT applied
//      automatically. Review name and zipcode, then add confirmed matches here.
//   3. customPartnerOverrideIds — partner orgs to skip entirely (migrated as DI Legacy partenaire).
//
// Key:   partnerOrganization.id (UUID)
// Value: dataInclusionStructureV1.id (e.g. 'cd35--1234', 'dora--<uuid>', 'emplois-de-linclusion--<uuid>')

export const ambiguousOverrides: Record<string, string> = {
  // '<partnerOrgId>': '<v1-structure-id>',
}

// Partner orgs to skip — will be migrated as Data Inclusion Legacy partenaire
// (managed outside the v1 migration flow)
export const customPartnerOverrideIds: Set<string> = new Set([
  // '<partnerOrgId>',
])
