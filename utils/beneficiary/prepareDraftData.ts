import {
  SaveBeneficiaryEntourageInput,
  SaveBeneficiaryExternalOrganisationsInput,
  SaveBeneficiaryGeneralInformationInput,
  SaveBeneficiaryHealthInput,
  SaveBeneficiaryOccupationInput,
  SaveBeneficiaryTaxHouseholdInput,
  SaveDraftInput
} from '~/server/schema'
import { BeneficiaryDraft } from '~/types/beneficiary'

export function prepareDraftData(
  input: SaveDraftInput,
  beneficiaryDraft: BeneficiaryDraft
) {
  const general = (input.general || beneficiaryDraft.content?.general) as
    | SaveBeneficiaryGeneralInformationInput
    | undefined
  const taxHousehold = (input.taxHousehold ||
    beneficiaryDraft.content?.taxHousehold) as
    | SaveBeneficiaryTaxHouseholdInput
    | undefined
  const entourage = (input.entourage || beneficiaryDraft.content?.entourage) as
    | SaveBeneficiaryEntourageInput
    | undefined
  const health = (input.health || beneficiaryDraft.content?.health) as
    | SaveBeneficiaryHealthInput
    | undefined
  const occupation = (input.occupation ||
    beneficiaryDraft.content?.occupation) as
    | SaveBeneficiaryOccupationInput
    | undefined
  const externalOrganisations = (input.externalOrganisations ||
    beneficiaryDraft.content?.externalOrganisations) as
    | SaveBeneficiaryExternalOrganisationsInput
    | undefined

  return {
    general,
    taxHousehold,
    entourage,
    health,
    occupation,
    externalOrganisations
  }
}

export type PreparedDraftData = ReturnType<typeof prepareDraftData>
