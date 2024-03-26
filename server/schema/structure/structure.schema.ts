import { StructureType } from '@prisma/client'
import { z } from 'zod'
import {
  requiredNativeEnum,
  stringConstraint,
  phoneConstraint
} from '../helpers.schema'
import {
  errorMessages,
  minStringLengthMessage,
  maxStringLengthMessage,
  validZipcode,
  validEmailMessage
} from '~/utils/zod'

export const createStructureSchema = z.object({
  type: requiredNativeEnum(StructureType),
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
  email: z.string(errorMessages).email(validEmailMessage)
})

export const editCurrentUserStructureInfoSchema = createStructureSchema.omit({
  type: true
})

export type EditCurrentUserStructureInfoInput = z.infer<
  typeof editCurrentUserStructureInfoSchema
>

export const getSocialSupportSubjectSchema = z.object({
  name: stringConstraint
})

export type GetSocialSupportSubjectInput = z.infer<
  typeof getSocialSupportSubjectSchema
>
