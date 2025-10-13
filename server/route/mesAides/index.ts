import {
  FamilyFileRepo,
} from '~/server/database'
import { createQuery, createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import { emptySchema } from '~/server/schema'
import { getAppContextPermissions } from '~/server/security'
import { FamilyFileService } from '~/server/services'
import { AllowSecurityCheck } from '~/server/security/rules/types'

import { z } from 'zod'

export const startSimulationSchema = z.object({
  familyFileId: z.string().uuid()
})

export type StartSimulationInput = z.infer<typeof startSimulationSchema>

const securityCheck = AllowSecurityCheck

async function fetchBenefits():Promise<
  { slug: string }
> {
/*  const response = await fetch("http://localhost:8080/api/benefits")
  const payload = await response.json()

  return { slug: payload[0].slug }*/

  return { slug: "cook"}
}

const handler = ({ ctx }: { ctx: ProtectedAppContext }) =>
  fetchBenefits()

const getBenefits = createQuery({
  inputValidation: emptySchema,
  handler,
  securityCheck
})


async function prefillSimulation(ctx: ProtectedAppContext, v: StartSimulationInput):Promise<
  { url: string }
> {


  const familyFile = await FamilyFileRepo.findUniqueOrThrow(ctx.user, {
    where: { id: v.familyFileId },
    include: {
      beneficiaries: {
        select: {
          id: true,
          firstName: true,
          usualName: true,
          birthName: true,
          birthDate: true,
          relationship: true
        },
        orderBy: { created: 'asc' }
      },
      referents: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          status: true
        }
      }
    }
  })

  // console.log(JSON.stringify(familyFile, null, 2))

  const dob = familyFile.beneficiaries[0].birthDate

  const domain = "http://localhost:8080"
  const answers = [
    {
      "id": "demandeur",
      "entityName": "individu",
      "fieldName": "pivot-data",
      "value": "local-mss-id"
    },
    {
      "id": "demandeur",
      "entityName": "individu",
      "fieldName": "date_naissance",
      "value": dob,
    },
  ]

  if (familyFile.beneficiaries.length > 1) {
    answers.push(
    {
      "id": "conjoint",
      "entityName": "individu",
      "fieldName": "date_naissance",
      "value": familyFile.beneficiaries[1].birthDate,
    })
  }
  const body = {
    dateDeValeur: new Date(),
    answers: {
      current: answers,
      all: answers
    }
  }

  const post_url = `${domain}/api/simulation`
  const response = await fetch(post_url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json"
    },
  })
  const simulation = await response.json()

  const location = "/recapitulatif"
  const to = location ? `&to=${location}` : ''
  const redirect_to = `${domain}/api/simulation/${simulation._id}/redirect?token=${simulation.token}${to}`

  return { url: redirect_to }
}

const handler2 = ({
  input,
  ctx
}: {
  input: StartSimulationInput
  ctx: ProtectedAppContext
}) =>
  prefillSimulation(ctx, input)

const startSimulation = createMutation({
  inputValidation: startSimulationSchema,
  handler: handler2,
  securityCheck,
})

export const mesAidesRoutes = {
  getBenefits,
  startSimulation
}
