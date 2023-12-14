import { HelpRequestPermissions } from '~/server/security'

export function prepareGetHelpRequestsPageSelect(
  permissions: HelpRequestPermissions
) {
  return {
    id: true,
    status: true,
    type: { select: { id: true, name: true } },
    dueDate: permissions.get.anyDueDate,
    externalStructure: true,
    examinationDate: true,
    askedAmount: permissions.get.anyAskedAmount,
    allocatedAmount: permissions.get.anyAllocatedAmount,
    paymentMethod: permissions.get.anyPaymentMethod,
    paymentDate: permissions.get.anyPaymentDate,
    handlingDate: permissions.get.anyHandlingDate,
    subject: true,
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
    instructorOrganization: permissions.get.anyInstructorOrganization
      ? { select: { name: true } }
      : false,
    structureId: true
  }
}
