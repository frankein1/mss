<template>
  <fieldset
    ref="$el"
    class="fr-fieldset fr-container--fluid relative-fieldset"
  >
    <legend class="fr-fieldset__legend--regular fr-fieldset__legend">
      <h3 class="fr-h5">
        {{ `Membre du foyer ${index + 1}` }}
      </h3>
    </legend>
    <div class="fr-grid-row fr-grid-row--gutters form-grid">
      <div
        v-if="beneficiary"
        class="fr-fieldset__element"
      >
        <div class="fr-input--group">
          <label
            class="fr-label"
            :for="'beneficiary_file_number' + index"
          >
            Fiche bénéficiaire liée
          </label>
          <div class="fr-input-wrap">
            <button
              :id="'beneficiary_file_number' + index"
              ref="beneficiaryTag"
              class="fr-tag fr-tag--dismiss force-focus-visible"
              :aria-label="
                'Retirer le lien vers la fiche bénéficiaire ' + beneficiaryLabel
              "
              @click="unlink()"
            >
              {{ beneficiaryLabel }}
            </button>
          </div>
        </div>
      </div>
      <template v-if="!beneficiary">
        <div class="fr-fieldset__element">
          <VeeAutocomplete
            label="Nom"
            :name="`taxHousehold.taxHouseholds[${index}].lastName`"
            :search-fn="searchBeneficiariesFromLastname"
            @result-selected="onSelectBeneficiary"
          />
        </div>
        <div class="fr-fieldset__element">
          <VeeAutocomplete
            :name="`taxHousehold.taxHouseholds[${index}].firstName`"
            label="Prénom"
            :search-fn="searchBeneficiariesFromFirstname"
            @result-selected="onSelectBeneficiary"
          />
        </div>
      </template>
      <div class="fr-fieldset__element">
        <VeeSelect
          :name="`taxHousehold.taxHouseholds[${index}].relationship`"
          label="Statut"
          :options="withEmptyValue(taxHouseHoldRelationshipOptions)"
        />
      </div>
      <template v-if="!beneficiary">
        <div class="fr-fieldset__element">
          <VeeInput
            :name="`taxHousehold.taxHouseholds[${index}].email`"
            label="Email"
            type="email"
          />
        </div>
        <div class="fr-fieldset__element">
          <VeeInput
            :name="`taxHousehold.taxHouseholds[${index}].phone`"
            label="Téléphone"
            type="tel"
          />
        </div>
      </template>
      <div class="fr-fieldset__element">
        <VeeCheckbox
          :name="`taxHousehold.taxHouseholds[${index}].caregiver`"
          label="Aidant familial"
        />
      </div>
      <div class="fr-fieldset__element">
        <VeeInput
          class="fr-col-12"
          :name="`taxHousehold.taxHouseholds[${index}].additionalInformation`"
          label="Informations complémentaires"
        />
      </div>
    </div>

    <button
      class="fr-btn fr-btn--secondary fr-btn--sm fr-btn--icon-left fr-icon-delete-line fr-mt-2w delete-relative-btn"
      type="button"
      @click="$emit('removeTaxHousehold')"
    >
      Supprimer ce membre du foyer
    </button>
  </fieldset>
</template>

<script lang="ts" setup>
  import { FieldEntry } from 'vee-validate'
  import { taxHouseHoldRelationshipOptions } from '~/client/options/beneficiary'
  import { CreateOrUpdateTaxHouseholdInput } from '~/server/schema'
  import { BeneficiarySearchResult } from '~/utils'

  const props = defineProps<{
    taxHousehold: FieldEntry<CreateOrUpdateTaxHouseholdInput>
    index: number
  }>()

  defineEmits<{
    (e: 'removeTaxHousehold'): void
  }>()

  const beneficiary = ref(props.taxHousehold.value.beneficiary)

  const unlink = () => {
    beneficiary.value = null
  }

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

  const beneficiaryLabel = computed(() => {
    if (!beneficiary.value) {
      return ''
    }
    return getBeneficiaryDisplayName(beneficiary.value)
  })

  async function searchBeneficiariesFromLastname(search: string) {
    const beneficiaries = await useTrpcClient().beneficiary.search.query({
      query: search
    })
    lastResultsFromLastname.value = beneficiaries
    return beneficiariesToAutocompleteResults(beneficiaries)
  }

  async function searchBeneficiariesFromFirstname(search: string) {
    const beneficiaries = await useTrpcClient().beneficiary.search.query({
      query: search
    })
    lastResultsFromFirstname.value = beneficiaries
    return beneficiariesToAutocompleteResults(beneficiaries)
  }

  function beneficiariesToAutocompleteResults(
    beneficiaries: BeneficiarySearchResult[]
  ) {
    const entries: [string, string][] = beneficiaries.map(beneficiary => [
      beneficiary.id,
      `${getBeneficiarySearchDisplayName(beneficiary)}`
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
    beneficiary.value = selectedBeneficiary
  }
</script>

<style scoped>
  .relative-fieldset {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .delete-relative-btn {
    box-shadow: inset 0 0 0 1px var(--border-plain-error);
    color: var(--border-plain-error);
  }
</style>
