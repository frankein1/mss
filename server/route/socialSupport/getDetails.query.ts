import type { Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { SecurityRuleContext } from '~/server/security'
import type { IdInput } from '~/server/schema'
import { idSchema } from '~/server/schema'
import { SocialSupportRepo } from '~/server/database'
import { SocialSupportService } from '~/server/services'
import { formatSocialSupportDetail } from './utils'

async function getSocialSupportDetail({
  ctx,
  input: { id }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) {
  return SocialSupportRepo.findUniqueOrThrow(ctx.user, {
    where: { id },
    select: {
      id: true,
      structureId: true,
      familyFileId: true,
      beneficiaryId: true,
      createdById: true,
      lastUpdatedById: true,
      date: true,
      synthesis: true,
      privateSynthesis: true,
      synthesisRichText: true,
      privateSynthesisRichText: true,
      ministerId: true,
      numeroPegase: true,
      status: true,
      dueDate: true,
      updated: true,
      socialSupportType: true,
      subtype: true,
      createdBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      },
      lastUpdatedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      },
      // For permissions handling
      familyFile: {
        select: {
          id: true,
          structureId: true,
          referents: {
            select: { id: true, role: true, status: true, structureId: true }
          }
        }
      },
      beneficiary: {
        select: {
          id: true,
          firstName: true,
          usualName: true,
          birthName: true,
          birthDate: true
        }
      },
      documents: {
        select: {
          key: true,
          name: true,
          createdById: true,
          confidential: true
        }
      },
      subjects: {
        select: { id: true, name: true }
      },
      minister: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          function: true,
          government: true
        }
      },
      socialSupportRedirections: {
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          type: true,
          motif: true,
          externalStructureName: true,
          partnerOrganizationId: true,
          partnerOrganizationContactId: true,
          partnerOrganization: { select: { name: true } },
          partnerOrganizationContact: { select: { name: true } }
        }
      },
      comments: {
        orderBy: { created: 'asc' },
        select: {
          id: true,
          created: true,
          createdById: true,
          updated: true,
          content: true,
          createdBy: {
            select: { id: true, firstName: true, lastName: true }
          }
        }
      },
      fileInstruction: {
        select: {
          id: true,
          type: true,
          instructorOrganizationId: true,
          instructorOrganizationContactId: true,
          externalStructure: true,
          examinationDate: true,
          decisionDate: true,
          refusalReason: true,
          refusalReasonOther: true,
          dispatchDate: true,
          fullFile: true,
          instructorOrganization: { select: { id: true, name: true } },
          instructorOrganizationContact: { select: { id: true, name: true } },
          helpRequest: {
            select: {
              id: true,
              prescribingOrganizationId: true,
              prescribingOrganizationContactId: true,
              financialSupport: true,
              isRefundable: true,
              askedAmount: true,
              allocatedAmount: true,
              paymentMethod: true,
              paymentDate: true,
              handlingDate: true,
              prescribingOrganization: { select: { id: true, name: true } },
              prescribingOrganizationContact: {
                select: { id: true, name: true }
              }
            }
          },
          housingHelpRequest: {
            select: {
              id: true,
              prescribingOrganizationId: true,
              prescribingOrganizationContactId: true,
              isFirst: true,
              firstOpeningDate: true,
              askedHousing: true,
              uniqueId: true,
              taxHouseholdAdditionalInformation: true,
              maxRent: true,
              maxCharges: true,
              housingType: true,
              roomCount: true,
              isPmr: true,
              reason: true,
              lowIncomeHousingType: true,
              handlingDate: true,
              prescribingOrganization: { select: { id: true, name: true } },
              prescribingOrganizationContact: {
                select: { id: true, name: true }
              }
            }
          }
        }
      },
      followup: {
        select: {
          id: true,
          medium: true,
          helpRequested: true,
          place: true,
          thirdPersonName: true,
          classified: true,
          firstFollowup: true,
          forwardedToJustice: true,
          duration: true,
          prescribingOrganization: { select: { name: true } },
          prescribingOrganizationContact: {
            select: { name: true }
          }
        }
      },
      _count: {
        select: {
          notifications: {
            where: { read: false, recipientId: ctx.user.id }
          }
        }
      }
    }
  })
}

const handler = async ({
  ctx,
  input
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const socialSupport = await getSocialSupportDetail({ ctx, input })

  return formatSocialSupportDetail(socialSupport, ctx, socialSupport.familyFile)
}

export type SocialSupportDetail = Prisma.PromiseReturnType<
  typeof getSocialSupportDetail
>

const securityCheck = async (ctx: SecurityRuleContext, input: IdInput) => {
  const permissions = await SocialSupportService.getEditionPermissions(
    ctx,
    input.id
  )
  return permissions.view
}

export const getDetails = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
