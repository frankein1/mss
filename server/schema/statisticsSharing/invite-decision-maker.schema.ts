import { z } from 'zod'
import {
  errorMessages,
  maxStringLengthMessage,
  minStringLengthMessage,
  validEmailMessage
} from '~/utils/zod'
import { cleanEmail } from '~/utils/user'
import { stringConstraint } from '../helpers.schema'

export const inviteDecisionMakerSchema = z.object({
  firstName: stringConstraint
    .max(20, maxStringLengthMessage(20))
    .min(2, minStringLengthMessage(2)),
  lastName: stringConstraint
    .max(30, maxStringLengthMessage(30))
    .min(2, minStringLengthMessage(2)),
  email: z
    .string(errorMessages)
    .email(validEmailMessage)
    .transform(email => cleanEmail(email))
})

export type InviteDecisionMakerInput = z.infer<typeof inviteDecisionMakerSchema>
