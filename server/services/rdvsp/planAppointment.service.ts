import { BeneficiaryRepo, StructureRepo, UserRepo } from '~/server/database'
import { PlanAppointmentInput } from '~/server/schema'
import * as client from '~/server/lib/rdvsp-oauth.client'
import { SecurityRuleContext, SecurityRuleGrantee } from '~/server/security'
import { invalidError, forbiddenError, unauthorizedError } from '~/server/trpc'

async function createRdvspUsager(
  beneficiaryId: string,
  externalStructureId: string,
  agentId: string,
  accessToken: string,
  beneficiary: any
) {
  console.log('create usager with rdvsp api')
  const cfg = client.getConfig()

  const usager = await client.createUsager(
    cfg,
    accessToken,
    externalStructureId,
    agentId,
    beneficiary
  )

  console.log(usager)
  if ('errors' in usager || 'status' in usager || !usager.id) {
    if (usager.status === 401) {
      console.log('throw unauthorized')
      throw unauthorizedError('not authenticated')
    } else {
      throw invalidError('could not create usager')
    }
  }

  const externalRdvspId = usager.id.toString()

  await BeneficiaryRepo.prisma.update({
    where: { id: beneficiaryId },
    data: { externalRdvspId }
  })

  return externalRdvspId as string
}

async function getAgentAuthInfo(user: SecurityRuleGrantee) {
  const u = await UserRepo.findUniqueOrThrow(user, {
    where: { id: user.id },
    select: {
      externalRdvspId: true,
      externalAccounts: {
        where: {
          type: 'rdvsp',
          accessToken: { not: null }
        },
        select: {
          accessToken: true
        }
      }
    }
  })

  if (!u.externalRdvspId) {
    throw forbiddenError('rdvsp integration not active for agent')
  }

  const connectedRdvspAccounts = u.externalAccounts.filter(
    acc => acc.accessToken !== null
  )

  if (
    !connectedRdvspAccounts.length ||
    !connectedRdvspAccounts[0].accessToken
  ) {
    throw forbiddenError('rdvsp account not connected')
  }

  return {
    externalRdvspId: u.externalRdvspId,
    accessToken: connectedRdvspAccounts[0].accessToken
  }
}

/** This function needs a structure and user activated in rdvsp.
 *
 * When the beneficiary already has an external "usager" id
 * from rdvsp, the function simply redirects to the appointment
 * url for the beneficiary.
 *
 * If the beneficiary does not have a rdvsp usager created,
 * it is created through the rdvsp API and then the appointment
 * url is generated
 */
export async function planAppointment({
  input,
  ctx
}: {
  input: PlanAppointmentInput
  ctx: SecurityRuleContext
}) {
  const {
    rdvsp: { issuer }
  } = useRuntimeConfig()

  const [structure, ben] = await Promise.all([
    StructureRepo.findUniqueOrThrow(ctx.user, {
      where: { id: ctx.structure.id },
      select: { externalRdvspId: true }
    }),
    BeneficiaryRepo.findUniqueOrThrow(ctx.user, {
      where: { id: input.beneficiaryId },
      select: {
        externalRdvspId: true,
        firstName: true,
        usualName: true,
        birthName: true,
        birthDate: true,
        email: true,
        phone1: true
      }
    })
  ])

  if (!structure.externalRdvspId) {
    throw forbiddenError('rdvsp integration not active for structure')
  }

  let usagerId: string

  if (ben.externalRdvspId) {
    usagerId = ben.externalRdvspId
  } else {
    console.log('usager has not been created in rdvsp yet')
    const { accessToken, externalRdvspId } = await getAgentAuthInfo(ctx.user)

    console.log('rdvsp agent id', externalRdvspId)

    usagerId = await createRdvspUsager(
      input.beneficiaryId,
      structure.externalRdvspId,
      externalRdvspId,
      accessToken,
      ben
    )
  }

  console.log('usagerId', usagerId)

  const url = `${issuer}/admin/organisations/${structure.externalRdvspId}/creneaux_search?user_ids[]=${usagerId}`
  console.log('redirecturl', url)

  return url
}
