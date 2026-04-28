import type { Prisma } from '@prisma/client'
import { UserStatus } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import {
  BeneficiaryRelativeRepo,
  BeneficiaryRepo,
  BudgetRepo,
  CommentRepo,
  DocumentRepo,
  FileInstructionRepo,
  FollowupRepo,
  HelpRequestRepo,
  HousingHelpRequestRepo,
  NotificationRepo,
  SocialSupportRepo,
  StructureRepo,
  UserRepo
} from '~/server/database'
import { customAlphabet } from 'nanoid'
import { deleteFiles } from '~/server/lib/s3/file'
import { createEmail } from '~/server/query/email'
import { createEmailSubject } from '~/server/email/createEmailSubject'
import { canBeDisabled } from '~/utils/structure'
import { forbiddenError } from '~/server/trpc'
import type { AppConfig } from '~/types/appConfig'
import { getDisabledStructureAlert } from '~/server/email/disabledStructureAlert'

export const disableStructure = async ({
  id,
  disabledById,
  config
}: {
  id: string
  disabledById: string | null
  config: AppConfig
}) => {
  const structure = await StructureRepo.prisma.findUniqueOrThrow({
    where: {
      id
    },
    select: {
      id: true,
      created: true,
      lastAccess: true,
      name: true,
      users: {
        select: {
          id: true,
          status: true,
          email: true
        }
      }
    }
  })

  if (!canBeDisabled(structure)) {
    throw forbiddenError(
      `disable-structure: cannot disable, lastAccess: ${formatDate(structure.lastAccess || structure.created)}`
    )
  }

  let structureDocumentKeys: string[] | undefined
  if (config.document.useS3Storage) {
    // All documents from the structure included confidential documents will be deleted
    // Allow use of prismaClient because it is an admin function with no reading but just deleting
    structureDocumentKeys = (
      await prismaClient.document.findMany({
        where: {
          migrated: true,
          beneficiary: {
            structureId: id
          }
        },
        select: { filenameDisk: true }
      })
    ).map(s => s.filenameDisk)
  }

  const deleteNotifications = () =>
    NotificationRepo.prisma.deleteMany({
      where: {
        beneficiary: {
          structureId: id
        }
      }
    })

  const deleteComments = () =>
    CommentRepo.prisma.deleteMany({
      where: {
        socialSupport: {
          structureId: id
        }
      }
    })

  const deleteDocuments = () =>
    DocumentRepo.prisma.deleteMany({
      where: {
        beneficiary: {
          structureId: id
        }
      }
    })

  const deleteRelatives = () =>
    BeneficiaryRelativeRepo.prisma.deleteMany({
      where: {
        beneficiary: {
          structureId: id
        }
      }
    })

  const deleteBudget = () =>
    BudgetRepo.prisma.deleteMany({
      where: {
        familyFile: {
          structureId: id
        }
      }
    })

  await updateFileInstructions(id)
  await updateHelpRequests(id)
  await updateHousingHelpRequests(id)
  await updateFollowups(id)

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
      | 'subtype'
    >
  > = {
    synthesis: null,
    privateSynthesis: null,
    synthesisRichText: null,
    privateSynthesisRichText: null,
    numeroPegase: '',
    endOfSocialSupport: false,
    dueDate: null
  }
  const updateSocialSupports = () =>
    SocialSupportRepo.prisma.updateMany({
      where: { structureId: id },
      data: socialSupportUpdate
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
      | 'lastActivity'
      | 'status'
      | 'created'
      | 'updated'
      | 'externalRdvspId'
      | 'fileNumber'
      | 'birthDate'
      | 'firstNameNormalized'
      | 'usualNameNormalized'
      | 'birthNameNormalized'
    >
  > = {
    disabledById,
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
    district: null,
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
    activityStatus: { set: [] },
    contractType: null,
    studyLevel: null,
    schoolClass: null,
    schoolUai: null,
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
  const updateBeneficiaries = () =>
    BeneficiaryRepo.prisma.updateMany({
      where: { structureId: id },
      data: beneficiaryUpdate
    })

  const structureUpdate: Required<
    Omit<
      Prisma.StructureUncheckedUpdateManyInput,
      | 'id'
      | 'type'
      | 'zipcode'
      | 'city'
      | 'inhabitantsNumber'
      | 'inseeCode'
      | 'siret'
      | 'created'
      | 'updated'
      | 'lastActivity'
      | 'lastAccess'
      | 'deactivationAlertEmail'
      | 'deactivationAlertEmailDate'
    >
  > = {
    disabled: true,
    name: '',
    address: '',
    phone: '',
    email: '',
    dpoFirstName: null,
    dpoLastName: null,
    dpoEmail: null,
    externalRdvspActive: false,
    externalRdvspId: null
  }
  const updateStructure = () =>
    StructureRepo.prisma.update({
      where: { id },
      data: structureUpdate
    })

  await prismaClient.$transaction([
    deleteNotifications(),
    deleteComments(),
    deleteDocuments(),
    deleteBudget(),
    deleteRelatives(),
    updateSocialSupports(),
    updateBeneficiaries(),
    updateStructure()
  ])

  // If fails, will result in orphan documents to be cleaned by a scheduled job
  if (structureDocumentKeys?.length) {
    deleteFiles(config, structureDocumentKeys).catch(e =>
      console.error(
        `disable-structure: failure to delete from S3 for structure ${id}`,
        e
      )
    )
  }

  // Deactivate and anonymize all users of the structure while keeping the uniqueness of the email
  const nanoid = customAlphabet('123456789abcdefghijk', 5)
  const anonstructure = nanoid()

  type UserUpdate = Required<
    Omit<
      Prisma.UserUncheckedUpdateManyInput,
      | 'id'
      | 'structureId'
      | 'role'
      | 'firstAccess'
      | 'lastAccess'
      | 'created'
      | 'updated'
    >
  >

  for (const user of structure.users) {
    const deleteAccount = () =>
      prismaClient.account.deleteMany({
        where: {
          userId: user.id
        }
      })

    const deleteExternalAccount = () =>
      prismaClient.externalAccount.deleteMany({
        where: {
          userId: user.id
        }
      })

    const userUpdate: UserUpdate = {
      firstName: '',
      lastName: '',
      email: `${nanoid()}@disabled-structure-${anonstructure}.org`,
      status: UserStatus.Disabled,
      aidantConnectAuthorisation: null,
      externalRdvspId: null,
      authorizationCode: null,
      authorizationCodeValidity: null,
      accountReminderEmail: 0
    }
    const updateUser = () =>
      UserRepo.prisma.update({
        where: { id: user.id },
        data: userUpdate
      })

    await prismaClient.$transaction([
      deleteAccount(),
      deleteExternalAccount(),
      updateUser()
    ])

    if (user.status === 'Active') {
      await createEmail({
        config,
        to: user.email,
        subject: createEmailSubject(
          'Suppression de votre espace de travail sur Mon Suivi Social',
          config
        ),
        ...getDisabledStructureAlert(config)
      })
    }
  }

  return {
    name: structure.name,
    id: structure.id,
    disabled: true
  }
}

async function updateFileInstructions(structureId: string) {
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
      socialSupport: { structureId }
    },
    data: fileInstructionUpdate
  })
}

async function updateHelpRequests(structureId: string) {
  const helpRequestUpdate: Required<
    Omit<
      Prisma.HelpRequestUncheckedUpdateManyInput,
      'id' | 'subjectId' | 'financialSupport' | 'fileInstructionId'
    >
  > = {
    prescribingOrganizationId: null,
    prescribingOrganizationContactId: null,
    beneficiaryDeviceId: null,
    askedAmount: null,
    allocatedAmount: null,
    paymentMethod: null,
    paymentDate: null,
    handlingDate: null,
    isRefundable: false
  }
  await HelpRequestRepo.prisma.updateMany({
    where: {
      fileInstruction: { socialSupport: { structureId } }
    },
    data: helpRequestUpdate
  })
}

async function updateHousingHelpRequests(structureId: string) {
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
    lowIncomeHousingType: { set: [] },
    handlingDate: null
  }
  await HousingHelpRequestRepo.prisma.updateMany({
    where: {
      fileInstruction: {
        socialSupport: { structureId }
      }
    },
    data: housingHelpRequestUpdate
  })
}

async function updateFollowups(structureId: string) {
  const followupUpdate: Required<
    Omit<
      Prisma.FollowupUncheckedUpdateManyInput,
      'id' | 'updated' | 'socialSupportId' | 'medium'
    >
  > = {
    prescribingOrganizationId: null,
    prescribingOrganizationContactId: null,
    beneficiaryDeviceId: null,
    helpRequested: null,
    place: null,
    thirdPersonName: null,
    classified: null,
    firstFollowup: null,
    forwardedToJustice: null,
    duration: null
  }
  await FollowupRepo.prisma.updateMany({
    where: {
      socialSupport: { structureId }
    },
    data: followupUpdate
  })
}
