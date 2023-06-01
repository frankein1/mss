export const beneficiarySecurityTargetSelect = {
  id: true,
  structureId: true,
  referents: { select: { id: true } }
} as const
