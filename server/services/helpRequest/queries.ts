import type { Prisma } from '@prisma/client'
import {
  filterFileInstruction,
  filterHelpRequest,
  filterSocialSupport
} from '../helper'
import { HelpRequestRepo } from '~/server/database'
import type {
  AppContextPermissions,
  FileInstructionPermissions,
  SecurityRuleContext,
  SecurityRuleGrantee
} from '~/server/security'
import {
  getAppContextPermissions,
  getFileInstructionPermissions
} from '~/server/security'

export const select = {
  id: true,
  financialSupport: true,
  allocatedAmount: true,
  askedAmount: true,
  isRefundable: true,
  handlingDate: true,
  paymentDate: true,
  paymentMethod: true,
  prescribingOrganizationId: true,
  prescribingOrganizationContactId: true,
  prescribingOrganization: {
    select: { id: true, name: true }
  },
  prescribingOrganizationContact: {
    select: { id: true, name: true }
  },
  fileInstruction: {
    select: {
      id: true,
      type: true,
      fullFile: true,
      decisionDate: true,
      dispatchDate: true,
      examinationDate: true,
      externalStructure: true,
      instructorOrganizationId: true,
      instructorOrganizationContactId: true,
      refusalReason: true,
      refusalReasonOther: true,
      instructorOrganization: {
        select: { id: true, name: true }
      },
      instructorOrganizationContact: {
        select: { id: true, name: true }
      },
      socialSupport: {
        select: {
          id: true,
          socialSupportType: true,
          subtype: true,
          date: true,
          structureId: true,
          created: true,
          updated: true,
          status: true,
          familyFileId: true,
          beneficiaryId: true,
          createdById: true,
          lastUpdatedById: true,
          dueDate: true,
          privateSynthesis: true,
          privateSynthesisRichText: true,
          synthesis: true,
          synthesisRichText: true,
          ministerId: true,
          numeroPegase: true,
          createdBy: {
            select: { id: true, firstName: true, lastName: true }
          },
          lastUpdatedBy: {
            select: { id: true, firstName: true, lastName: true }
          },
          subjects: true,
          minister: true,
          supportProgramId: true,
          supportProgram: {
            select: {
              id: true,
              startDate: true,
              endDate: true,
              supportProgramName: { select: { id: true, name: true } }
            }
          },
          beneficiary: {
            select: {
              id: true,
              usualName: true,
              firstName: true,
              birthName: true,
              birthDate: true
            }
          },
          familyFile: {
            select: {
              id: true,
              structureId: true,
              referents: true
            }
          },
          documents: {
            select: { key: true, name: true }
          },
          socialSupportRedirections: {
            select: {
              id: true,
              type: true,
              externalStructureName: true,
              partnerOrganizationId: true,
              partnerOrganizationContactId: true,
              partnerOrganization: { select: { name: true } },
              partnerOrganizationContact: { select: { name: true } },
              redirectionReason: { select: { name: true } }
            }
          }
        }
      }
    }
  }
}

function findOne(user: SecurityRuleGrantee, id: string) {
  return HelpRequestRepo.findUniqueOrThrow(user, {
    where: { id },
    select
  })
}

type HelpRequestOutput = NonNullable<Prisma.PromiseReturnType<typeof findOne>>

export async function getOne(ctx: SecurityRuleContext, id: string) {
  const helpRequest = await findOne(ctx.user, id)
  const {
    fileInstruction: { socialSupport }
  } = helpRequest
  const { familyFile } = socialSupport
  const permissions = getFileInstructionPermissions({
    ctx,
    familyFile,
    socialSupport
  })
  const appPermissions = getAppContextPermissions(ctx)
  return {
    helpRequest: filter(appPermissions, permissions, helpRequest),
    permissions
  }
}

export function filter(
  appPermissions: AppContextPermissions,
  permissions: FileInstructionPermissions,
  helpRequest: HelpRequestOutput
) {
  const { fileInstruction } = helpRequest
  const { socialSupport } = fileInstruction

  const conditions = {
    details: permissions.get.details,
    minister: appPermissions.module.ministere,
    privateSynthesis: permissions.get.privateSynthesis
  }
  const { subjects, ...filteredSocialSupport } = filterSocialSupport({
    socialSupport,
    conditions
  })
  const socialSupportSubject = subjects.length ? subjects[0] : null
  const filteredHelpRequest = filterHelpRequest({
    helpRequest,
    conditions
  })

  const filteredFileInstruction = filterFileInstruction({
    fileInstruction,
    conditions
  })

  // Attached document names are visible for all roles that can access the followup
  const documentNames = socialSupport.documents.map(d => ({
    key: d.key,
    name: d.name
  }))

  return {
    ...filteredHelpRequest,
    subject: socialSupportSubject,
    subjectId: socialSupportSubject?.id,
    fileInstruction: {
      ...filteredFileInstruction,
      socialSupport: {
        ...filteredSocialSupport,
        documents: documentNames
      }
    }
  }
}
