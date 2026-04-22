import { UserActivityType } from '@prisma/client'
import { createQuery } from '~/server/route'
import type { ExportAttendanceInput } from '~/server/schema'
import { exportAttendanceSchema } from '~/server/schema'
import type { ProtectedAppContext } from '~/server/trpc'
import { createExportFromWorkbook } from '~/utils/export/createExport'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { WorkshopRepo } from '~/server/database'
import { calculateAge } from '~/utils'
import { UserService } from '~/server/services'
import { isReferent } from '~/server/security'
import { prismaDecimalToNumber } from '~/utils/prisma'
import ExcelPkg from 'exceljs'

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

  const { Workbook: WorkbookConstructor } = ExcelPkg
  const workbook = new WorkbookConstructor()
  buildWorksheet(workbook, workshop)

  // Forced to return base64 encoded version of the file in tRPC
  // Cf. https://github.com/trpc/trpc/discussions/658
  // & https://stackoverflow.com/questions/73715285/exceljs-download-xlsx-file-with-trpc-router
  const stream = await createExportFromWorkbook(ctx.user.id, workbook)
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

const buildWorksheet = (
  workbook: ExcelPkg.Workbook,
  workshop: WorkshopInfo
) => {
  const header = getWorksheetHeader(workshop)
  const worksheet = workbook.addWorksheet('Émargement', {
    headerFooter: {
      firstHeader: header,
      oddHeader: header,
      evenHeader: header
    },
    properties: { showGridLines: false },
    pageSetup: { orientation: 'landscape' },
    views: [{ state: 'normal', style: 'pageLayout' }],
    state: 'visible'
  })

  worksheet.columns = [
    { key: 'firstName', header: 'Prénom', width: 14 },
    { key: 'lastName', header: 'Nom', width: 14 },
    { key: 'age', header: 'Âge', width: 8, style: { numFmt: '0' } },
    { key: 'phone', header: 'Téléphone', width: 14 },
    { key: 'email', header: 'Email', width: 28 },
    {
      key: 'paymentAmount',
      header: 'Montant payé',
      width: 10,
      style: { numFmt: '#,##0.00 "€"' }
    },
    { key: 'signature', header: 'Signature', width: 20 }
  ]
  worksheet.getRow(1).font = { bold: true }

  const rows = workshop.workshopAttendees
    .map(attendee => {
      const paymentAmount =
        attendee.paymentReceived && attendee.paymentAmount
          ? prismaDecimalToNumber(attendee.paymentAmount)
          : null
      if (attendee.beneficiary) {
        return {
          firstName: attendee.beneficiary.firstName || '(non renseigné)',
          lastName: attendee.beneficiary.usualName || '(non renseigné)',
          age: attendee.beneficiary.birthDate
            ? calculateAge(attendee.beneficiary.birthDate)
            : null,
          phone: attendee.beneficiary.phone1 || '',
          email: attendee.beneficiary.email || '',
          paymentAmount,
          signature: ' '
        }
      }
      if (attendee.workshopExternalAttendee) {
        return {
          firstName: attendee.workshopExternalAttendee.firstName || '',
          lastName:
            attendee.workshopExternalAttendee.lastName?.toUpperCase() || '',
          age: attendee.workshopExternalAttendee.birthDate
            ? calculateAge(attendee.workshopExternalAttendee.birthDate)
            : null,
          phone: attendee.workshopExternalAttendee.phone || '',
          email: attendee.workshopExternalAttendee.email || '',
          paymentAmount,
          signature: ' '
        }
      }
    })
    .filter(row => row != null)
    .sort((a, b) =>
      a.lastName.toLowerCase().localeCompare(b.lastName.toLowerCase())
    )

  rows.forEach(row => worksheet.addRow(row))
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
