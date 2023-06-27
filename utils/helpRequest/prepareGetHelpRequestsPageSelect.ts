import type { User } from '@prisma/client'
import { canViewAnyHelpRequestDetails } from '~/server/security/rules'

export function prepareGetHelpRequestsPageSelect(user: User) {
  return {
    id: true,
    status: true,
    type: { select: { id: true, name: true } },
    dueDate: canViewAnyHelpRequestDetails(user),
    externalStructure: true,
    examinationDate: true,
    askedAmount: true,
    allocatedAmount: canViewAnyHelpRequestDetails(user),
    paymentMethod: canViewAnyHelpRequestDetails(user),
    paymentDate: canViewAnyHelpRequestDetails(user),
    handlingDate: canViewAnyHelpRequestDetails(user),
    financialSupport: true,
    createdById: true,
    beneficiary: {
      select: {
        id: true,
        structureId: true,
        fileNumber: true,
        firstName: true,
        birthName: true,
        usualName: true,
        email: true,
        referents: true
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
    instructorOrganization: canViewAnyHelpRequestDetails(user)
      ? {
          select: { name: true }
        }
      : false,
    structureId: true
  }
}
