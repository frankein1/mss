import { z } from 'zod'
import { stringConstraint, phoneConstraint } from '../helpers.schema'
import {
  errorMessages,
  minStringLengthMessage,
  maxStringLengthMessage,
  validZipcode,
  validEmailMessage
} from '~/utils/zod'

export const editStructureInfoSchema = z.object({
  name: stringConstraint
    .max(50, maxStringLengthMessage(50))
    .min(2, minStringLengthMessage(2)),
  zipcode: stringConstraint
    .max(10, maxStringLengthMessage(10))
    .min(5, validZipcode),
  city: stringConstraint
    .max(50, maxStringLengthMessage(50))
    .min(2, minStringLengthMessage(2)),
  address: stringConstraint
    .max(100, maxStringLengthMessage(100))
    .min(2, minStringLengthMessage(2)),
  phone: phoneConstraint,
  email: z.string(errorMessages).email(validEmailMessage),
  dpoFirstName: stringConstraint
    .max(50, maxStringLengthMessage(50))
    .min(2, minStringLengthMessage(2)),
  dpoLastName: stringConstraint
    .min(2, minStringLengthMessage(2))
    .max(50, maxStringLengthMessage(50))
    .toUpperCase(),
  dpoEmail: z.string(errorMessages).email(validEmailMessage)
})

export type EditStructureInfoInput = z.infer<typeof editStructureInfoSchema>

export const getSocialSupportSubjectSchema = z.object({
  name: stringConstraint
})

export type GetSocialSupportSubjectInput = z.infer<
  typeof getSocialSupportSubjectSchema
>
