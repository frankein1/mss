import { UserActivityType } from '@prisma/client'
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

  const attendees = await getAttendees(ctx, input)
  const { rows, columns } = createFile(attendees)

  // Forced to return base64 encoded version of the file in tRPC
  // Cf. https://github.com/trpc/trpc/discussions/658
  // & https://stackoverflow.com/questions/73715285/exceljs-download-xlsx-file-with-trpc-router
  const stream = await createExport(ctx.user.id, [
    { name: 'Émargement', columns, rows }
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

const createFile = (attendees: Attendees) => {
  const rows: RowType[] = attendees
    .map(attendee => {
      if (attendee.beneficiary) {
        return {
          firstName: attendee.beneficiary.firstName || '(non renseigné)',
          lastName: attendee.beneficiary.usualName || '(non renseigné)',
          age: attendee.beneficiary.birthDate
            ? calculateAge(attendee.beneficiary.birthDate).toString()
            : '',
          phone: attendee.beneficiary.phone1 || '',
          email: attendee.beneficiary.email || '',
          signature: ' '
        }
      }
      if (attendee.workshopExternalAttendee) {
        return {
          firstName: attendee.workshopExternalAttendee.firstName || '',
          lastName: attendee.workshopExternalAttendee.lastName || '',
          age: attendee.workshopExternalAttendee.birthDate
            ? calculateAge(
                attendee.workshopExternalAttendee.birthDate
              ).toString()
            : '',
          phone: attendee.workshopExternalAttendee.phone || '',
          email: attendee.workshopExternalAttendee.email || '',
          signature: ' '
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
      key: 'signature',
      header: 'Signature'
    }
  ]

  return { rows, columns }
}

const getAttendees = async (
  ctx: ProtectedAppContext,
  input: ExportAttendanceInput
) => {
  const workshop = await WorkshopRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.workshopId },
    select: {
      id: true,
      workshopAttendees: {
        select: {
          id: true,
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
  return workshop.workshopAttendees
}

type Attendees = Awaited<ReturnType<typeof getAttendees>>
