import { BeneficiaryRepo, StructureRepo } from '~/server/database'
import type { PlanAppointmentInput } from '~/server/schema'
import * as client from '~/server/lib/rdvsp-oauth.client'
import type { ProtectedAppContext } from '~/server/trpc'
import { invalidError, unauthorizedError } from '~/server/trpc'
import { getAgentAuthInfo, throwIfStructureIsNotSetup } from './helper'
import { routes } from '~/utils/routes'
import { BeneficiaryTab } from '~/utils/constants/beneficiary'

/** This function needs the rdvsp integration setup and active
 * otherwise throws a forbidden error.
 *
 * Throws an unauthorized error if user is not authenticated to
 * RDVSP api.
 */
export async function planAppointment({
  input,
  ctx
}: {
  input: PlanAppointmentInput
  ctx: ProtectedAppContext
}) {
  const {
    public: { appUrl }
  } = useRuntimeConfig()

  const [structure, ben] = await Promise.all([
    StructureRepo.findUniqueOrThrow(ctx.user, {
      where: { id: ctx.structure.id },
      select: { externalRdvspId: true, externalRdvspActive: true }
    }),
    BeneficiaryRepo.findUniqueOrThrow(ctx.user, {
      where: { id: input.beneficiaryId },
      select: {
        externalRdvspId: true,
        familyFileId: true,
        id: true,
        firstName: true,
        usualName: true,
        birthName: true,
        birthDate: true,
        email: true,
        phone1: true,
        street: true,
        zipcode: true,
        city: true,
        region: true
      }
    })
  ])

  throwIfStructureIsNotSetup(structure)

  const { accessToken } = await getAgentAuthInfo(ctx.user.id)

  const beneficiaryHistoryUrl = `${appUrl}${routes.file.AppFile.path(
    ben.familyFileId,
    {
      beneficiaryId: ben.id,
      tab: BeneficiaryTab.History,
      originPage: 'ExternalRdvsp'
    }
  )}`

  const rdvPlan = await createRdvspPlan(
    accessToken,
    ben,
    beneficiaryHistoryUrl,
    beneficiaryHistoryUrl
  )
  if (!ben.externalRdvspId) {
    await BeneficiaryRepo.update(ctx.user, {
      where: { id: ben.id },
      data: { externalRdvspId: rdvPlan.user_id.toString() }
    })
  }

  return rdvPlan.url
}

async function createRdvspPlan(
  accessToken: string,
  beneficiary: any,
  returnUrl: string,
  beneficiaryHistoryUrl: string
) {
  const cfg = client.getConfig()

  const rdvPlan = await client.createRdvPlan(
    cfg,
    accessToken,
    beneficiary,
    returnUrl,
    beneficiaryHistoryUrl
  )

  if ('status' in rdvPlan) {
    if (rdvPlan.status !== 401) {
      throw invalidError('could not create rdv plan')
    }
    throw unauthorizedError('not authenticated')
  }
  if ('success' in rdvPlan) {
    throw invalidError('could not create rdv plan')
  }

  return rdvPlan
}
