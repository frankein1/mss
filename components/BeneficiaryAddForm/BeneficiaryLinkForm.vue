<template>
  <form novalidate>
    <fieldset
      class="fr-fieldset form-grid fr-grid-row fr-grid-row--gutters fr-grid-row--bottom fr-mb-4w"
      aria-labelledby="add-benefeciary-legend"
    >
      <div class="fr-col-12">
        <VeeSelect
          name="relationship"
          required
          :label="beneficiaryFieldLabels.relationship"
          :options="withEmptyValue(commonRelationshipKeys.options)"
        />
      </div>
      <div class="fr-col-12">
        <label
          class="fr-label"
          :class="{ 'color-red': linkToFamilyFileError !== null }"
          for="beneficiary-search"
        >
          Sélectionner un dossier bénéficiaire
          <span class="color-red">*</span>
        </label>
        <BeneficiarySearchbarInput
          class="beneficiary-search fr-mr-2w fr-col-12"
          label="Jeanne DUMONT"
          name="beneficiary-search"
          :search-fn="searchBeneficiaries"
        >
          <template #result="{ result: beneficiary, input }">
            <a
              href="#"
              class="fr-btn fr-btn--tertiary-no-outline result"
              @click="() => onSelect({ beneficiary, input })"
            >
              {{ formatBeneficiarySearchDisplayName(beneficiary) }}
            </a>
          </template>
        </BeneficiarySearchbarInput>
        <span
          v-if="linkToFamilyFileError !== null"
          class="color-red"
          >{{ linkToFamilyFileError }}</span
        >
      </div>
    </fieldset>
    <div class="fr-col-12">
      <AtomCallout
        >Attention, les agents référents du bénéficiaire sélectionné seront
        ajoutés comme référents à ce dossier foyer (et donc à l'ensemble des
        bénéficiaires présents dans le dossier).</AtomCallout
      >
    </div>
    <div class="fr-col-12">
      <ul class="fr-btns-group fr-btns-group--inline-md btns-groups">
        <li>
          <button
            class="fr-btn fr-btn--secondary fr-mb-0"
            @click="() => emit('close')"
          >
            Annuler
          </button>
        </li>
        <li>
          <button
            class="fr-btn fr-btn fr-mb-0"
            :disabled="
              !formValues.relationship || !linked_beneficiary || isSubmitting
            "
            :submitting="isSubmitting"
            @click.prevent="onSubmit"
          >
            Confirmer
          </button>
        </li>
      </ul>
    </div>
  </form>
</template>

<script setup lang="ts">
  import { inferProcedureOutput } from '@trpc/server'
  import { AppRouter } from '~/server/trpc/routers'
  import { routes } from '~/utils/routes'
  import { beneficiaryFieldLabels } from '~/client/labels'
  import { commonRelationshipKeys } from '~/client/options'
  import { RelativeRelationship } from '@prisma/client'
  import { MSS_ERROR_CODES, isTRPCClientErrorWithMSSCode } from '~/utils/error'
  import { ArrayElement } from '~/types/utils'
  import { EventCategory, FamilyFileAction } from '~/types/matomo'

  type BeneficiarySearchResult = ArrayElement<
    inferProcedureOutput<AppRouter['beneficiary']['search']>
  >

  const props = defineProps<{
    familyFileId: string
  }>()
  const emit = defineEmits<{
    close: []
    goToSuccessPage: [beneficiaryId?: string]
  }>()

  const matomo = useMatomo()
  const trpcClient = useTrpcClient()
  const linkToFamilyFileError = ref<string | null>(null)
  const linked_beneficiary = ref<BeneficiarySearchResult | undefined>(undefined)
  const isSubmitting = ref(false)

  const { values: formValues } = useForm<{
    familyFileId: string
    relationship: RelativeRelationship
  }>({
    initialValues: {
      familyFileId: props.familyFileId
    }
  })

  function getErrorLabel(code: string) {
    switch (code) {
      case MSS_ERROR_CODES.BENEFICIARY_ALREADY_LINKED_TO_FAMILY_FILE:
        return 'Ce bénéficiaire est déjà rattaché au foyer'
      case MSS_ERROR_CODES.FAMILIY_FILE_HAS_MULTIPLE_BENEFICIARIES:
        return 'Vous ne pouvez pas ajouter ce bénéficiaire car il est déjà dans un dossier foyer. Retournez sur sa fiche et cliquez sur "dissocier du dossier" pour pouvoir l\'ajouter à ce dossier foyer.'
      default:
        return 'Erreur inconnue'
    }
  }

  function onSelect({
    input,
    beneficiary
  }: {
    input: HTMLInputElement | null
    beneficiary: BeneficiarySearchResult
  }) {
    linked_beneficiary.value = beneficiary
    linkToFamilyFileError.value = null
    if (input !== null) {
      input.value = formatBeneficiarySearchDisplayName(beneficiary)
    }
  }

  async function onSubmit() {
    if (linked_beneficiary.value !== undefined) {
      const payload = {
        ...formValues,
        beneficiaryId: linked_beneficiary.value.id
      }
      isSubmitting.value = true
      await trpcClient.beneficiary.linkToFamilyFile
        .mutate(payload)
        .then(() =>
          refreshNuxtData([
            'getFamilyFile.minimalInfo',
            'getFamilyFile.documents',
            'getFamilyFile.history',
            'getFamilyFile.budget'
          ])
        )
        .then(async () => {
          await navigateTo(
            routes.file.AppFile.path(props.familyFileId, {
              beneficiaryId: linked_beneficiary.value?.id
            })
          )
        })
        .then(() => emit('goToSuccessPage', linked_beneficiary.value?.id))
        .then(() =>
          matomo.trackEvent(
            EventCategory.FamilyFile,
            FamilyFileAction.LinkBeneficiary
          )
        )
        .catch(error => {
          if (!(error instanceof Error)) {
            return
          }
          if (isTRPCClientErrorWithMSSCode(error)) {
            linkToFamilyFileError.value = getErrorLabel(error.data.MSS_CODE)
          } else {
            linkToFamilyFileError.value = error.message
          }
        })
        .finally(() => {
          isSubmitting.value = false
        })
    }
  }

  async function searchBeneficiaries(query: string) {
    linkToFamilyFileError.value = null
    const beneficiaries = await useTrpcClient().beneficiary.search.query({
      query
    })
    return beneficiaries
  }
</script>

<style scoped lang="scss">
  .btns-groups {
    justify-content: flex-end;
  }

  .result {
    width: 100%;
  }
</style>
