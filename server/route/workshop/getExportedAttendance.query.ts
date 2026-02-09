import { UserActivityType } from '~/prisma/generated/client'
import { createQuery } from '~/server/route'
import type { ExportAttendanceInput } from '~/server/schema'
import { exportAttendanceSchema } from '~/server/schema'
import type { ProtectedAppContext } from '~/server/trpc'
import { createExport } from '~/utils/export/createExport'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import type { RowType } from '~/types/export'
import { WorkshopRepo } from '~/server/database'
import { calculateAge } from '~/utils'
import { UserService } from '~/server/services'
import { isReferent } from '~/server/security'

const handler = async ({
  input,
  ctx
}: {
  input: ExportAttendanceInput
  ctx: ProtectedAppContext
}) => {
  await UserService.verifyAuthorizationCode({
    ctx,
    input: { code: input.code }
  })

  const workshop = await getWorkshopInfo(ctx, input)
  const attendees = workshop.workshopAttendees
  const { sortedRows: rows, columns } = createFile(attendees)
  const header = getWorksheetHeader(workshop)

  // Forced to return base64 encoded version of the file in tRPC
  // Cf. https://github.com/trpc/trpc/discussions/658
  // & https://stackoverflow.com/questions/73715285/exceljs-download-xlsx-file-with-trpc-router
  const stream = await createExport(ctx.user.id, [
    {
      name: 'Émargement',
      columns,
      rows,
      options: {
        headerFooter: {
          firstHeader: header,
          oddHeader: header,
          evenHeader: header
        },
        properties: {
          showGridLines: false
        },
        pageSetup: {
          orientation: 'landscape'
        },
        views: [
          {
            state: 'normal',
            style: 'pageLayout'
          }
        ],
        state: 'visible'
      }
    }
  ])
  return { data: stream.toString('base64') }
}

export const getExportedAttendance = createQuery({
  inputValidation: exportAttendanceSchema,
  securityCheck: AllowSecurityCheck,
  handler,
  auditLog: {
    key: 'workshop.exportattendance',
    target: 'Workshop',
    targetId: ({ ctx }) => ctx.structure.id,
    action: UserActivityType.EXPORT
  }
})

const getWorksheetHeader = (workshop: WorkshopInfo) => {
  let header = workshop.workshopName.name
  if (workshop.sessionName) {
    header += ` - ${workshop.sessionName}`
  }
  if (workshop.date) {
    header += ` - ${workshop.date.toLocaleDateString('fr-FR')}`
  }
  if (workshop.host) {
    header += ` - ${workshop.host}`
  }

  return header
}

const createFile = (attendees: Attendees) => {
  const rows: RowType[] = attendees
    .map(attendee => {
      const sharedInfo = {
        paymentAmount:
          attendee.paymentReceived && attendee.paymentAmount
            ? attendee.paymentAmount.toString()
            : '',
        signature: ' '
      }
      if (attendee.beneficiary) {
        return {
          firstName: attendee.beneficiary.firstName || '(non renseigné)',
          lastName: attendee.beneficiary.usualName || '(non renseigné)',
          age: attendee.beneficiary.birthDate
            ? calculateAge(attendee.beneficiary.birthDate).toString()
            : '',
          phone: attendee.beneficiary.phone1 || '',
          email: attendee.beneficiary.email || '',
          ...sharedInfo
        }
      }
      if (attendee.workshopExternalAttendee) {
        return {
          firstName: attendee.workshopExternalAttendee.firstName || '',
          lastName:
            attendee.workshopExternalAttendee.lastName?.toUpperCase() || '',
          age: attendee.workshopExternalAttendee.birthDate
            ? calculateAge(
                attendee.workshopExternalAttendee.birthDate
              ).toString()
            : '',
          phone: attendee.workshopExternalAttendee.phone || '',
          email: attendee.workshopExternalAttendee.email || '',
          ...sharedInfo
        }
      }
    })
    .filter(row => row != null)

  const columns = [
    {
      key: 'firstName',
      header: 'Prénom'
    },
    {
      key: 'lastName',
      header: 'Nom'
    },
    {
      key: 'age',
      header: 'Age'
    },
    {
      key: 'phone',
      header: 'Téléphone'
    },
    {
      key: 'email',
      header: 'Email'
    },
    {
      key: 'paymentAmount',
      header: 'Montant payé'
    },
    {
      key: 'signature',
      header: 'Signature'
    }
  ]

  const sortedRows = rows.sort((a, b) =>
    (a.lastName as string)
      .toLowerCase()
      .localeCompare((b.lastName as string).toLowerCase())
  )

  return { sortedRows, columns }
}

const getWorkshopInfo = async (
  ctx: ProtectedAppContext,
  input: ExportAttendanceInput
) => {
  const workshop = await WorkshopRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.workshopId },
    select: {
      id: true,
      workshopName: {
        select: {
          name: true
        }
      },
      sessionName: true,
      date: true,
      host: true,
      workshopAttendees: {
        select: {
          id: true,
          paymentReceived: true,
          paymentAmount: true,
          beneficiary: {
            select: {
              firstName: true,
              usualName: true,
              birthDate: true,
              phone1: true,
              email: true
            },
            ...(isReferent(ctx.user) && {
              where: {
                familyFile: { referents: { some: { id: ctx.user.id } } }
              }
            })
          },
          workshopExternalAttendee: {
            select: {
              firstName: true,
              lastName: true,
              birthDate: true,
              phone: true,
              email: true
            }
          }
        }
      }
    }
  })
  return workshop
}

type WorkshopInfo = Awaited<ReturnType<typeof getWorkshopInfo>>
type Attendees = WorkshopInfo['workshopAttendees']
