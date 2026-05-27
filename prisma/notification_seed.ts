/* eslint-disable no-console */
/**
 * Notification seed script
 * Creates ~10 notifications of all types for Jeanne Responsable
 *
 * Run with: npx tsx prisma/notification_seed.ts
 */
import { NotificationType, PrismaClient } from '@prisma/client'
import {
  fixturesUsers,
  FixtureUserRole,
  fixturesBeneficiaries,
  FixtureBeneficiary,
  fixtureStructures,
  FixtureStructure
} from './fixtures'

const prismaClient = new PrismaClient()

const JEANNE_REFERENTE_ID = fixturesUsers[FixtureUserRole.Referent].id
const JEAN_AGENT_ID = fixturesUsers[FixtureUserRole.ReceptionAgent].id
const JEANNE_RESPONSABLE_ID = fixturesUsers[FixtureUserRole.StructureManager].id
const STRUCTURE_ID = fixtureStructures[FixtureStructure.Test].id

const BENEFICIARY_COURSOR_ID =
  fixturesBeneficiaries[FixtureBeneficiary.COURSOR].id
const BENEFICIARY_UNKNOWN_ID =
  fixturesBeneficiaries[FixtureBeneficiary.UNKNOWN].id
const BENEFICIARY_WONFAR_ID =
  fixturesBeneficiaries[FixtureBeneficiary.WONFAR].id
const BENEFICIARY_PISCOPO_ID =
  fixturesBeneficiaries[FixtureBeneficiary.PISCOPO].id

// Existing social support IDs from fixtures
const SOCIAL_SUPPORT_ID_1 = 'e20b26f8-52fd-4620-8959-4cbb4623fb05'
const SOCIAL_SUPPORT_ID_2 = '8f8a083f-f04f-4977-9e07-8b88135c7210'
const SOCIAL_SUPPORT_ID_3 = '07e809c3-4b6e-4152-bde3-357c501c981f'
const SOCIAL_SUPPORT_ID_4 = '19ed2ebb-4e28-433a-9e2d-d97d9098624a'

const today = new Date()
const oneMonthFromNow = new Date(today)
oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1)

const BENEFICIARY_IDS = [
  BENEFICIARY_COURSOR_ID,
  BENEFICIARY_UNKNOWN_ID,
  BENEFICIARY_WONFAR_ID,
  BENEFICIARY_PISCOPO_ID
]
const SOCIAL_SUPPORT_IDS = [
  SOCIAL_SUPPORT_ID_1,
  SOCIAL_SUPPORT_ID_2,
  SOCIAL_SUPPORT_ID_3,
  SOCIAL_SUPPORT_ID_4
]

// Generates 9 additional notifications for a given type (the first one is already explicit)
function extraNotifications(
  type: NotificationType,
  typeIndex: number,
  options: {
    withSocialSupport?: boolean
    withItemCreatedBy?: boolean
    archiveOffsetDays?: number
  } = {}
) {
  return Array.from({ length: 9 }, (_, i) => ({
    id: `b${String(typeIndex).padStart(7, '0')}-0000-0000-0000-${String(i + 1).padStart(12, '0')}`,
    type,
    recipientId: JEANNE_RESPONSABLE_ID,
    structureId: STRUCTURE_ID,
    beneficiaryId: BENEFICIARY_IDS[i % BENEFICIARY_IDS.length],
    ...(options.withSocialSupport && {
      socialSupportId: SOCIAL_SUPPORT_IDS[i % SOCIAL_SUPPORT_IDS.length]
    }),
    ...(options.withItemCreatedBy && { itemCreatedById: JEANNE_REFERENTE_ID }),
    ...(options.archiveOffsetDays !== undefined && {
      archiveDate: new Date(
        today.getTime() + options.archiveOffsetDays * 24 * 60 * 60 * 1000
      )
    }),
    read: i % 3 === 0,
    created: new Date(today.getTime() - (i + 1) * 3 * 60 * 60 * 1000)
  }))
}

const fixturesNotifications = [
  // 1. New document uploaded for a beneficiary
  {
    id: 'a1000001-0000-0000-0000-000000000001',
    type: NotificationType.NewDocument,
    recipientId: JEANNE_RESPONSABLE_ID,
    structureId: STRUCTURE_ID,
    beneficiaryId: BENEFICIARY_COURSOR_ID,
    socialSupportId: SOCIAL_SUPPORT_ID_1,
    itemCreatedById: JEAN_AGENT_ID,
    read: true,
    created: new Date(today.getTime() - 1000 * 60 * 10) // 10 minutes ago
  },

  // 2. Document expiring today
  {
    id: 'a1000001-0000-0000-0000-000000000002',
    type: NotificationType.DocumentExpirationToday,
    recipientId: JEANNE_RESPONSABLE_ID,
    structureId: STRUCTURE_ID,
    beneficiaryId: BENEFICIARY_UNKNOWN_ID,
    read: false,
    created: new Date(today.getTime() - 1000 * 60 * 60 * 2) // 2 hours ago
  },

  // 3. Document expiring in one month
  {
    id: 'a1000001-0000-0000-0000-000000000003',
    type: NotificationType.DocumentExpirationOneMonth,
    recipientId: JEANNE_RESPONSABLE_ID,
    structureId: STRUCTURE_ID,
    beneficiaryId: BENEFICIARY_WONFAR_ID,
    read: true,
    created: new Date(today.getTime() - 1000 * 60 * 60 * 5) // 5 hours ago
  },

  // 4. New comment on a social support
  {
    id: 'a1000001-0000-0000-0000-000000000004',
    type: NotificationType.NewComment,
    recipientId: JEANNE_RESPONSABLE_ID,
    structureId: STRUCTURE_ID,
    beneficiaryId: BENEFICIARY_UNKNOWN_ID,
    socialSupportId: SOCIAL_SUPPORT_ID_4,
    itemCreatedById: JEANNE_RESPONSABLE_ID,
    read: false,
    created: new Date(today.getTime() - 1000 * 60 * 60 * 24) // yesterday
  },

  // 5. Due date today (action to complete today)
  {
    id: 'a1000001-0000-0000-0000-000000000005',
    type: NotificationType.DueDateToday,
    recipientId: JEANNE_RESPONSABLE_ID,
    structureId: STRUCTURE_ID,
    beneficiaryId: BENEFICIARY_PISCOPO_ID,
    socialSupportId: SOCIAL_SUPPORT_ID_2,
    read: false,
    created: new Date(today.getTime() - 1000 * 60 * 60 * 1) // 1 hour ago
  },

  // 6. Due date in one month
  {
    id: 'a1000001-0000-0000-0000-000000000006',
    type: NotificationType.DueDateOneMonth,
    recipientId: JEANNE_RESPONSABLE_ID,
    structureId: STRUCTURE_ID,
    beneficiaryId: BENEFICIARY_COURSOR_ID,
    socialSupportId: SOCIAL_SUPPORT_ID_3,
    read: false,
    created: new Date(today.getTime() - 1000 * 60 * 60 * 48) // 2 days ago
  },

  // 7. End of social support today
  {
    id: 'a1000001-0000-0000-0000-000000000007',
    type: NotificationType.EndOfSupport,
    recipientId: JEANNE_RESPONSABLE_ID,
    structureId: STRUCTURE_ID,
    beneficiaryId: BENEFICIARY_UNKNOWN_ID,
    socialSupportId: SOCIAL_SUPPORT_ID_1,
    read: false,
    created: new Date(today.getTime() - 1000 * 60 * 30) // 30 minutes ago
  },

  // 8. End of support in one month
  {
    id: 'a1000001-0000-0000-0000-000000000008',
    type: NotificationType.EndOfSupportOneMonth,
    recipientId: JEANNE_RESPONSABLE_ID,
    structureId: STRUCTURE_ID,
    beneficiaryId: BENEFICIARY_WONFAR_ID,
    socialSupportId: SOCIAL_SUPPORT_ID_2,
    read: false,
    created: new Date(today.getTime() - 1000 * 60 * 60 * 3) // 3 hours ago
  },

  // 9. Archive due today
  {
    id: 'a1000001-0000-0000-0000-000000000009',
    type: NotificationType.ArchiveDueToday,
    recipientId: JEANNE_RESPONSABLE_ID,
    structureId: STRUCTURE_ID,
    beneficiaryId: BENEFICIARY_PISCOPO_ID,
    archiveDate: today,
    read: false,
    created: new Date(today.getTime() - 1000 * 60 * 60 * 6) // 6 hours ago
  },

  // 10. Archive due in 7 days
  {
    id: 'a1000001-0000-0000-0000-000000000010',
    type: NotificationType.ArchiveDueSevenDays,
    recipientId: JEANNE_RESPONSABLE_ID,
    structureId: STRUCTURE_ID,
    beneficiaryId: BENEFICIARY_COURSOR_ID,
    archiveDate: new Date(today.getTime() + 1000 * 60 * 60 * 24 * 7),
    read: false,
    created: new Date(today.getTime() - 1000 * 60 * 60 * 8) // 8 hours ago
  },

  // 11. Archive due in one month
  {
    id: 'a1000001-0000-0000-0000-000000000011',
    type: NotificationType.ArchiveDueOneMonth,
    recipientId: JEANNE_RESPONSABLE_ID,
    structureId: STRUCTURE_ID,
    beneficiaryId: BENEFICIARY_UNKNOWN_ID,
    archiveDate: oneMonthFromNow,
    read: false,
    created: new Date(today.getTime() - 1000 * 60 * 60 * 72) // 3 days ago
  },

  // 12. New file instruction element
  {
    id: 'a1000001-0000-0000-0000-000000000012',
    type: NotificationType.NewFileInstructionElement,
    recipientId: JEANNE_RESPONSABLE_ID,
    structureId: STRUCTURE_ID,
    beneficiaryId: BENEFICIARY_WONFAR_ID,
    socialSupportId: SOCIAL_SUPPORT_ID_3,
    itemCreatedById: JEAN_AGENT_ID,
    read: false,
    created: new Date(today.getTime() - 1000 * 60 * 20) // 20 minutes ago
  },

  // 9 additional per type
  ...extraNotifications(NotificationType.NewDocument, 1, {
    withSocialSupport: true,
    withItemCreatedBy: true
  }),
  ...extraNotifications(NotificationType.DocumentExpirationToday, 2),
  ...extraNotifications(NotificationType.DocumentExpirationOneMonth, 3),
  ...extraNotifications(NotificationType.NewComment, 4, {
    withSocialSupport: true,
    withItemCreatedBy: true
  }),
  ...extraNotifications(NotificationType.DueDateToday, 5, {
    withSocialSupport: true
  }),
  ...extraNotifications(NotificationType.DueDateOneMonth, 6, {
    withSocialSupport: true
  }),
  ...extraNotifications(NotificationType.EndOfSupport, 7, {
    withSocialSupport: true
  }),
  ...extraNotifications(NotificationType.EndOfSupportOneMonth, 8, {
    withSocialSupport: true
  }),
  ...extraNotifications(NotificationType.ArchiveDueToday, 9, {
    archiveOffsetDays: 0
  }),
  ...extraNotifications(NotificationType.ArchiveDueSevenDays, 10, {
    archiveOffsetDays: 7
  }),
  ...extraNotifications(NotificationType.ArchiveDueOneMonth, 11, {
    archiveOffsetDays: 30
  }),
  ...extraNotifications(NotificationType.NewFileInstructionElement, 12, {
    withSocialSupport: true,
    withItemCreatedBy: true
  })
]

async function seedNotifications() {
  console.log('🔔 Seeding notifications for Jeanne Responsable...')

  // Delete existing seed notifications to allow re-running the script
  await prismaClient.notification.deleteMany({
    where: {
      id: { in: fixturesNotifications.map(n => n.id) }
    }
  })

  await prismaClient.notification.createMany({
    data: fixturesNotifications,
    skipDuplicates: true
  })

  console.log(
    `✅ ${fixturesNotifications.length} notifications created for Jeanne Responsable (${JEANNE_RESPONSABLE_ID})`
  )
  console.log('   Types created:')
  const types = [...new Set(fixturesNotifications.map(n => n.type))]
  types.forEach(type => console.log(`   - ${type}`))
}

async function main() {
  await seedNotifications()
}

main()
  .then(async () => {
    await prismaClient.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prismaClient.$disconnect()
    process.exit(1)
  })
