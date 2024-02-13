import { Prisma, SocialSupportStatus } from '@prisma/client'
import { FileInstructionRepo } from '~/server/database'
import { EditFileInstructionStatusInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'

export async function updateStatus({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: EditFileInstructionStatusInput
}) {
  const fileInstruction = await FileInstructionRepo.findUniqueOrThrow(
    ctx.user,
    {
      where: {
        id: input.id
      },
      select: {
        id: true,
        decisionDate: true,
        refusalReason: true,
        helpRequest: {
          select: {
            id: true,
            handlingDate: true,
            allocatedAmount: true
          }
        }
      }
    }
  )

  const status = input.status

  const notAccepted = status !== SocialSupportStatus.Accepted
  const notRefused = status !== SocialSupportStatus.Refused

  const decisionDate =
    notAccepted && notRefused ? null : fileInstruction.decisionDate
  const refusalReason = notRefused ? null : fileInstruction.refusalReason

  const handlingDate = notAccepted
    ? null
    : fileInstruction.helpRequest?.handlingDate
  const allocatedAmount = notAccepted
    ? null
    : fileInstruction.helpRequest?.allocatedAmount

  const data: Prisma.FileInstructionUpdateInput = {
    decisionDate,
    refusalReason,
    socialSupport: {
      update: {
        status: input.status
      }
    }
  }

  if (fileInstruction.helpRequest) {
    data.helpRequest = {
      update: {
        handlingDate,
        allocatedAmount
      }
    }
  }

  return await FileInstructionRepo.prisma.update({
    where: { id: input.id },
    data,
    select: {
      socialSupport: {
        select: {
          status: true
        }
      }
    }
  })
}
