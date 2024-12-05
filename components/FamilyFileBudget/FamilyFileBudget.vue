<template>
  <article>
    <div class="beneficiary-budget--header">
      <div class="beneficiary-budget--title">
        <AtomPictogram path="/pictograms/money.svg" />
        <h2 class="fr-m-0">Budget mensuel du foyer fiscal</h2>
      </div>
      <button
        class="fr-btn fr-btn--tertiary-no-outline fr-icon-download-fill fr-btn--icon-left"
        type="button"
        @click="clickExportBudget"
      >
        Exporter le budget
      </button>
    </div>

    <AtomLazyComponent
      :error="Boolean(error)"
      message="Le budget du foyer n'a pas pu être chargé"
    >
      <div v-if="data">
        <BudgetGeneralInformation :budget="data" />
        <div class="fr-container--fluid fr-mt-5w">
          <div class="fr-grid-row fr-grid-row--gutters">
            <div class="fr-col-6">
              <BudgetIncomes
                v-if="data.incomes"
                :family-file-id="familyFileId"
                :incomes="data.incomes"
                :budget-id="data.id"
                :family-file-identification="familyFileIdentification || []"
              />
            </div>

            <div class="fr-col-6">
              <BudgetExpenses
                v-if="data.expenses"
                :family-file-id="familyFileId"
                :expenses="data.expenses"
              />
            </div>
          </div>
        </div>
      </div>
    </AtomLazyComponent>
  </article>
</template>

<script lang="ts" setup>
  import { getFamilyFileInjectionKey } from '~/composables/useGetFamilyFile'
  import { EventCategory, ExportEventAction } from '~/types/matomo'
  import { FAILED_DOWNLOAD_ERROR_MESSAGE } from '~/utils/constants'
  import { getExportFilename } from '~/utils/export/getExportFilename'
  import { getExportUrl } from '~/utils/export/getExportUrl'

  const trpcClient = useTrpcClient()
  const matomo = useMatomo()

  defineProps<{ familyFileId: string }>()

  const { familyFileIdentification, budget } = inject(
    getFamilyFileInjectionKey
  ) as GetFamilyFile
  const { data, error } = budget
  const firstFamilyfileId = familyFileIdentification.value
    ? familyFileIdentification.value[0].id
    : null

  const firstBeneficiary = familyFileIdentification.value
    ? familyFileIdentification.value[0]
    : null

  const clickExportBudget = async () => {
    if (firstFamilyfileId) {
      matomo.trackEvent(
        EventCategory.ExportBudget,
        ExportEventAction.DownloadExcel
      )
      try {
        const exportedFile = await trpcClient.budget.exportBudget.query({
          familyFileId: firstFamilyfileId
        })
        if (!exportedFile?.data) {
          throw new Error('no data')
        }
        const downloadLink = document.createElement('a')
        downloadLink.href = getExportUrl(exportedFile.data)
        const name = firstBeneficiary
          ? formatBeneficiaryDisplayName({
              firstName: firstBeneficiary.firstName || '',
              usualName: firstBeneficiary.usualName || '',
              birthName: firstBeneficiary.birthName || ''
            })
          : ''
        downloadLink.download = getExportFilename(`budget_${name}`)
        downloadLink.click()
        downloadLink.remove()
      } catch {
        useSnackbar().error(FAILED_DOWNLOAD_ERROR_MESSAGE)
      }
    }
  }
</script>

<style scoped lang="scss">
  @use '@gouvfr/dsfr/module/media-query' as dsfr-media-query;

  .beneficiary-budget--header,
  .beneficiary-budget--title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .beneficiary-budget--header {
    margin-bottom: 1.25rem;
    flex-direction: column;
    align-items: flex-start;

    button {
      margin-left: 0;
      margin-right: auto;
    }

    @include dsfr-media-query.respond-from('lg') {
      align-items: center;
      flex-direction: row;

      button {
        margin-left: auto;
        margin-right: 0;
      }
    }
  }

  .beneficiary-budget--title > h2 {
    color: var(--primary);
  }
</style>
