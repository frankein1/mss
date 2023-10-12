import { DocumentRepo } from '~/server/repository'
import { SecurityRuleGrantee } from '~/server/security'

export function getDocumentSecurityTarget(
  user: SecurityRuleGrantee,
  key: string
) {
  return DocumentRepo.findUniqueOrThrow(user, {
    where: { key },
    select: {
      createdById: true,
      confidential: true
    }
  })
}
