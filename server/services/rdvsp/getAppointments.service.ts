import type { SecurityRuleContext } from '~/server/security'
import { SocialSupportRepo, StructureRepo } from '~/server/database/repository'
import { validateDraftAppointmentsForAgent } from './validateDraftAppointment.service'
import { getAppointmentRdvspUrl } from './helper'

export async function getAppointments({ ctx }: { ctx: SecurityRuleContext }) {
  const {
    rdvsp: { issuer }
  } = useRuntimeConfig()

  try {
    await validateDraftAppointmentsForAgent({ ctx })
  } catch (e: unknown) {
    console.log(
      'rdvsp: synchronization failed in get appointments, should fail silently',
      e
    )
  }

  const [structure, ss] = await Promise.all([
    StructureRepo.findUniqueOrThrow(ctx.user, {
      where: { id: ctx.user.structureId || '' },
      select: { externalRdvspId: true }
    }),
    SocialSupportRepo.findMany(ctx.user, {
      where: {
        socialSupportType: 'Appointment',
        date: { gte: new Date() },
        appointment: { draft: false, agentId: ctx.user.id }
      },
      select: {
        date: true,
        status: true,
        id: true,
        appointment: {
          select: {
            durationInMin: true,
            place: true,
            subject: true,
            externalRdvspId: true,
            agent: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        beneficiary: {
          select: {
            firstName: true,
            usualName: true
          }
        }
      },
      orderBy: { date: 'asc' }
    })
  ])

  return ss.map(s => ({
    id: s.id,
    beneficiaryName: `${s.beneficiary?.firstName} ${s.beneficiary?.usualName}`,
    place: s.appointment?.place,
    subject: s.appointment?.subject,
    date: s.date,
    agentName: `${s.appointment?.agent?.firstName} ${s.appointment?.agent?.lastName}`,
    url: getAppointmentRdvspUrl(
      issuer,
      structure.externalRdvspId || '',
      s.appointment?.externalRdvspId || ''
    ),
    status: s.status
  }))
}
