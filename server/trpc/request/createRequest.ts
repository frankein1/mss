import { H3Event } from 'h3'
import { ZodType, z } from 'zod'
import {
  SecurityRule,
  SecurityRuleGrantee
} from '~/server/security/rules/types'

export type RequestHandlerContext<
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee
> = {
  user: Grantee
  event: H3Event
}

export type RequestHandler<
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee,
  Input = unknown
> = ({
  ctx,
  input
}: {
  ctx: RequestHandlerContext<Grantee>
  input: Input
}) => any

export type CreateRequestOptions<
  Validation extends ZodType,
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee,
  Input = z.infer<Validation>
> = {
  path: string
  inputValidation: Validation
  securityCheck: SecurityRule<Grantee, Input>
  handler: RequestHandler<Grantee, Input>
}

export const createRequest = <
  Validation extends ZodType,
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee
>(
  options: CreateRequestOptions<Validation, Grantee>,
  mutation: boolean
) => {
  return {
    ...options,
    mutation
  }
}

export const createQuery = <
  Validation extends ZodType,
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee
>(
  options: CreateRequestOptions<Validation, Grantee>
) => {
  return createRequest(options, false)
}
export const createMutation = <
  Validation extends ZodType,
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee
>(
  options: CreateRequestOptions<Validation, Grantee>
) => {
  return createRequest(options, true)
}

export type Request = ReturnType<typeof createRequest>
