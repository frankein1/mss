// Copy this file to migrate-data-inclusion-v1.overrides.ignore.ts and fill in your overrides.
//
// Used when a partner org's v0 dataInclusionId maps to multiple v1 structure IDs (ambiguous match).
// Find candidates in the `ambiguousDetails` array of the dry-run report, then pick the correct v1 id.
//
// Key:   partnerOrganization.id (UUID)
// Value: dataInclusionStructureV1.id (e.g. 'cd35--1234', 'dora--<uuid>', 'emplois-de-linclusion--<uuid>')

export const ambiguousOverrides: Record<string, string> = {
  // '<partnerOrgId>': '<v1-structure-id>',
}
