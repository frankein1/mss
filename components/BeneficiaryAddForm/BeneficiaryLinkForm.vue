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
          class="fr-label fr-mb-1w"
          :class="{ 'color-red': linkToFamilyFileError !== null }"
          for="beneficiary-search"
        >
          Sélectionner un dossier bénéficiaire
          <span class="color-red">*</span>
        </label>
        <ComboBox
          v-slot="{ option, input }"
          v-model="selectedBeneficiary"
          label="Sélectionner un dossier bénéficiaire"
          :label-visible="false"
          :options="results"
          :format-display-value="formatBeneficiarySearchDisplayName"
          @input="searchBeneficiaries"
          @select="onSelect"
        >
          <div class="beneficiary">
            <div class="beneficiary-info">
              <span class="beneficiary-name">
                <AtomTextEmphasis
                  :name="formatBeneficiarySearchDisplayName(option)"
                  :input="input"
                ></AtomTextEmphasis>
              </span>
            </div>
            <div
              v-if="option.birthDate"
              class="beneficiary-birth-date"
            >
              <p class="fr-text--sm fr-mb-0">
                {{ formatDate(option.birthDate) }}
              </p>
            </div>
          </div>
        </ComboBox>
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
        bénéficiaires présents dans le dossier).
      </AtomCallout>
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
              !formValues.relationship || !selectedBeneficiary || isSubmitting
            "
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
  import type { inferProcedureOutput } from '@trpc/server'
  import type { AppRouter } from '~/server/trpc/routers'
  import { routes } from '~/utils/routes'
  import { beneficiaryFieldLabels } from '~/client/labels'
  import { commonRelationshipKeys } from '~/client/options'
  import type { RelativeRelationship } from '@prisma/client'
  import { MSS_ERROR_CODES, isTRPCClientErrorWithMSSCode } from '~/utils/error'
  import type { ArrayElement } from '~/types/utils'
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
  const isSubmitting = ref(false)

  const selectedBeneficiary = ref<
    (BeneficiarySearchResult & { disabled: boolean }) | null
  >(null)
  const results = ref<(BeneficiarySearchResult & { disabled: boolean })[]>([])

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

  const onSelect = () => {
    linkToFamilyFileError.value = null
  }

  async function onSubmit() {
    if (selectedBeneficiary?.value != null) {
      const payload = {
        ...formValues,
        beneficiaryId: selectedBeneficiary.value.id
      }
      isSubmitting.value = true
      await trpcClient.beneficiary.linkToFamilyFile
        .mutate(payload)
        .then(() => refreshNuxtData(['file.getFamilyFileMinimalInfo']))
        .then(async () => {
          await navigateTo(
            routes.file.AppFile.path(props.familyFileId, {
              beneficiaryId: selectedBeneficiary.value?.id
            })
          )
        })
        .then(() => emit('goToSuccessPage', selectedBeneficiary.value?.id))
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
    results.value = beneficiaries.map(beneficiary => ({
      id: beneficiary.id,
      firstName: beneficiary.firstName,
      fileNumber: beneficiary.fileNumber,
      status: beneficiary.status,
      usualName: beneficiary.usualName,
      birthDate: beneficiary.birthDate,
      familyFileId: beneficiary.familyFileId,
      birthName: beneficiary.birthName,
      phone1: null,
      disabled: false
    }))
  }
</script>

<style scoped lang="scss">
  .btns-groups {
    justify-content: flex-end;
  }

  .result {
    width: 100%;
  }

  .beneficiary {
    .beneficiary-info {
      color: var(--primary);
    }
  }
</style>
