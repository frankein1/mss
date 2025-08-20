import { createMutation } from '~/server/route'
import type { AdminContext } from '~/server/trpc'
import type { IdInput } from '~/server/schema'
import { idSchema } from '~/server/schema'
import { SocialSupportSubjectService } from '~/server/services'

const adminHandler = async ({
  input,
  ctx: _ctx
}: {
  input: IdInput
  ctx: AdminContext
}) => {
  return await SocialSupportSubjectService.makeInactive({ input })
}

export const makeInactiveSocialSupportSubject = createMutation({
  adminHandler,
  inputValidation: idSchema
})
