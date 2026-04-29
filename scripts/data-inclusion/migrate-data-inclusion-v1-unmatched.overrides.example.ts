// Copy this file to migrate-data-inclusion-v1-unmatched.overrides.ignore.ts and fill in your overrides.
//
// Used for two cases:
//   1. Ambiguous matches — multiple v1 structures share the same name+zipcode or SIRET.
//      Find candidates in `ambiguousByNameDetails` / `ambiguousBySiretDetails` in the dry-run report.
//   2. SIRET fallback confirmation — entries in `matchedBySiretFallbackDetails` are NOT applied
//      automatically. Review name and zipcode, then add confirmed matches here.
//
// Key:   partnerOrganization.id (UUID)
// Value: dataInclusionStructureV1.id (e.g. 'cd35--1234', 'dora--<uuid>', 'emplois-de-linclusion--<uuid>')

export const ambiguousOverrides: Record<string, string> = {
  // '<partnerOrgId>': '<v1-structure-id>',
}
