import { describe, expect } from 'vitest'
import { test } from '~/test/server/test-utils'

const socialSupportId = '19ed2ebb-4e28-433a-9e2d-d97d9098624a'
const commentId = '24d14db7-c0ac-4924-86ae-c786efba3afc'

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
