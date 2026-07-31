import { describe, expect, afterEach, beforeEach } from 'vitest'
import { test } from '~/test/server/test-utils'
import { prismaClient } from '~/server/prisma'
import {
  fixturesUsers,
  FixtureUserRole,
  fixturesSocialSupports
} from '~/prisma/fixtures'

const commentIds: string[] = []

beforeEach(async () => {
  const comment = await prismaClient.comment.create({
    data: {
      content: 'Original comment',
      socialSupportId: fixturesSocialSupports[5]!.id,
      createdById: fixturesUsers[FixtureUserRole.StructureManager].id
    }
  })
  commentIds.push(comment.id)
})

afterEach(async () => {
  if (commentIds.length) {
    await prismaClient.comment.deleteMany({
      where: { id: { in: commentIds } }
    })
    commentIds.length = 0
  }
})

describe('Comment - Edit - Authorizations', () => {
  test('The creator can edit their own comment', async ({ trpc }) => {
    const commentId = commentIds[0]!
    const result = await trpc.structureManager.comment.edit({
      commentId,
      content: 'Updated comment'
    })
    expect(result.content).toBe('Updated comment')
  })

  test('Another user in the same structure cannot edit it', async ({
    trpc
  }) => {
    const commentId = commentIds[0]!
    await expect(() =>
      trpc.referent.comment.edit({
        commentId,
        content: 'Should fail'
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })
})
