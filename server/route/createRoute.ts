import { H3Event } from 'h3'
import { ZodType, z } from 'zod'
import {
  StructureType,
  UserActivityObject,
  UserActivityType
} from '@prisma/client'
import { forbiddenError } from '~/server/trpc'
import { addUserActivity } from '~/server/query'
import { SecurityRule, SecurityRuleGrantee } from '~/server/security'

export type AdminRouteHandlerContext<Grantee> = {
  user: Grantee
  event: H3Event
}

export type AdminRouteHandler<Grantee, Input, RouteResult> = ({
  ctx,
  input
}: {
  ctx: AdminRouteHandlerContext<Grantee>
  input: Input
}) => Promise<RouteResult>

export type RouteHandlerContext<Grantee> = {
  user: Grantee
  structure: { id: string; type: StructureType }
  event: H3Event
}

export type RouteHandler<Grantee, Input, RouteResult> = ({
  ctx,
  input
}: {
  ctx: RouteHandlerContext<Grantee>
  input: Input
}) => Promise<RouteResult>

export type TargetIdFinder<Grantee, Input, RouteResult> = ({
  ctx,
  input,
  routeResult
}: {
  ctx: RouteHandlerContext<Grantee>
  input: Input
  routeResult: RouteResult
}) => string

export type CreateRouteOptions<
  Validation extends ZodType,
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee,
  RouteResult = any,
  Input = z.infer<Validation>
> = {
  inputValidation: Validation
  securityCheck: SecurityRule<Grantee, Input>
  auditLog?: {
    target: UserActivityObject
    targetId: TargetIdFinder<Grantee, Input, RouteResult>
    action: UserActivityType
  }
  handler?: RouteHandler<Grantee, Input, RouteResult>
  adminHandler?: AdminRouteHandler<Grantee, Input, RouteResult>
}

export type RouteServer<
  Validation extends ZodType,
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee,
  RouteResult = any,
  Input = z.infer<Validation>
> = Readonly<
  Omit<
    CreateRouteOptions<Validation, Grantee, RouteResult, Input>,
    'handler' | 'adminHandler'
  >
> & {
  mutation: boolean
  execute: RouteHandler<Grantee, Input, RouteResult>
  executeAsAdmin: AdminRouteHandler<Grantee, Input, RouteResult>
}

export const createRoute = <
  Validation extends ZodType,
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee,
  RouteResult = any
>(
  options: CreateRouteOptions<Validation, Grantee, RouteResult>,
  mutation: boolean
): RouteServer<Validation, Grantee, RouteResult> => {
  if (!options.handler && !options.adminHandler) {
    throw new Error('either function handler or adminHandler must be defined')
  }

  const { handler, adminHandler, inputValidation, securityCheck } = options

  const execute = async ({
    ctx,
    input
  }: {
    ctx: RouteHandlerContext<Grantee>
    input: Validation
  }) => {
    if (!ctx.structure) {
      throw forbiddenError('No structure found is the trpc context')
    }
    if (!handler) {
      throw forbiddenError('Use handler function to handler the request')
    }
    const canAccess = await securityCheck(ctx.user, input)
    if (!canAccess) {
      throw forbiddenError(
        `${
          ctx.user.id
        } is not allowed to access route with params ${JSON.stringify(
          input || {}
        )}`
      )
    }

    const routeResult = await handler({ ctx, input })

    if (mutation && options.auditLog) {
      const { user } = ctx
      const { target, targetId, action } = options.auditLog
      await addUserActivity({
        userId: user.id,
        activity: action,
        object: target,
        objectId: targetId({ ctx, input, routeResult })
      })
    }

    return routeResult
  }

  const executeAsAdmin = async ({
    ctx,
    input
  }: {
    ctx: AdminRouteHandlerContext<Grantee>
    input: Validation
  }) => {
    if (!adminHandler) {
      throw forbiddenError('Use adminHandler function to handle the request')
    }
    const canAccess = await securityCheck(ctx.user, input)
    if (!canAccess) {
      throw forbiddenError(
        `${
          ctx.user.id
        } is not allowed to access route with params ${JSON.stringify(
          input || {}
        )}`
      )
    }

    return adminHandler({ ctx, input })
  }

  return {
    inputValidation,
    securityCheck,
    mutation,
    execute,
    executeAsAdmin
  }
}

export const createQuery = <
  Validation extends ZodType,
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee,
  RouteResult = any
>(
  options: CreateRouteOptions<Validation, Grantee, RouteResult>
) => {
  return createRoute(options, false)
}
export const createMutation = <
  Validation extends ZodType,
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee,
  RouteResult = any
>(
  options: CreateRouteOptions<Validation, Grantee, RouteResult>
) => {
  return createRoute(options, true)
}

export type Request = ReturnType<typeof createRoute>
