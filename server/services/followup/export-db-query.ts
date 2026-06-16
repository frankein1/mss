import type { Prisma } from '@prisma/client'
import { FollowupRepo } from '~/server/database'
import type { SecurityRuleGrantee } from '~/server/security'

const followupExportSelect = {
  id: true,
  medium: true,
  firstFollowup: true,
  classified: true,
  forwardedToJustice: true,
  helpRequested: true,
  thirdPersonName: true,
  place: true,
  duration: true,
  prescribingOrganizationId: true,
  prescribingOrganizationContactId: true,
  socialSupport: {
    select: {
      id: true,
      structureId: true, // used for permission check
      updated: true,
      status: true,
      date: true,
      ministerId: true,
      numeroPegase: true,
      synthesis: true,
      dueDate: true,
      createdById: true,
      subjects: {
        select: {
          id: true,
          name: true
        }
      },
      familyFile: {
        select: {
          id: true,
          structureId: true, // used for permission check
          referents: { select: { id: true } }
        }
      },
      beneficiary: {
        select: {
          id: true,
          fileNumber: true,
          usualName: true,
          firstName: true,
          birthName: true
        }
      },
      documents: {
        select: {
          key: true,
          name: true,
          confidential: true
        }
      },
      socialSupportRedirections: {
        select: {
          id: true,
          type: true,
          externalStructureName: true,
          partnerOrganizationId: true,
          partnerOrganizationContactId: true,
          redirectionReason: { select: { name: true } }
        }
      }
    }
  },
  supportProgram: {
    select: {
      supportProgramName: {
        select: { name: true }
      }
    }
  }
} satisfies Prisma.FollowupSelect

export type ExportFollowupResult = Prisma.FollowupGetPayload<{
  select: typeof followupExportSelect
}>

export function findAllForExport(
  user: SecurityRuleGrantee,
  where: Prisma.FollowupWhereInput
) {
  return FollowupRepo.findMany(user, {
    relationLoadStrategy: 'query',
    where,
    select: followupExportSelect
  })
}
