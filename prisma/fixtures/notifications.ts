import type { NotificationType } from '@prisma/client'
import {
  fixturesUsers,
  FixtureUserRole,
  fixturesBeneficiaries,
  FixtureBeneficiary
} from '../fixtures'

export enum FixtureNotification {
  ReferentNewComment = 0
}

export const fixturesNotifications = [
  {
    id: '3a39f0ae-17c0-4616-9e76-523faad59cfc',
    recipientId: fixturesUsers[FixtureUserRole.Referent].id,
    beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.UNKNOWN].id,
    socialSupportId: '19ed2ebb-4e28-433a-9e2d-d97d9098624a',
    type: 'NewComment' as NotificationType,
    itemCreatedById: fixturesUsers[FixtureUserRole.StructureManager].id
  }
] as const
