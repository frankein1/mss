import { UserRole } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import {
  BeneficiaryRelativeRepo,
  BeneficiaryRepo,
  BudgetRepo,
  DocumentRepo,
  FileInstructionRepo,
  HelpRequestRepo,
  HousingHelpRequestRepo,
  NotificationRepo,
  SocialSupportRepo,
  StructureRepo,
  UserRepo
} from '~/server/database'
import { createMutation } from '~/server/route'
import { IdInput, idSchema } from '~/server/schema'
import { AdminContext } from '~/server/trpc'
import { canBeDisabled } from '~/utils/structure'
import { createEmail } from '~/server/query'
import {
  getDisabledStructureAlert,
  getDisabledStructureAdminAlert
} from '~/server/email'

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
      lastAccess: true,
      name: true,
      users: {
        where: {
          role: UserRole.StructureManager
        }
      }
    }
  })

  if (!canBeDisabled(structure)) {
    throw createError({
      statusCode: 400,
      message: 'La structure ne peut être désactivée.'
    })
  }

  const deleteNotifications = NotificationRepo.prisma.deleteMany({
    where: {
      familyFile: {
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

  const updateSocialSupport = SocialSupportRepo.prisma.updateMany({
    where: {
      beneficiary: {
        structureId: id
      }
    },
    data: {
      synthesis: null,
      privateSynthesis: null,
      numeroPegase: '',
      ministre: null,
      dueDate: null
    }
  })

  await FileInstructionRepo.prisma.updateMany({
    where: {
      socialSupport: {
        beneficiary: {
          structureId: id
        }
      }
    },
    data: {
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
  })

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
    data: {
      askedAmount: null,
      allocatedAmount: null,
      paymentMethod: null,
      paymentDate: null,
      handlingDate: null
    }
  })

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
    data: {
      isFirst: false,
      firstOpeningDate: null,
      uniqueId: null,
      taxHouseholdAdditionalInformation: null,
      maxRent: null,
      maxCharges: null,
      isPmr: null,
      reason: null
    }
  })

  const updateBeneficiaries = BeneficiaryRepo.prisma.updateMany({
    where: {
      structureId: id
    },
    data: {
      archivedById: ctx.user.id,
      archived: new Date(),
      // fileNumber: prismaClient.beneficiary.fields.id,
      title: null,
      pensionOrganisations: {
        set: []
      },
      usualName: null,
      birthName: null,
      firstName: null,
      // birthDate: null,
      birthPlace: null,
      deathDate: null,
      gender: null,
      nationality: null,
      accommodationMode: null,
      accommodationName: null,
      accommodationAdditionalInformation: null,
      street: null,
      addressComplement: null,
      zipcode: null,
      city: null,
      department: null,
      region: null,
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
  })

  const updateStructure = StructureRepo.prisma.update({
    where: {
      id
    },
    data: {
      disabled: true
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

  const admins = await UserRepo.prisma.findMany({
    where: {
      role: UserRole.Administrator
    },
    select: {
      email: true
    }
  })

  for (const admin of admins) {
    await createEmail({
      to: admin.email,
      subject: `Suppression de la structure ${structure.name}`,
      ...getDisabledStructureAdminAlert(structure.name)
    })
  }

  return {
    name: structure.name,
    id: structure.id,
    disable: true
  }
}

export const disableStructure = createMutation({
  inputValidation: idSchema,
  adminHandler
})
