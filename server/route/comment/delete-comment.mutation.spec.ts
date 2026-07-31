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
      content: 'Comment to delete',
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

describe('Comment - Delete - Authorizations', () => {
  test('The creator can delete their own comment', async ({ trpc }) => {
    const commentId = commentIds[0]!
    const result = await trpc.structureManager.comment.delete({
      id: commentId
    })
    expect(result.id).toBe(commentId)
    commentIds.length = 0
  })

  test('Another user in the same structure cannot delete it', async ({
    trpc
  }) => {
    const commentId = commentIds[0]!
    await expect(() =>
      trpc.referent.comment.delete({ id: commentId })
    ).rejects.toThrow(/not allowed to access route/i)
  })
})
