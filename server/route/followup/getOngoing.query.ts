import { SocialSupportStatus } from '@prisma/client'
import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { emptySchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { FollowupService } from '~/server/services'

const handler = ({ ctx }: { ctx: ProtectedAppContext }) => {
  return FollowupService.getOngoing({ ctx }) as Promise<
    Array<{
      status: Exclude<
        SocialSupportStatus,
        | 'WaitingAdditionalInformation'
        | 'InvestigationOngoing'
        | 'Accepted'
        | 'Refused'
        | 'Adjourned'
        | 'ClosedByBeneficiary'
        | 'ClosedByAgent'
        | 'Dismissed'
        | 'Done'
      >
      _count: number
    }>
  >
}

export const getOngoing = createQuery({
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck,
  handler
})
