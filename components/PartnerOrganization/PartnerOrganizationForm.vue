<template>
  <FormErrors
    v-if="errors.length > 1"
    :errors="errors"
  />
  <form
    ref="form"
    novalidate
    class="fr-container--fluid"
    @submit.prevent="emit('submit', $event)"
  >
    <div class="partner-form__subtitle fr-mb-2w">
      <div>Renseignez uniquement les champs qui vous sont utiles.</div>
      <RequiredFields />
    </div>
    <h3 class="fr-text--md formgroup__title fr-mb-2w">
      Informations principales
    </h3>

    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <VeeAutocomplete
          name="name"
          :label="partnerOrganizationFieldLabels.name"
          required
          :value="selectedName"
          :search-fn="search => searchDataInclusionStructure(search, 'name')"
          @result-selected="onStructureSelected"
        />
      </div>
      <div class="fr-col-12">
        <VeeAutocomplete
          class="fr-mb-1w"
          name="siret"
          :label="partnerOrganizationFieldLabels.siret"
          hint="Format attendu : 01234567890123"
          :required="!hasDataInclusionStructure"
          :value="selectedSiret"
          :search-fn="search => searchDataInclusionStructure(search, 'siret')"
          @result-selected="onStructureSelected"
        />
        <div
          class="fr-text--xs fr-link fr-icon-info-fill fr-fi--sm fr-link--icon-left"
        >
          Rdv sur
          <NuxtLink
            to="https://annuaire-entreprises.data.gouv.fr/"
            class="fr-link fr-text--xs"
            title="Site Web de annuaire entreprise - nouvelle fenêtre"
            target="_blank"
            rel="noopener external"
            >https://annuaire-entreprises.data.gouv.fr/</NuxtLink
          >
          ou sur votre moteur de recherche pour trouver le n° de Siret d'un
          organisme
        </div>
        <template v-if="partnerWithSameSiret">
          <div class="fr-alert fr-alert--error fr-mb-2w">
            <h3 class="fr-alert__title">
              {{
                `Un organisme ${partnerWithSameSiret.inactive ? 'inactif' : ''} existe déjà avec ce numéro de SIRET`
              }}
            </h3>
            <p>
              {{
                `${partnerWithSameSiret.name} - ${partnerWithSameSiret.siret}`
              }}
            </p>
            <p v-if="partnerWithSameSiret.inactive">
              <a
                href="#"
                target="_self"
                @click="restorePartner"
              >
                Cliquez ici pour le restaurer </a
              >ou modifier le SIRET.
            </p>
          </div>
        </template>
      </div>
    </div>

    <template v-if="!partnerWithSameSiret">
      <hr class="fr-mt-3w" />

      <h3 class="fr-text--md formgroup__title">Coordonnées</h3>

      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12">
          <VeeInput
            name="address"
            :label="partnerOrganizationFieldLabels.address"
            hint="Numéro et voie"
            :disabled="hasDataInclusionStructure"
          />
        </div>

        <div class="fr-col-4">
          <VeeInput
            name="zipcode"
            :label="partnerOrganizationFieldLabels.zipcode"
            :disabled="hasDataInclusionStructure"
          />
        </div>
        <div class="fr-col-8">
          <VeeInput
            name="city"
            :label="partnerOrganizationFieldLabels.city"
            :disabled="hasDataInclusionStructure"
          />
        </div>

        <div class="fr-col-6">
          <VeeInput
            name="phone1"
            :label="partnerOrganizationFieldLabels.phone1"
            type="tel"
            :disabled="hasDataInclusionStructure"
          />
        </div>
        <div
          v-if="showPhone2"
          class="fr-col-6"
        >
          <VeeInput
            name="phone2"
            :label="partnerOrganizationFieldLabels.phone2"
            type="tel"
            :disabled="hasDataInclusionStructure"
          />
        </div>
        <div
          v-else
          class="fr-col-6 partner-form__open-phone"
        >
          <button
            class="fr-link fr-icon-file-add-line fr-text--sm fr-mb-1w"
            :disabled="hasDataInclusionStructure"
            @click="displayPhone2"
          >
            + Ajouter un téléphone
          </button>
        </div>

        <div class="fr-col-12">
          <VeeInput
            name="email"
            :label="partnerOrganizationFieldLabels.email"
            hint="Format attendu : nom@domaine.fr"
            :disabled="hasDataInclusionStructure"
          />
        </div>
        <div class="fr-col-12">
          <VeeTextarea
            name="workingHours"
            :label="partnerOrganizationFieldLabels.workingHours"
            :disabled="hasDataInclusionStructure"
          />
        </div>
      </div>

      <hr class="fr-mt-3w" />

      <PartnerOrganizationContactForm
        v-for="(field, idx) in fields"
        :key="field.key"
        :index="idx"
        @remove="remove(idx)"
      />

      <button
        class="fr-btn fr-btn--secondary fr-btn--sm fr-btn--icon-left fr-icon-add-circle-line"
        type="button"
        @click="push({ id: v4() })"
      >
        Ajouter une personne
      </button>
    </template>
    <template v-if="!partnerWithSameSiret">
      <div class="partner-form__button-bar">
        <button
          class="fr-btn fr-btn--secondary fr-mt-3w"
          title="Annuler"
          @click="onCancel"
        >
          Annuler
        </button>
        <button
          class="fr-btn fr-mt-3w"
          title="Valider"
          type="submit"
          :submitting="isSubmitting"
        >
          Valider
        </button>
      </div>
    </template>
  </form>
</template>

<script lang="ts" setup>
  import type { FormErrors } from 'vee-validate'
  import { v4 } from 'uuid'
  import { PartnerOrganizationData, DataInclusionStructure } from './types'
  import { partnerOrganizationFieldLabels } from '~/client/labels'
  import {
    AddPartnerOrganizationInput,
    EditPartnerOrganizationInput,
    siretSchema
  } from '~/server/schema'
  import { SEARCH_NUMBER_CHARACTERS } from '~/utils/constants'

  const props = defineProps<{
    partnerId?: string
    showPhone2: boolean
    isSubmitting: boolean
    caughtErrors: FormErrors<
      AddPartnerOrganizationInput | EditPartnerOrganizationInput
    >
    hasDataInclusionStructure?: boolean
  }>()

  const trpcClient = useTrpcClient()

  const emit = defineEmits<{
    submit: [payload: Event]
    cancel: []
    restore: [partner: PartnerOrganizationData]
    selectStructure: [structure: DataInclusionStructure | null]
  }>()

  const form = ref<HTMLFormElement | null>(null)
  const showPhone2 = ref(props.showPhone2)
  const partnerWithSameSiret = ref<PartnerOrganizationData>()

  const { fields, push, remove } = useFieldArray('contacts')

  function displayPhone2() {
    showPhone2.value = true
  }

  async function onSiretChange(input: string) {
    const { success } = siretSchema.safeParse({ siret: input })
    if (success) {
      const findBySiret = await trpcClient.partner.findBySiret.query({
        siret: input
      })
      if (!findBySiret) {
        partnerWithSameSiret.value = undefined
      } else if (props.partnerId && findBySiret.id === props.partnerId) {
        partnerWithSameSiret.value = undefined
      } else {
        partnerWithSameSiret.value = findBySiret
      }
    } else {
      partnerWithSameSiret.value = undefined
    }

    return !!partnerWithSameSiret.value
  }

  const { errors } = useDisplayFormErrors(
    form,
    toRef(() => props.caughtErrors),
    partnerOrganizationFieldLabels
  )

  function restorePartner() {
    const sameSiret = partnerWithSameSiret.value
    if (sameSiret) {
      emit('restore', sameSiret)
    }
  }

  function onCancel() {
    emit('cancel')
  }

  /** Import Organization from Data Inclusion Structures */
  const selectedName = ref<string | undefined>(undefined)
  const selectedSiret = ref<string | undefined>(undefined)

  const structures = ref<DataInclusionStructure[]>([])

  /** Build suggestion list of Data Inclusion structures from same zipcode */
  async function searchDataInclusionStructure(
    search: string,
    field: 'name' | 'siret'
  ): Promise<Options> {
    emit('selectStructure', null)

    if (field === 'name') {
      selectedName.value = search
    } else {
      selectedSiret.value = search
    }

    if (search.length < SEARCH_NUMBER_CHARACTERS) {
      return []
    }

    structures.value = await trpcClient.dataInclusion.searchStructures.query({
      query: search
    })

    return structures.value.map(({ id, name, siret }) => ({
      value: id,
      label: `${name}${siret ? ' - ' + siret : ''}`
    }))
  }

  /** Send selected structure information if the Data Inclusion structure
   * is not already present in the Partner Organizations
   */
  async function onStructureSelected(structureId: string) {
    const structure = structures.value.find(s => s.id === structureId)
    if (!structure) {
      selectedName.value = undefined
      selectedSiret.value = undefined
      emit('selectStructure', null)
      return
    }

    selectedName.value = structure.name
    selectedSiret.value = structure.siret || undefined

    if (selectedSiret.value) {
      const hasPartnerWithSameSiret = await onSiretChange(selectedSiret.value)
      if (hasPartnerWithSameSiret) {
        return
      }
    }

    emit('selectStructure', structure)
  }
</script>

<style scoped>
  .partner-form__subtitle {
    color: var(--text-title-grey);
  }

  .partner-form__open-phone {
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-start;
  }

  .partner-form__button-bar {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
  }
</style>
