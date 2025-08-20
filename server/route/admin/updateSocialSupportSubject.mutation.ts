import { createMutation } from '~/server/route'
import type { AdminContext } from '~/server/trpc'
import type { UpdateSocialSupportSubjectNameInput } from '~/server/schema'
import { updateSocialSupportSubjectSchema } from '~/server/schema'
import { SocialSupportSubjectService } from '~/server/services'

const adminHandler = async ({
  input,
  ctx: _ctx
}: {
  input: UpdateSocialSupportSubjectNameInput
  ctx: AdminContext
}) => {
  return await SocialSupportSubjectService.update({ input })
}

export const updateStructureSubject = createMutation({
  adminHandler,
  inputValidation: updateSocialSupportSubjectSchema
})
