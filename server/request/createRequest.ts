import { H3Event } from 'h3'
import { ZodType, z } from 'zod'
import { StructureType } from '@prisma/client'
import { forbiddenError } from '../trpc/trpcErrors'
import {
  SecurityRule,
  SecurityRuleGrantee
} from '~/server/security/rules/types'

export type RequestHandlerContext<Grantee> = {
  user: Grantee
  structure: { id: string; type: StructureType }
  event: H3Event
}

export type RequestHandler<Grantee, Input, RequestResult> = ({
  ctx,
  input
}: {
  ctx: RequestHandlerContext<Grantee>
  input: Input
}) => Promise<RequestResult>

export type CreateRequestOptions<
  Validation extends ZodType,
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee,
  RequestResult = any,
  Input = z.infer<Validation>
> = {
  path: string
  inputValidation: Validation
  securityCheck: SecurityRule<Grantee, Input>
  handler: RequestHandler<Grantee, Input, RequestResult>
}

export type RequestServer<
  Validation extends ZodType,
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee,
  RequestResult = any,
  Input = z.infer<Validation>
> = Readonly<
  Omit<
    CreateRequestOptions<Validation, Grantee, RequestResult, Input>,
    'handler'
  >
> & {
  mutation: boolean
  execute: RequestHandler<Grantee, Input, RequestResult>
}

export const createRequest = <
  Validation extends ZodType,
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee,
  RequestResult = any
>(
  options: CreateRequestOptions<Validation, Grantee, RequestResult>,
  mutation: boolean
): RequestServer<Validation, Grantee, RequestResult> => {
  const execute = ({
    ctx,
    input
  }: {
    ctx: RequestHandlerContext<Grantee>
    input: Validation
  }) => {
    if (!options.securityCheck(ctx.user, input)) {
      throw forbiddenError(
        `${ctx.user.id} is not allowed to access ${
          options.path
        } with params ${JSON.stringify(input || {})}`
      )
    }

    return options.handler({ ctx, input })
  }
  return {
    ...options,
    mutation,
    execute
  }
}

export const createQuery = <
  Validation extends ZodType,
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee,
  RequestResult = any
>(
  options: CreateRequestOptions<Validation, Grantee, RequestResult>
) => {
  return createRequest(options, false)
}
export const createMutation = <
  Validation extends ZodType,
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee,
  RequestResult = any
>(
  options: CreateRequestOptions<Validation, Grantee, RequestResult>
) => {
  return createRequest(options, true)
}

export type Request = ReturnType<typeof createRequest>
