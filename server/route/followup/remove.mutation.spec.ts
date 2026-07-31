import { FollowupMedium, SocialSupportStatus } from '@prisma/client'
import { afterEach, describe, expect } from 'vitest'
import { prismaClient } from '~/server/prisma'
import { test } from '~/test/server/test-utils'
import {
  FixtureBeneficiary,
  fixturesBeneficiaries,
  fixturesSocialSupportSubjects
} from '~/prisma/fixtures'

const coursorId = fixturesBeneficiaries[FixtureBeneficiary.COURSOR].id
const subjectId = fixturesSocialSupportSubjects[0]!.id

const createFollowupInput = (familyFileId: string, beneficiaryId: string) => ({
  isMinistry: false as const,
  familyFileId,
  beneficiaryId,
  subjects: [subjectId],
  medium: FollowupMedium.PlannedInPerson,
  date: new Date('2026-03-01'),
  status: SocialSupportStatus.Done
})

const createdSocialSupportIds: string[] = []

const track = <T extends { id: string }>(result: T) => {
  createdSocialSupportIds.push(result.id)
  return result
}

const getFollowupId = (socialSupportId: string) =>
  prismaClient.followup
    .findUniqueOrThrow({ where: { socialSupportId }, select: { id: true } })
    .then(f => f.id)

afterEach(async () => {
  if (createdSocialSupportIds.length) {
    await prismaClient.socialSupport.deleteMany({
      where: { id: { in: createdSocialSupportIds } }
    })
    createdSocialSupportIds.length = 0
  }
})

describe('Followup - Remove - Authorizations', () => {
  test('A manager can delete any followup in their structure', async ({
    trpc
  }) => {
    const socialSupport = track(
      await trpc.referent.followup.add(
        createFollowupInput(coursorId, coursorId)
      )
    )
    const followupId = await getFollowupId(socialSupport.id)

    await trpc.structureManager.followup.delete({ id: followupId })

    const deleted = await prismaClient.followup.findUnique({
      where: { id: followupId }
    })
    expect(deleted).toBeNull()
  })

  test('The creator can delete their own followup', async ({ trpc }) => {
    const socialSupport = track(
      await trpc.referent.followup.add(
        createFollowupInput(coursorId, coursorId)
      )
    )
    const followupId = await getFollowupId(socialSupport.id)

    await trpc.referent.followup.delete({ id: followupId })

    const deleted = await prismaClient.followup.findUnique({
      where: { id: followupId }
    })
    expect(deleted).toBeNull()
  })

  test('A non-creator referent cannot delete a followup', async ({ trpc }) => {
    const socialSupport = track(
      await trpc.structureManager.followup.add(
        createFollowupInput(coursorId, coursorId)
      )
    )
    const followupId = await getFollowupId(socialSupport.id)

    await expect(() =>
      trpc.referent.followup.delete({ id: followupId })
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('A user from another structure cannot delete a followup', async ({
    trpc
  }) => {
    const socialSupport = track(
      await trpc.structureManager.followup.add(
        createFollowupInput(coursorId, coursorId)
      )
    )
    const followupId = await getFollowupId(socialSupport.id)

    await expect(() =>
      trpc.structureManagerMinistere.followup.delete({ id: followupId })
    ).rejects.toThrow(/followup[\s\S]*?no record/im)
  })

  test('An administrator cannot delete a followup', async ({ trpc }) => {
    const socialSupport = track(
      await trpc.structureManager.followup.add(
        createFollowupInput(coursorId, coursorId)
      )
    )
    const followupId = await getFollowupId(socialSupport.id)

    await expect(() =>
      trpc.administrator.followup.delete({ id: followupId })
    ).rejects.toThrow(/user routes are not available to admins/i)
  })
})
