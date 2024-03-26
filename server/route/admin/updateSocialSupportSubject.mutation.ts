import { createMutation } from '~/server/route'
import { AdminContext } from '~/server/trpc'
import {
  updateSocialSupportSubjectSchema,
  UpdateSocialSupportSubjectNameInput
} from '~/server/schema'
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
