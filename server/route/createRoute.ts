import type { H3Event } from 'h3'
import type { ZodType, z } from 'zod/v4'
import { isAdmin } from '../security/rules/helpers'
import { forbiddenError } from '~/server/trpc'
import { addUserActivity } from '~/server/query'
import type { SecurityRule, SecurityRuleGrantee } from '~/server/security'
import type { SecurityRuleStructure } from '~/server/security/rules/types'
import { UserActivityType, type UserActivityObject } from '@prisma/client'
import { handleBeneficiariesLastActivityUpdate } from '~/server/query/beneficiaryLastActivity/updateBeneficiariesLastActivity'

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
  structure: SecurityRuleStructure
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
  securityCheck?: SecurityRule<Input>
  auditLog?: {
    key: string
    target: UserActivityObject
    /** Identifier of the entity on which the activity is performed.
     * For RUD operations, it will likely be an ID retrieved from
     * the input (eg. ({ctx}) => ctx.input.id).
     * For Create operations, it will likely be the primary key of
     * created entity (eg. ({routeResult}) => routeResult.id).
     * */
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
    input: z.infer<Validation>
  }) => {
    if (!ctx.structure) {
      throw forbiddenError('No structure found is the trpc context')
    }
    if (!handler) {
      throw forbiddenError('Use handler function to handler the request')
    }
    if (!securityCheck) {
      throw forbiddenError('security check is required!')
    }
    const canAccess = await securityCheck(ctx, input)
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

    if (options.auditLog) {
      const { user } = ctx
      const { key, target, targetId, action } = options.auditLog
      const objectId = targetId({ ctx, input, routeResult })
      await addUserActivity({
        key,
        user,
        activity: action,
        object: target,
        objectId,
        content: mutation ? input : null
      })
      if (
        action === UserActivityType.CREATE ||
        action === UserActivityType.UPDATE
      ) {
        // Do not wait for this action
        handleBeneficiariesLastActivityUpdate({
          target,
          input,
          objectId,
          key
        })
          .then(() => {
            console.debug(`update beneficiaries last activity: ${action}`)
          })
          .catch((e: unknown) => {
            /* TODO/ Management de l'erreur, envoi à sentry ? */
            console.error(e)
          })
      }
    }

    return routeResult
  }

  const executeAsAdmin = async ({
    ctx,
    input
  }: {
    ctx: AdminRouteHandlerContext<Grantee>
    input: z.infer<Validation>
  }) => {
    if (!adminHandler) {
      throw forbiddenError('Use adminHandler function to handle the request')
    }
    if (!isAdmin(ctx.user)) {
      throw forbiddenError(
        `${
          ctx.user.id
        } is not allowed to access route with params ${JSON.stringify(
          input || {}
        )}`
      )
    }

    const routeResult = await adminHandler({ ctx, input })

    if (options.auditLog) {
      const { user } = ctx
      const { key, target, targetId, action } = options.auditLog
      // There is a design flaw in createRoute. Since non-admin users
      // and admin ones don't have the same context (admins are not linked to a structure),
      // there should be two distincts "createRoute" functions, with different types.
      // However, this would be a huge refactor.
      // Make sure not to use ctx.structure in admin actions
      // @ts-expect-error: ctx.structure is undefined for admins
      const objectId = targetId({ ctx, input, routeResult })
      await addUserActivity({
        key,
        user,
        activity: action,
        object: target,
        objectId,
        content: mutation ? input : null
      })
    }

    return routeResult
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
