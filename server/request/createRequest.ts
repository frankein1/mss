import { H3Event } from 'h3'
import { ZodType, z } from 'zod'
import { StructureType } from '@prisma/client'
import { forbiddenError } from '../trpc/trpcErrors'
import {
  SecurityRule,
  SecurityRuleGrantee
} from '~/server/security/rules/types'

export type AdminRequestHandlerContext<Grantee> = {
  user: Grantee
  event: H3Event
}

export type AdminRequestHandler<Grantee, Input, RequestResult> = ({
  ctx,
  input
}: {
  ctx: AdminRequestHandlerContext<Grantee>
  input: Input
}) => Promise<RequestResult>

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
  inputValidation: Validation
  securityCheck: SecurityRule<Grantee, Input>
  handler?: RequestHandler<Grantee, Input, RequestResult>
  adminHandler?: AdminRequestHandler<Grantee, Input, RequestResult>
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
  executeAsAdmin: AdminRequestHandler<Grantee, Input, RequestResult>
}

export const createRequest = <
  Validation extends ZodType,
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee,
  RequestResult = any
>(
  options: CreateRequestOptions<Validation, Grantee, RequestResult>,
  mutation: boolean
): RequestServer<Validation, Grantee, RequestResult> => {
  if (!options.handler && !options.adminHandler) {
    throw new Error('either function handler or adminHandler must be defined')
  }
  const execute = async ({
    ctx,
    input
  }: {
    ctx: RequestHandlerContext<Grantee>
    input: Validation
  }) => {
    if (!ctx.structure) {
      throw forbiddenError('No structure found is the trpc context')
    }
    if (!options.handler) {
      throw forbiddenError('Use handler function to handler the request')
    }
    const canAccess = await options.securityCheck(ctx.user, input)
    if (!canAccess) {
      throw forbiddenError(
        `${
          ctx.user.id
        } is not allowed to access route with params ${JSON.stringify(
          input || {}
        )}`
      )
    }

    return options.handler({ ctx, input })
  }

  const executeAsAdmin = async ({
    ctx,
    input
  }: {
    ctx: AdminRequestHandlerContext<Grantee>
    input: Validation
  }) => {
    if (!options.adminHandler) {
      throw forbiddenError('Use adminHandler function to handle the request')
    }
    const canAccess = await options.securityCheck(ctx.user, input)
    if (!canAccess) {
      throw forbiddenError(
        `${
          ctx.user.id
        } is not allowed to access route with params ${JSON.stringify(
          input || {}
        )}`
      )
    }

    return options.adminHandler({ ctx, input })
  }

  return {
    ...options,
    mutation,
    execute,
    executeAsAdmin
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
