import type { SecurityRuleContext } from '~/server/security'
import { SocialSupportRepo, StructureRepo } from '~/server/database/repository'
import { validateDraftAppointment } from './validateDraftAppointment.service'

export async function getAppointments({ ctx }: { ctx: SecurityRuleContext }) {
  const {
    rdvsp: { issuer }
  } = useRuntimeConfig()

  try {
    await checkDrafts({ ctx })
  } catch (e) {
    console.log(e)
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
    url: `${issuer}/admin/organisations/${structure.externalRdvspId}/rdvs/${s.appointment?.externalRdvspId}`,
    status: s.status
  }))
}

/** Validate all drafts associated to structure */
async function checkDrafts({ ctx }: { ctx: SecurityRuleContext }) {
  const drafts = await SocialSupportRepo.findMany(ctx.user, {
    where: { appointment: { draft: true } },
    select: { id: true }
  })

  const promises = drafts.map(draft =>
    validateDraftAppointment({ ctx, input: { socialSupportId: draft.id } })
  )

  return await Promise.all(promises)
}
