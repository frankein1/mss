<template>
  <BeneficiaryFormSection :section-title="`Membre du foyer ${index + 1}`">
    <template #titleAction>
      <button
        class="fr-btn fr-btn--secondary fr-btn--sm fr-btn--icon-left fr-icon-delete-line"
        type="button"
        @click="emit('removeTaxHousehold')"
      >
        Supprimer ce membre du foyer
      </button>
    </template>

    <div
      v-if="linkedBeneficiary"
      class="fr-col-12"
    >
      <div class="fr-input--group">
        <label
          class="fr-label"
          :for="'beneficiary_file_number' + index"
        >
          {{ relativeFieldLabels.linkedBeneficiaryId }}
        </label>
        <div class="fr-input-wrap">
          <button
            class="fr-tag force-focus-visible fr-tag--dismiss"
            aria-label="Retirer la fiche bénéficiaire liée"
            type="button"
            @click="onUnselectLinkedBeneficiary"
          >
            {{ getBeneficiaryLabel }}
          </button>
        </div>
      </div>
    </div>
    <template v-else>
      <div class="fr-col-12 fr-col-lg-6">
        <VeeAutocomplete
          :label="relativeFieldLabels.lastName"
          :name="`taxHouseholds[${index}].lastName`"
          :search-fn="searchBeneficiariesFromLastname"
          @result-selected="onSelectBeneficiary"
        />
      </div>
      <div class="fr-col-12 fr-col-lg-6">
        <VeeAutocomplete
          :name="`taxHouseholds[${index}].firstName`"
          :label="relativeFieldLabels.firstName"
          :search-fn="searchBeneficiariesFromFirstname"
          @result-selected="onSelectBeneficiary"
        />
      </div>
      <div class="fr-col-12 fr-col-lg-6">
        <VeeInput
          :name="`taxHouseholds[${index}].phone`"
          :label="relativeFieldLabels.phone"
          type="tel"
        />
      </div>
      <div class="fr-col-12 fr-col-lg-6">
        <VeeInput
          :name="`taxHouseholds[${index}].email`"
          :label="relativeFieldLabels.email"
          type="email"
        />
      </div>
      <div class="fr-col-12 fr-col-lg-6 fr-col-offset-lg-6--right">
        <VeeInput
          :name="`taxHouseholds[${index}].birthDate`"
          :label="relativeFieldLabels.birthDate"
          type="date"
        />
      </div>
    </template>
    <div class="fr-col-12">
      <VeeSelect
        :name="`taxHouseholds[${index}].relationship`"
        :label="relativeFieldLabels.relationship"
        :options="withEmptyValue(taxHouseHoldRelationshipOptions)"
      />
    </div>
    <div class="fr-col-12">
      <VeeCheckbox
        :name="`taxHouseholds[${index}].caregiver`"
        :label="relativeFieldLabels.caregiver"
      />
    </div>
    <div class="fr-col-12">
      <VeeTextarea
        :name="`taxHouseholds[${index}].additionalInformation`"
        :label="relativeFieldLabels.additionalInformation"
      >
        <template #hint>
          Il est fortement recommandé de ne stocker que les informations utiles
          au suivi du bénéficiaire et d'éviter le recueil d'informations
          sensibles (données de santé, mots de passe, etc).
        </template>
      </VeeTextarea>
    </div>
  </BeneficiaryFormSection>
</template>

<script lang="ts" setup>
  import { taxHouseHoldRelationshipOptions } from '~/client/options/beneficiary'
  import { CreateOrUpdateTaxHouseholdInput } from '~/server/schema'
  import { BeneficiarySearchResult } from '~/types/beneficiary'
  import { relativeFieldLabels } from '~/client/labels'

  const props = defineProps<{
    index: number
    currentBeneficiaryId?: string
  }>()

  const emit = defineEmits<{
    removeTaxHousehold: []
    selectBeneficiary: [data: BeneficiarySearchResult | null]
  }>()

  const { value: linkedBeneficiary } = useField<
    CreateOrUpdateTaxHouseholdInput['linkedBeneficiary']
  >(`taxHouseholds[${props.index}].linkedBeneficiary`)

  /**
   * The beneficiaries search is done based on firstname, birth_name and
   * usual_name, independently if the input is in the lastname field or the
   * firstname field.
   * Nevertheless, as focusing back an autocomplete input shows up the result
   * list from the last search, the form has to remember last results from both
   * autocomplete inputs in case the user selects one after focusing it back.
   */
  const lastResultsFromLastname = ref<BeneficiarySearchResult[]>([])
  const lastResultsFromFirstname = ref<BeneficiarySearchResult[]>([])

  const lastResults = computed(() => [
    ...lastResultsFromFirstname.value,
    ...lastResultsFromLastname.value
  ])

  const getBeneficiaryLabel = computed(() => {
    if (!linkedBeneficiary.value) {
      return ''
    }
    return formatBeneficiaryDisplayName(linkedBeneficiary.value)
  })

  async function searchBeneficiariesFromLastname(search: string) {
    const beneficiaries = await useTrpcClient().beneficiary.search.query({
      query: search,
      excludedIds: props.currentBeneficiaryId
        ? [props.currentBeneficiaryId]
        : []
    })
    lastResultsFromLastname.value = beneficiaries
    return beneficiariesToAutocompleteResults(beneficiaries)
  }

  async function searchBeneficiariesFromFirstname(search: string) {
    const beneficiaries = await useTrpcClient().beneficiary.search.query({
      query: search,
      excludedIds: props.currentBeneficiaryId
        ? [props.currentBeneficiaryId]
        : []
    })
    lastResultsFromFirstname.value = beneficiaries
    return beneficiariesToAutocompleteResults(beneficiaries)
  }

  function beneficiariesToAutocompleteResults(
    beneficiaries: BeneficiarySearchResult[]
  ) {
    const entries: [string, string][] = beneficiaries.map(beneficiary => [
      beneficiary.id,
      `${formatBeneficiarySearchDisplayName(beneficiary)}`
    ])
    return new Map<string, string>(entries)
  }

  function onSelectBeneficiary(beneficiaryId: string) {
    const selectedBeneficiary = lastResults.value.find(
      ({ id }) => id === beneficiaryId
    )
    if (!selectedBeneficiary) {
      return
    }
    emit('selectBeneficiary', selectedBeneficiary)
  }

  function onUnselectLinkedBeneficiary() {
    emit('selectBeneficiary', null)
  }
</script>
