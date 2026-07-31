import { describe, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import {
  fixturesSocialSupports,
  FixtureSocialSupport,
  fixtureCommentId
} from '~/prisma/fixtures'

const socialSupportId =
  fixturesSocialSupports[FixtureSocialSupport.FollowupUnknownWithComment]!.id
const commentId = fixtureCommentId

describe('Social Support - Get Details - Comment permissions', () => {
  test('The comment creator sees edit and delete permissions', async ({
    trpc
  }) => {
    const result = await trpc.structureManager.socialSupport.getDetails({
      id: socialSupportId
    })

    const commentItem = result.data.comments.find(
      (c: { comment: { id: string } }) => c.comment.id === commentId
    )
    expect(commentItem).toBeDefined()
    expect(commentItem!.permissions.edit).toBe(true)
    expect(commentItem!.permissions.delete).toBe(true)
  })

  test('A non-creator sees no edit or delete permissions', async ({ trpc }) => {
    const result = await trpc.instructor.socialSupport.getDetails({
      id: socialSupportId
    })

    const commentItem = result.data.comments.find(
      (c: { comment: { id: string } }) => c.comment.id === commentId
    )
    expect(commentItem).toBeDefined()
    expect(commentItem!.permissions.edit).toBe(false)
    expect(commentItem!.permissions.delete).toBe(false)
  })
})
