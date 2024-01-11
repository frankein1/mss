import { Prisma } from '@prisma/client'
import { HelpRequestRepo } from '~/server/database'
import {
  HelpRequestPermissions,
  SecurityRuleContext,
  SecurityRuleGrantee,
  getHelpRequestPermissions
} from '~/server/security'

export const select = {
  id: true,
  fullFile: true,
  subject: true,
  allocatedAmount: true,
  askedAmount: true,
  decisionDate: true,
  dispatchDate: true,
  examinationDate: true,
  externalStructure: true,
  handlingDate: true,
  paymentDate: true,
  paymentMethod: true,
  refusalReason: true,
  refusalReasonOther: true,
  prescribingOrganizationId: true,
  instructorOrganizationId: true,
  prescribingOrganization: {
    select: {
      id: true,
      name: true
    }
  },
  instructorOrganization: {
    select: {
      id: true,
      name: true
    }
  },
  socialSupport: {
    select: {
      id: true,
      created: true,
      structureId: true,
      beneficiaryId: true,
      createdById: true,
      updated: true,
      status: true,
      synthesis: true,
      numeroPegase: true,
      privateSynthesis: true,
      ministre: true,
      dueDate: true,
      date: true,
      types: {
        select: {
          id: true,
          name: true
        }
      },
      documents: {
        select: {
          key: true,
          name: true,
          type: true,
          size: true,
          tags: true,
          confidential: true
        }
      },
      beneficiary: {
        select: {
          id: true,
          fileNumber: true,
          firstName: true,
          birthName: true,
          usualName: true,
          email: true,
          referents: true,
          structureId: true
        }
      },
      createdBy: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true
        }
      }
    }
  }
}

function findOne(user: SecurityRuleGrantee, id: string) {
  return HelpRequestRepo.findUniqueOrThrow(user, {
    where: {
      id
    },
    select
  })
}

type HelpRequestOutput = Prisma.PromiseReturnType<typeof findOne>

export async function getPage(
  ctx: SecurityRuleContext,
  args: Omit<Prisma.HelpRequestFindManyArgs, 'select' | 'include'>
) {
  const helpRequests = await HelpRequestRepo.findMany(ctx.user, {
    where: args.where,
    select,
    take: args.take,
    skip: args.skip,
    orderBy: args.orderBy
  })
  return helpRequests.map(helpRequest => {
    const { socialSupport } = helpRequest
    const { beneficiary } = socialSupport
    const permissions = getHelpRequestPermissions({
      ctx,
      beneficiary,
      socialSupport
    })
    return {
      helpRequest: filter(permissions, helpRequest),
      permissions
    }
  })
}

export async function getOne(ctx: SecurityRuleContext, id: string) {
  const helpRequest = await HelpRequestRepo.findUniqueOrThrow(ctx.user, {
    where: { id },
    select
  })
  const { socialSupport } = helpRequest
  const { beneficiary } = socialSupport
  const permissions = getHelpRequestPermissions({
    ctx,
    beneficiary,
    socialSupport
  })
  return {
    helpRequest: filter(permissions, helpRequest),
    permissions
  }
}

export function filter(
  permissions: HelpRequestPermissions,
  helpRequest: NonNullable<HelpRequestOutput>
) {
  const meta = getMeta(helpRequest)
  const details = getDetails(permissions, helpRequest)
  const privateSynthesis = getPrivateSynthesis(permissions, helpRequest)

  return {
    ...meta,
    ...details,
    ...privateSynthesis
  }
}

function getMeta(helpRequest: NonNullable<HelpRequestOutput>) {
  const { socialSupport } = helpRequest
  return {
    id: helpRequest.id,
    fullFile: helpRequest.fullFile,
    subject: helpRequest.subject,

    date: socialSupport.date,
    structureId: socialSupport.structureId,
    created: socialSupport.created,
    createdBy: socialSupport.createdBy,
    createdById: socialSupport.createdById,
    updated: socialSupport.updated,
    status: socialSupport.status,

    typeId: socialSupport.types[0].id,
    type: socialSupport.types[0],
    beneficiary: socialSupport.beneficiary,
    beneficiaryId: socialSupport.beneficiaryId
  }
}

function getDetails(
  permissions: HelpRequestPermissions,
  helpRequest: NonNullable<HelpRequestOutput>
) {
  if (!permissions.get.details) {
    return {}
  }

  const { socialSupport } = helpRequest

  return {
    allocatedAmount: helpRequest.allocatedAmount,
    askedAmount: helpRequest.askedAmount,
    decisionDate: helpRequest.decisionDate,
    dispatchDate: helpRequest.dispatchDate,
    dueDate: socialSupport.dueDate,
    examinationDate: helpRequest.examinationDate,
    externalStructure: helpRequest.externalStructure,
    handlingDate: helpRequest.handlingDate,
    instructorOrganizationId: helpRequest.instructorOrganizationId,
    instructorOrganization: helpRequest.instructorOrganization,

    paymentDate: helpRequest.paymentDate,
    paymentMethod: helpRequest.paymentMethod,
    prescribingOrganizationId: helpRequest.prescribingOrganizationId,
    prescribingOrganization: helpRequest.prescribingOrganization,
    refusalReason: helpRequest.refusalReason,

    subject: helpRequest.subject,
    refusalReasonOther: helpRequest.refusalReasonOther,

    documents: socialSupport.documents,
    synthesis: socialSupport.synthesis,
    ministre: socialSupport.ministre,
    numeroPegase: socialSupport.numeroPegase
  }
}

function getPrivateSynthesis(
  permissions: HelpRequestPermissions,
  helpRequest: NonNullable<HelpRequestOutput>
) {
  if (!permissions.get.privateSynthesis) {
    return {}
  }

  const { socialSupport } = helpRequest

  return {
    privateSynthesis: socialSupport.privateSynthesis
  }
}
