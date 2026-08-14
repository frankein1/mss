import { FollowupMedium, SocialSupportStatus } from '@prisma/client'
import { afterEach, describe, expect } from 'vitest'
import { prismaClient } from '~~/server/prisma'
import { test } from '~~/test/server/test-utils'
import {
  FixtureBeneficiary,
  FixtureSocialSupport,
  fixturesBeneficiaries,
  fixturesSocialSupports,
  fixturesSocialSupportSubjects
} from '~~/prisma/fixtures'

const coursorId = fixturesBeneficiaries[FixtureBeneficiary.COURSOR].id

const subjectId = fixturesSocialSupportSubjects[0]!.id

const coursorSocialSupportId =
  fixturesSocialSupports[FixtureSocialSupport.FollowupCoursorVideoconference]!
    .id

const pensonSocialSupportId =
  fixturesSocialSupports[FixtureSocialSupport.FollowupPensonUnplannedInPerson]!
    .id

const getFollowupId = (socialSupportId: string) =>
  prismaClient.followup
    .findUniqueOrThrow({ where: { socialSupportId }, select: { id: true } })
    .then(f => f.id)

describe('Followup - GetOne - Authorizations', () => {
  test('A manager can view any followup in their structure', async ({
    trpc
  }) => {
    const followupId = await getFollowupId(coursorSocialSupportId)

    const result = await trpc.structureManager.followup.getOne({
      id: followupId
    })

    expect(result.followup.id).toBe(followupId)
  })

  test('A referent can view a followup of their assigned family file', async ({
    trpc
  }) => {
    const followupId = await getFollowupId(coursorSocialSupportId)

    const result = await trpc.referent.followup.getOne({ id: followupId })

    expect(result.followup.id).toBe(followupId)
  })

  test('A referent cannot view a followup of another family file', async ({
    trpc
  }) => {
    const followupId = await getFollowupId(pensonSocialSupportId)

    await expect(() =>
      trpc.referent.followup.getOne({ id: followupId })
    ).rejects.toThrow(/followup[\s\S]*?no record/im)
  })

  test('A user from another structure cannot view a followup', async ({
    trpc
  }) => {
    const followupId = await getFollowupId(coursorSocialSupportId)

    await expect(() =>
      trpc.structureManagerMinistere.followup.getOne({ id: followupId })
    ).rejects.toThrow(/followup[\s\S]*?no record/im)
  })

  test('An administrator cannot view a followup', async ({ trpc }) => {
    const followupId = await getFollowupId(coursorSocialSupportId)

    await expect(() =>
      trpc.administrator.followup.getOne({ id: followupId })
    ).rejects.toThrow(/user routes are not available to admins/i)
  })
})

describe('Followup - GetOne - Field filtering', () => {
  const createdSocialSupportIds: string[] = []

  afterEach(async () => {
    if (createdSocialSupportIds.length) {
      await prismaClient.socialSupport.deleteMany({
        where: { id: { in: createdSocialSupportIds } }
      })
      createdSocialSupportIds.length = 0
    }
  })

  const createFollowupWithPrivateSynthesis = async (
    caller: Awaited<
      ReturnType<typeof import('~~/test/server/test-utils').createCaller>
    >,
    familyFileId: string,
    beneficiaryId: string
  ) => {
    const socialSupport = await caller.followup.add({
      isMinistry: false as const,
      familyFileId,
      beneficiaryId,
      subjects: [subjectId],
      medium: FollowupMedium.PlannedInPerson,
      date: new Date('2026-03-01'),
      status: SocialSupportStatus.Done,
      privateSynthesisRichText: JSON.stringify({
        type: 'doc',
        content: [
          { type: 'paragraph', content: [{ type: 'text', text: 'Private' }] }
        ]
      }),
      synthesisRichText: JSON.stringify({
        type: 'doc',
        content: [
          { type: 'paragraph', content: [{ type: 'text', text: 'Public' }] }
        ]
      })
    })
    createdSocialSupportIds.push(socialSupport.id)
    const followup = await prismaClient.followup.findUniqueOrThrow({
      where: { socialSupportId: socialSupport.id },
      select: { id: true }
    })
    return followup.id
  }

  test('The creator sees privateSynthesis and details', async ({ trpc }) => {
    const followupId = await createFollowupWithPrivateSynthesis(
      trpc.structureManager,
      coursorId,
      coursorId
    )

    const result = await trpc.structureManager.followup.getOne({
      id: followupId
    })

    expect(result.followup.privateSynthesisRichText).not.toBeNull()
    expect(result.followup.synthesisRichText).not.toBeNull()
  })

  test('A non-creator referent sees details but not privateSynthesis', async ({
    trpc
  }) => {
    const followupId = await createFollowupWithPrivateSynthesis(
      trpc.structureManager,
      coursorId,
      coursorId
    )

    const result = await trpc.referent.followup.getOne({ id: followupId })

    expect(result.followup.privateSynthesisRichText).toBeNull()
    expect(result.followup.synthesisRichText).not.toBeNull()
  })

  test('A non-creator reception agent sees neither details nor privateSynthesis', async ({
    trpc
  }) => {
    const followupId = await createFollowupWithPrivateSynthesis(
      trpc.structureManager,
      coursorId,
      coursorId
    )

    const result = await trpc.receptionAgent.followup.getOne({
      id: followupId
    })

    expect(result.followup.privateSynthesisRichText).toBeNull()
    expect(result.followup.synthesisRichText).toBeNull()
  })
})
