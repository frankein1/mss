import { Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  FileInstructionPageInput,
  getFileInstructionPageSchema
} from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { FileInstructionService } from '~/server/services'

const handler = ({
  input,
  ctx
}: {
  input: FileInstructionPageInput
  ctx: ProtectedAppContext
}) => {
  return FileInstructionService.getPage({ ctx, input })
}

export const getPage = createQuery({
  inputValidation: getFileInstructionPageSchema,
  securityCheck: AllowSecurityCheck,
  handler
})

type FileInstructionPage = Prisma.PromiseReturnType<typeof handler>

export type FileInstructions = FileInstructionPage['items']
export type FileInstruction = FileInstructions[0]
