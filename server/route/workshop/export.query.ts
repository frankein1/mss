import {
  type Prisma,
  AgeLimitCondition,
  UserActivityType
} from '@prisma/client'
import { createQuery } from '~~/server/route'
import type { ExportWorkshopsInput } from '~~/server/schema'
import { exportWorkshopsSchema } from '~~/server/schema'
import type { ProtectedAppContext } from '~~/server/trpc'
import { createExport } from '~/utils/export/createExport'
import { AllowSecurityCheck } from '~~/server/security/rules/types'
import type { RowType } from '~~/types/export'
import { UserService } from '~~/server/services'
import { FilterWorkshopTimeDirection } from '~/utils/constants/filters'
import { workshopLabels } from '~~/client/labels'
import { TRPCError } from '@trpc/server'
import { formatDate } from '~/utils/formatDate'
import { WorkshopRepo } from '~~/server/database'
import {
  addCountToWorkshop,
  prepareWorkshopFilters
} from '~~/server/services/workshop/helper'

const handler = async ({
  input: { code, filter },
  ctx
}: {
  input: ExportWorkshopsInput
  ctx: ProtectedAppContext
}) => {
  await UserService.verifyAuthorizationCode({
    ctx,
    input: { code: code }
  })

  if (filter.timeDirection !== FilterWorkshopTimeDirection.Past) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Export workshop list is only available for past workshops'
    })
  }

  const workshops = await getWorkshops(ctx, filter)

  const { rows, columns } = createFile(workshops)

  // Forced to return base64 encoded version of the file in tRPC
  // Cf. https://github.com/trpc/trpc/discussions/658
  // & https://stackoverflow.com/questions/73715285/exceljs-download-xlsx-file-with-trpc-router
  const stream = await createExport(ctx.user.id, [
    { name: 'Émargement', columns, rows }
  ])
  return { data: stream.toString('base64') }
}

const getWorkshops = async (
  ctx: ProtectedAppContext,
  filter: ExportWorkshopsInput['filter']
) => {
  const where: Prisma.WorkshopWhereInput = prepareWorkshopFilters(
    filter,
    ctx.structure.id
  )

  const res = await WorkshopRepo.findMany(ctx.user, {
    select: {
      id: true,
      date: true,
      location: true,
      sessionName: true,
      startTime: true,
      attendeeLimit: true,
      endTime: true,
      description: true,
      ageLimitCondition: true,
      ageLimit: true,
      host: true,
      workshopName: {
        select: {
          name: true
        }
      },
      workshopAttendees: {
        select: {
          attendance: true,
          listType: true
        }
      },
      partnerOrganization: {
        select: {
          id: true,
          name: true
        }
      },
      supportProgramName: {
        select: {
          name: true
        }
      },
      _count: {
        select: {
          workshopAttendees: true
        }
      }
    },
    where,
    orderBy: { date: 'desc' }
  })

  return res.map(addCountToWorkshop)
}

const createFile = (workshops: Awaited<ReturnType<typeof getWorkshops>>) => {
  const rows = workshops
    .map(workshop => {
      return {
        name: workshop.workshopName.name || '',
        date: formatDate(workshop.date) || '',
        startTime: workshop.startTime || '',
        endTime: workshop.endTime || '',
        location: workshop.location || '',
        partnerOrganization: workshop.partnerOrganization?.name || '',
        supportProgramName: workshop.supportProgramName?.name || '',
        host: workshop.host || '',
        sessionName: workshop.sessionName || '',
        description: workshop.description || '',
        attendeeLimit: workshop.attendeeLimit?.toString() || '',
        attendees: workshop._count.mainAttendees.toString(),
        ageLimitCondition: workshop.ageLimitCondition
          ? formatAgeLimitCondition(workshop)
          : ''
      }
    })
    .filter(row => Object.values(row).some(v => !!v)) satisfies RowType[]

  const columns = [
    {
      key: 'name',
      header: workshopLabels.name
    },
    {
      key: 'date',
      header: workshopLabels.date
    },
    {
      key: 'startTime',
      header: workshopLabels.startTime
    },
    {
      key: 'endTime',
      header: workshopLabels.endTime
    },
    {
      key: 'location',
      header: workshopLabels.location
    },
    {
      key: 'partnerOrganization',
      header: workshopLabels.partnerOrganizationId
    },
    {
      key: 'supportProgramName',
      header: workshopLabels.supportProgramNameId
    },
    {
      key: 'host',
      header: workshopLabels.host
    },
    {
      key: 'sessionName',
      header: workshopLabels.sessionName
    },
    {
      key: 'description',
      header: workshopLabels.description
    },
    {
      key: 'attendeeLimit',
      header: 'Limite de personnes participantes'
    },
    {
      key: 'attendees',
      header: 'Nombre de personnes participantes'
    },
    {
      key: 'ageLimitCondition',
      header: workshopLabels.ageLimitCondition
    }
  ]

  return { rows, columns }
}

const formatAgeLimitCondition = (workshop: {
  ageLimitCondition: AgeLimitCondition | null
  ageLimit: number | null
}) => {
  if (workshop.ageLimitCondition == null) {
    return ''
  }
  if (workshop.ageLimitCondition === AgeLimitCondition.GreaterThan) {
    return 'Plus de ' + workshop.ageLimit + ' ans'
  }
  return 'Moins de ' + workshop.ageLimit + ' ans'
}

export const exportWorkshops = createQuery({
  inputValidation: exportWorkshopsSchema,
  securityCheck: AllowSecurityCheck,
  handler,
  auditLog: {
    key: 'workshop.exportall',
    target: 'Workshop',
    targetId: ({ ctx }) => ctx.structure.id,
    action: UserActivityType.EXPORT
  }
})
