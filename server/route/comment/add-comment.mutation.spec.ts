import { describe, expect, afterEach } from 'vitest'
import { test } from '~/test/server/test-utils'
import { prismaClient } from '~/server/prisma'
import {
  fixturesBeneficiaries,
  FixtureBeneficiary,
  fixturesSocialSupports
} from '~/prisma/fixtures'

const commentIds: string[] = []

const track = <T extends { comment: { id: string } }>(result: T) => {
  commentIds.push(result.comment.id)
  return result
}

afterEach(async () => {
  if (commentIds.length) {
    await prismaClient.comment.deleteMany({
      where: { id: { in: commentIds } }
    })
    commentIds.length = 0
  }
})

const socialSupportId = fixturesSocialSupports[5]!.id
const beneficiaryId = fixturesBeneficiaries[FixtureBeneficiary.UNKNOWN].id

const input = {
  content: 'Test comment content',
  beneficiaryId,
  isFollowup: true,
  socialSupportId
}

const referentInput = {
  content: 'Test comment content',
  beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.COURSOR].id,
  isFollowup: true,
  socialSupportId: fixturesSocialSupports[2]!.id
}

describe('Comment - Add - Authorizations', () => {
  test('A StructureManager can add a comment', async ({ trpc }) => {
    const result = track(await trpc.structureManager.comment.add(input))
    expect(result.comment.id).toBeDefined()
  })

  test('A ReceptionAgent can add a comment', async ({ trpc }) => {
    const result = track(await trpc.receptionAgent.comment.add(input))
    expect(result.comment.id).toBeDefined()
  })

  test('A Referent assigned to the beneficiary can add a comment', async ({
    trpc
  }) => {
    const result = track(await trpc.referent.comment.add(referentInput))
    expect(result.comment.id).toBeDefined()
  })

  test('A cross-structure user cannot add a comment', async ({ trpc }) => {
    await expect(() =>
      trpc.structureManagerMinistere.comment.add(input)
    ).rejects.toThrow(/beneficiary[\s\S]*?no record/im)
  })
})
