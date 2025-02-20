import { Prisma, UserStatus, UserActivityType } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import {
  BeneficiaryRelativeRepo,
  BeneficiaryRepo,
  BudgetRepo,
  DocumentRepo,
  FileInstructionRepo,
  FollowupRepo,
  HelpRequestRepo,
  HousingHelpRequestRepo,
  NotificationRepo,
  SocialSupportRepo,
  StructureRepo
} from '~/server/database'
import { createMutation } from '~/server/route'
import { IdInput, idSchema } from '~/server/schema'
import { AdminContext } from '~/server/trpc'
import { createEmail } from '~/server/query'
import { getDisabledStructureAlert } from '~/server/email'

const adminHandler = async ({
  ctx,
  input
}: {
  ctx: AdminContext
  input: IdInput
}) => {
  const { id } = input

  const structure = await StructureRepo.findUniqueOrThrow(ctx.user, {
    where: {
      id
    },
    select: {
      id: true,
      created: true,
      lastAccess: true,
      name: true,
      users: {
        where: {
          status: UserStatus.Active
        }
      }
    }
  })

  const deleteNotifications = NotificationRepo.prisma.deleteMany({
    where: {
      beneficiary: {
        structureId: id
      }
    }
  })

  const deleteDocuments = DocumentRepo.prisma.deleteMany({
    where: {
      beneficiary: {
        structureId: id
      }
    }
  })

  const deleteRelatives = BeneficiaryRelativeRepo.prisma.deleteMany({
    where: {
      beneficiary: {
        structureId: id
      }
    }
  })

  const deleteBudget = BudgetRepo.prisma.deleteMany({
    where: {
      familyFile: {
        structureId: id
      }
    }
  })

  const socialSupportUpdate: Required<
    Omit<
      Prisma.SocialSupportUpdateManyMutationInput,
      | 'id'
      | 'structureId'
      | 'familyFileId'
      | 'beneficiaryId'
      | 'createdById'
      | 'lastUpdateById'
      | 'date'
      | 'status'
      | 'created'
      | 'updated'
      | 'socialSupportType'
    >
  > = {
    synthesis: null,
    privateSynthesis: null,
    synthesisRichText: null,
    privateSynthesisRichText: null,
    numeroPegase: '',
    ministre: null,
    dueDate: null
  }
  const updateSocialSupport = SocialSupportRepo.prisma.updateMany({
    where: {
      beneficiary: {
        structureId: id
      }
    },
    data: socialSupportUpdate
  })

  const fileInstructionUpdate: Required<
    Omit<
      Prisma.FileInstructionUncheckedUpdateManyInput,
      'id' | 'updated' | 'type' | 'socialSupportId'
    >
  > = {
    instructorOrganizationId: null,
    instructorOrganizationContactId: null,
    externalStructure: false,
    examinationDate: null,
    decisionDate: null,
    refusalReason: null,
    refusalReasonOther: null,
    dispatchDate: null,
    fullFile: null
  }
  await FileInstructionRepo.prisma.updateMany({
    where: {
      socialSupport: {
        beneficiary: {
          structureId: id
        }
      }
    },
    data: fileInstructionUpdate
  })

  const helpRequestUpdate: Required<
    Omit<
      Prisma.HelpRequestUncheckedUpdateManyInput,
      'id' | 'subjectId' | 'financialSupport' | 'fileInstructionId'
    >
  > = {
    prescribingOrganizationId: null,
    prescribingOrganizationContactId: null,
    askedAmount: null,
    allocatedAmount: null,
    paymentMethod: null,
    paymentDate: null,
    handlingDate: null,
    isRefundable: false
  }
  await HelpRequestRepo.prisma.updateMany({
    where: {
      fileInstruction: {
        socialSupport: {
          beneficiary: {
            structureId: id
          }
        }
      }
    },
    data: helpRequestUpdate
  })

  const housingHelpRequestUpdate: Required<
    Omit<
      Prisma.HousingHelpRequestUncheckedUpdateManyInput,
      'id' | 'fileInstructionId'
    >
  > = {
    prescribingOrganizationId: null,
    prescribingOrganizationContactId: null,
    isFirst: false,
    firstOpeningDate: null,
    askedHousing: { set: [] },
    uniqueId: null,
    taxHouseholdAdditionalInformation: null,
    maxRent: null,
    maxCharges: null,
    housingType: { set: [] },
    roomCount: { set: [] },
    isPmr: null,
    reason: null,
    lowIncomeHousingType: { set: [] }
  }
  await HousingHelpRequestRepo.prisma.updateMany({
    where: {
      fileInstruction: {
        socialSupport: {
          beneficiary: {
            structureId: id
          }
        }
      }
    },
    data: housingHelpRequestUpdate
  })

  const followupUpdate: Required<
    Omit<
      Prisma.FollowupUncheckedUpdateManyInput,
      'id' | 'updated' | 'socialSupportId' | 'medium'
    >
  > = {
    prescribingOrganizationId: null,
    prescribingOrganizationContactId: null,
    helpRequested: null,
    place: null,
    structureName: null,
    thirdPersonName: null,
    classified: null,
    firstFollowup: null,
    forwardedToJustice: null,
    redirected: null,
    duration: null
  }
  await FollowupRepo.prisma.updateMany({
    where: {
      socialSupport: {
        beneficiary: {
          structureId: id
        }
      }
    },
    data: followupUpdate
  })

  const beneficiaryUpdate: Required<
    Omit<
      Prisma.BeneficiaryUncheckedUpdateManyInput,
      | 'id'
      | 'structureId'
      | 'familyFileId'
      | 'previousFamilyFileId'
      | 'splitFromFileById'
      | 'createdById'
      | 'archiveDueDate'
      | 'archiveDueDateHistory'
      | 'draft'
      | 'status'
      | 'created'
      | 'updated'
      | 'externalRdvspId'
      | 'fileNumber'
      | 'birthDate'
    >
  > = {
    archivedById: ctx.user.id,
    archived: new Date(),
    title: null,
    pensionOrganisations: {
      set: []
    },
    usualName: null,
    birthName: null,
    firstName: null,
    birthPlace: null,
    deathDate: null,
    gender: null,
    nationality: null,
    relationship: null,
    aidantConnectAuthorized: false,
    accommodationMode: null,
    accommodationName: null,
    accommodationAdditionalInformation: null,
    street: null,
    addressComplement: null,
    zipcode: null,
    city: null,
    department: null,
    region: null,
    qpv: null,
    noPhone: false,
    phone1: null,
    phone2: null,
    email: null,
    familySituation: null,
    weddingDate: null,
    divorceDate: null,
    caregiver: false,
    minorChildren: null,
    majorChildren: null,
    mobility: null,
    vulnerablePerson: false,
    ministereCategorie: null,
    ministereDepartementServiceAc: null,
    ministereStructure: null,
    gir: null,
    doctor: null,
    healthAdditionalInformation: null,
    socialSecurityNumber: null,
    insurance: null,
    socioProfessionalCategory: null,
    studyLevel: null,
    occupation: null,
    employer: null,
    employerSiret: null,
    unemploymentNumber: null,
    otherPensionOrganisations: null,
    cafNumber: null,
    bank: null,
    funeralContract: null,
    protectionMeasure: null,
    representative: null,
    prescribingStructure: null,
    orientationType: null,
    orientationStructure: null,
    serviceProviders: null,
    involvedPartners: null,
    additionalInformation: null,
    numeroPegase: null,
    accommodationZone: null
  }
  const updateBeneficiaries = BeneficiaryRepo.prisma.updateMany({
    where: {
      structureId: id
    },
    data: beneficiaryUpdate
  })

  const updateStructure = StructureRepo.prisma.update({
    where: {
      id
    },
    data: {
      disabled: true,
      dpoFirstName: null,
      dpoLastName: null,
      dpoEmail: null,
      address: '',
      phone: '',
      email: ''
    }
  })

  await prismaClient.$transaction([
    deleteNotifications,
    deleteDocuments,
    deleteBudget,
    deleteRelatives,
    updateSocialSupport,
    updateBeneficiaries,
    updateStructure
  ])

  for (const user of structure.users) {
    await createEmail({
      to: user.email,
      subject: 'Suppression de votre espace de travail sur Mon Suivi Social',
      ...getDisabledStructureAlert()
    })
  }

  return {
    name: structure.name,
    id: structure.id,
    disabled: true
  }
}

export const disableStructure = createMutation({
  inputValidation: idSchema,
  adminHandler,
  auditLog: {
    key: 'admin.structure.disable',
    target: 'Structure',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.ARCHIVE
  }
})
