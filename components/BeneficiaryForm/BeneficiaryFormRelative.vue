<template>
  <fieldset
    ref="$el"
    class="fr-fieldset fr-container--fluid relative-fieldset"
  >
    <legend class="fr-fieldset__legend--regular fr-fieldset__legend">
      <h3 class="fr-h5">
        {{ relativeTitle }}
      </h3>
    </legend>
    <div class="fr-grid-row fr-grid-row--gutters form-grid">
      <template v-if="household">
        <div
          v-if="beneficiary"
          class="fr-fieldset__element"
        >
          <div class="fr-input--group">
            <label
              class="fr-label"
              :for="inputPrefix + 'beneficiary_file_number' + index"
            >
              Fiche bénéficiaire liée
            </label>
            <div class="fr-input-wrap">
              <button
                :id="inputPrefix + 'beneficiary_file_number' + index"
                ref="beneficiaryTag"
                class="fr-tag fr-tag--dismiss force-focus-visible"
                :aria-label="
                  'Retirer le lien vers la fiche bénéficiaire ' +
                  beneficiaryLabel
                "
                @click="beneficiary = null"
              >
                {{ beneficiaryLabel }}
              </button>
            </div>
          </div>
        </div>
        <!-- Hidden input for submit purpose -->
        <input
          :name="inputPrefix + 'beneficiary' + index"
          :value="beneficiary?.id || ''"
          hidden
        />
      </template>
      <template v-if="!beneficiary">
        <div class="fr-fieldset__element">
          <AtomAutocomplete
            v-if="household"
            label="Nom"
            :name="inputPrefix + 'lastname' + index"
            :search-fn="searchBeneficiariesFromLastname"
            :value="lastname"
            @result-selected="onSelectBeneficiary"
          />
          <AtomInput
            v-else
            label="Nom"
            :name="inputPrefix + 'lastname' + index"
            :value="relative.lastname || ''"
          />
        </div>
        <div class="fr-fieldset__element">
          <AtomAutocomplete
            v-if="household"
            :name="inputPrefix + 'firstname' + index"
            label="Prénom"
            :search-fn="searchBeneficiariesFromFirstname"
            :value="firstname"
            @result-selected="onSelectBeneficiary"
          />
          <AtomInput
            v-else
            label="Prénom"
            :name="inputPrefix + 'firstname' + index"
            :value="relative.firstname || ''"
          />
        </div>
      </template>
      <div class="fr-fieldset__element">
        <AtomSelect
          :name="inputPrefix + 'type' + index"
          label="Statut"
          :options="withEmptyValue(relativeTypeOptions)"
          :model-value="relative.type || ''"
        />
      </div>
      <div
        v-if="!household"
        class="fr-fieldset__element"
      >
        <AtomInput
          :name="inputPrefix + 'city' + index"
          label="Ville"
          :value="relative.city || ''"
        />
      </div>
      <template v-if="!beneficiary">
        <div class="fr-fieldset__element">
          <AtomInput
            :name="inputPrefix + 'email' + index"
            label="Email"
            type="email"
            :value="relative.email || ''"
          />
        </div>
        <div class="fr-fieldset__element">
          <AtomInput
            :name="inputPrefix + 'phone' + index"
            label="Téléphone"
            :value="relative.phone || ''"
            type="tel"
          />
        </div>
      </template>
      <input
        v-if="household"
        :id="inputPrefix + 'hosted' + index"
        type="checkbox"
        :name="inputPrefix + 'hosted' + index"
        checked
        hidden
      />
      <div class="fr-fieldset__element">
        <AtomCheckbox
          :name="inputPrefix + 'caregiver' + index"
          label="Aidant familial"
          :model-value="relative.caregiver"
        />
      </div>
      <div class="fr-fieldset__element">
        <AtomInput
          class="fr-col-12"
          :name="inputPrefix + 'additional_information' + index"
          label="Informations complémentaires"
          :value="relative.additional_information || ''"
        />
      </div>
    </div>

    <button
      class="fr-btn fr-btn--secondary fr-btn--sm fr-btn--icon-left fr-icon-delete-line fr-mt-2w delete-relative-btn"
      type="button"
      @click="$emit('removeRelative')"
    >
      {{ removeButtonLabel }}
    </button>
  </fieldset>
</template>

<script lang="ts" setup>
  import {
    taxHouseHoldRelationshipOptions,
    entourageRelationshipOptions
  } from '~/client/options/beneficiary'
  import {
    BeneficiaryRelativeWithBeneficiary,
    BeneficiarySearchResult
  } from '~/utils'

  const props = defineProps<{
    currentBeneficiaryId: string
    relative: BeneficiaryRelativeWithBeneficiary
    index: number
    household: boolean
  }>()

  defineEmits(['removeRelative'])

  const beneficiary = ref(props.relative.beneficiary)
  const beneficiaryTag = ref<HTMLElement>()
  const $el = ref<HTMLElement>()

  const initialLastname = computed(
    () => beneficiary.value?.usual_name || props.relative.lastname || ''
  )
  const initialFirstname = computed(
    () => beneficiary.value?.firstname || props.relative.firstname || ''
  )

  const lastname = ref(initialLastname.value)
  const firstname = ref(initialFirstname.value)

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

  const beneficiaryLabel = computed(() =>
    getBeneficiaryDisplayName(beneficiary.value)
  )

  const relativeTypeOptions = computed(() =>
    props.household
      ? taxHouseHoldRelationshipOptions
      : entourageRelationshipOptions
  )

  const inputPrefix = computed(() =>
    props.household ? 'tax-household' : 'entourage'
  )

  const removeButtonLabel = computed(() =>
    props.household ? 'Supprimer ce membre du foyer' : 'Supprimer ce proche'
  )

  const relativeTitle = computed(() => {
    const displayedIndex = props.index + 1
    return props.household
      ? `Membre du foyer ${displayedIndex}`
      : `Proche ${displayedIndex}`
  })

  // Watch for the beneficiary selection/deselection, to maintain a focus logic
  watch(
    beneficiary,
    _beneficiary => {
      if (_beneficiary) {
        beneficiaryTag.value?.focus()
      } else {
        const firstInput = $el.value?.querySelector('input')
        if (!firstInput) {
          return
        }
        firstInput.focus()
      }
    },
    { flush: 'post' }
  )

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
    beneficiary.value = lastResults.value.find(({ id }) => id === beneficiaryId)
    // Setting the lastname and the firstname allows to have the valued filled in the inputs if the link is removed
    lastname.value = beneficiary.value.usual_name
    firstname.value = beneficiary.value.firstname
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
