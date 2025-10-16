import {
  FamilyFileRepo,
} from '~/server/database'
import type { ProtectedAppContext } from '~/server/trpc'
import type { PrefillSimulationInput } from '~/server/schema'

interface Answer {
  entityName: string
  fieldName?: string
  id?: string
  path?: string
  value: any
}

async function prefillSimulation(ctx: ProtectedAppContext, v: PrefillSimulationInput):Promise<
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
    }
  })

  const {
    public: { mesAides: { host } }
  } = useRuntimeConfig()

  const answers: Answer[] = [
    {
      "id": "demandeur",
      "entityName": "individu",
      "fieldName": "pivot-data",
      "value": "local-mss-id"
    }
  ]

  const b0 = familyFile.beneficiaries[0]
  if (b0) {
    const dob = b0.birthDate
    if (dob) {
      answers.push({
        "id": "demandeur",
        "entityName": "individu",
        "fieldName": "date_naissance",
        "value": dob,
      })
    }

    if (familyFile.beneficiaries.length > 1) {
      const conjoint = familyFile.beneficiaries.find(b => b.relationship === "Conjoint")
      if (conjoint) {
        answers.push({
          "entityName": "famille",
          "fieldName": "en_couple",
          "value": true,
        })
        if (conjoint.birthDate) {
          answers.push({
            "id": "conjoint",
            "entityName": "individu",
            "fieldName": "date_naissance",
            "value": conjoint.birthDate,
          })
        }
      }
    }
  }
  const body = {
    dateDeValeur: new Date(),
    answers: {
      current: answers,
      all: answers
    }
  }

  const post_url = `${host}/api/simulation`
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
  const redirect_to = `${host}/api/simulation/${simulation._id}/redirect?token=${simulation.token}${to}`

  return { url: redirect_to }
}

export const MesAidesService = {
  prefillSimulation,
}
