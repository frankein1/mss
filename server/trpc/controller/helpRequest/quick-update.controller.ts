import { UserActivityType } from '@prisma/client'
<<<<<<< Updated upstream:server/trpc/controller/helpRequest/quick-update.controller.ts
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import type { QuickEditHelpRequestInput } from '~/server/schema'
import { prismaClient } from '~/server/prisma'
import { canEditHelpRequest } from '~/server/security/rules'
import { prepareGetHelpRequestsPageSelect } from '~/utils/helpRequest'
=======
import { prepareGetHelpRequestsPageSelect } from './helper'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  QuickEditHelpRequestInput,
  quickEditHelpRequestSchema
} from '~/server/schema'
import { prismaClient } from '~/server/prisma'
import {
  SecurityRuleGrantee,
  canEditHelpRequest
} from '~/server/security/rules'
>>>>>>> Stashed changes:server/route/helpRequest/quick-update.mutation.ts
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'

export const quickUpdateHelpRequestHandler = async ({
  input: { id, ...rest },
  ctx: { user }
}: {
  input: QuickEditHelpRequestInput
  ctx: ProtectedAppContext
}) => {
  const target = await prismaClient.helpRequest.findUnique({
    where: { id },
    include: {
      beneficiary: {
        include: {
          referents: true
        }
      }
    }
  })

  if (!target || !canEditHelpRequest(user, target)) {
    throw forbiddenError()
  }

  const select = prepareGetHelpRequestsPageSelect(user)

  const helpRequest = await prismaClient.helpRequest.update({
    where: { id },
    data: rest,
    select
  })

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.UPDATE,
    object: 'HelpRequest',
    objectId: helpRequest.id
  })

  return helpRequest
}
