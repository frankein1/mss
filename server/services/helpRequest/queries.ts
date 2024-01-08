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
  openingDate: true,
  created: true,
  structureId: true,
  beneficiaryId: true,
  createdById: true,
  updated: true,
  fullFile: true,
  status: true,
  subject: true,
  typeId: true,
  type: true,
  allocatedAmount: true,
  askedAmount: true,
  decisionDate: true,
  dispatchDate: true,
  dueDate: true,
  examinationDate: true,
  externalStructure: true,
  handlingDate: true,
  paymentDate: true,
  paymentMethod: true,
  prescribingOrganizationId: true,
  refusalReason: true,
  synthesis: true,
  refusalReasonOther: true,
  numeroPegase: true,
  privateSynthesis: true,
  ministre: true,
  instructorOrganizationId: true,
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
  },
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
    const permissions = getHelpRequestPermissions({
      ctx,
      beneficiary: helpRequest.beneficiary,
      helpRequest
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
  const permissions = getHelpRequestPermissions({
    ctx,
    beneficiary: helpRequest.beneficiary,
    helpRequest
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
  return {
    id: helpRequest.id,
    structureId: helpRequest.structureId,
    created: helpRequest.created,
    createdBy: helpRequest.createdBy,
    createdById: helpRequest.createdById,
    updated: helpRequest.updated,
    openingDate: helpRequest.openingDate,
    fullFile: helpRequest.fullFile,
    status: helpRequest.status,
    subject: helpRequest.subject,
    typeId: helpRequest.typeId,
    type: helpRequest.type,
    beneficiary: helpRequest.beneficiary,
    beneficiaryId: helpRequest.beneficiaryId
  }
}

function getDetails(
  permissions: HelpRequestPermissions,
  helpRequest: NonNullable<HelpRequestOutput>
) {
  if (!permissions.get.details) {
    return {}
  }

  return {
    allocatedAmount: helpRequest.allocatedAmount,
    askedAmount: helpRequest.askedAmount,
    decisionDate: helpRequest.decisionDate,
    dispatchDate: helpRequest.dispatchDate,
    documents: helpRequest.documents,
    dueDate: helpRequest.dueDate,
    examinationDate: helpRequest.examinationDate,
    externalStructure: helpRequest.externalStructure,
    handlingDate: helpRequest.handlingDate,
    instructorOrganizationId: helpRequest.instructorOrganizationId,
    instructorOrganization: helpRequest.instructorOrganization,
    ministre: permissions.get.ministre ? helpRequest.ministre : undefined,
    numeroPegase: permissions.get.numeroPegase
      ? helpRequest.numeroPegase
      : undefined,
    paymentDate: helpRequest.paymentDate,
    paymentMethod: helpRequest.paymentMethod,
    prescribingOrganizationId: helpRequest.prescribingOrganizationId,
    prescribingOrganization: helpRequest.prescribingOrganization,
    refusalReason: helpRequest.refusalReason,
    synthesis: helpRequest.synthesis,
    subject: helpRequest.subject,
    refusalReasonOther: helpRequest.refusalReasonOther
  }
}

function getPrivateSynthesis(
  permissions: HelpRequestPermissions,
  helpRequest: NonNullable<HelpRequestOutput>
) {
  if (!permissions.get.privateSynthesis) {
    return {}
  }

  return {
    privateSynthesis: helpRequest.privateSynthesis
  }
}
