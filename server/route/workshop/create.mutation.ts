import { UserActivityType } from '@prisma/client'
import { createMutation } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import type { CreateWorkshopInput } from '~~/server/schema'
import { createWorkshopSchema } from '~~/server/schema'
import {
  WorkshopRepo,
  PartnerOrganizationRepo,
  SupportProgramNameRepo
} from '~~/server/database'
import {
  validateOneBelongsToStructure,
  type SecurityRuleContext
} from '~~/server/security'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: CreateWorkshopInput
) => {
  const { user } = ctx
  const { partnerOrganizationId: pid, supportProgramNameId: sid } = input
  const [pfound, sfound] = await Promise.all([
    !pid ||
      validateOneBelongsToStructure(
        user,
        pid,
        PartnerOrganizationRepo.findUniqueOrThrow
      ),
    !sid ||
      validateOneBelongsToStructure(
        user,
        sid,
        SupportProgramNameRepo.findUniqueOrThrow
      )
  ])

  return pfound && sfound
}

const handler = ({
  input: { partnerOrganizationId, supportProgramNameId, name, ...input },
  ctx
}: {
  input: CreateWorkshopInput
  ctx: ProtectedAppContext
}) =>
  WorkshopRepo.create(ctx.user, {
    select: { id: true },
    data: {
      ...input,
      partnerOrganization: partnerOrganizationId
        ? { connect: { id: partnerOrganizationId } }
        : undefined,
      supportProgramName: supportProgramNameId
        ? { connect: { id: supportProgramNameId } }
        : undefined,
      workshopName: {
        connectOrCreate: {
          where: {
            structureId_name: {
              name,
              structureId: ctx.structure.id
            }
          },
          create: {
            name,
            structureId: ctx.structure.id,
            createdById: ctx.user.id
          }
        }
      },
      createdBy: { connect: { id: ctx.user.id } },
      structure: { connect: { id: ctx.structure.id } }
    }
  })

export const createWorkshop = createMutation({
  inputValidation: createWorkshopSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'workshop.createWorkshop',
    target: 'Workshop',
    targetId: ({ routeResult }) => routeResult.id,
    action: UserActivityType.CREATE
  }
})
