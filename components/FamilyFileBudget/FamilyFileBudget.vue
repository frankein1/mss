<template>
  <article>
    <div class="beneficiary-budget--header">
      <div class="beneficiary-budget--title">
        <AtomPictogram path="/pictograms/money.svg" />
        <div>
          <h2 class="fr-mb-1v">Budget mensuel du foyer fiscal</h2>
          <p
            v-if="bugetLastActivity"
            class="fr-m-0 fr-text--bold"
          >
            Dernière mise à jour : {{ bugetLastActivity.toLocaleDateString() }}
          </p>
        </div>
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
  import dayjs from 'dayjs'
  import { getFamilyFileInjectionKey } from '~/composables/useGetFamilyFile'
  import { BudgetWithExpensesAndIncomes } from '~/types/budget'
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
  const firstFamilyfileId = data?.value?.familyFileId
    ? data.value.familyFileId
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

  // get last activity
  const bugetLastActivity = computed(() => {
    return getBudgetLastActivity(data.value)
  })

  const getMostRecenttDate = (dates: Date[]): Date => {
    const unixMilliseconds = dates.map(date => dayjs(date).valueOf())
    const max = Math.max(...unixMilliseconds)
    return new Date(max)
  }

  const getBudgetLastActivity = (
    budget: BudgetWithExpensesAndIncomes | null
  ) => {
    if (!budget) {
      return null
    }

    const incomesActivites = budget
      ? budget?.incomes.map(income => income.updated)
      : []
    const loanActivities = budget.expenses?.loans
      ? (budget.expenses.loans
          .map(loan => loan.updated)
          .filter(Boolean) as Date[])
      : []
    const debtsActivities = budget.expenses?.debts
      ? (budget.expenses.debts
          .map(debt => debt.updated)
          .filter(Boolean) as Date[])
      : []
    const customExpenseActivities = budget.expenses?.customs
      ? (budget.expenses.customs
          .map(custom => custom.updated)
          .filter(Boolean) as Date[])
      : []
    const customIncomeActivities = budget.incomes
      ? (budget.incomes
          .flatMap(income => {
            if (income.customs) {
              return income.customs.map(custom => custom.updated)
            }
            return []
          })
          .filter(Boolean) as Date[])
      : []

    // Date de migration de le fonctionalité Budget.
    const migrationDate = new Date('2024-06-03T23:06:59.476Z')
    const activities = [
      budget.updated,
      budget.expenses?.updated,
      ...incomesActivites,
      ...loanActivities,
      ...debtsActivities,
      ...customExpenseActivities,
      ...customIncomeActivities
    ].filter(date => date != null && date.getTime() !== migrationDate.getTime())

    if (activities.length === 0) {
      return null
    }

    return getMostRecenttDate(activities.filter(Boolean) as Date[])
  }
</script>

<style scoped lang="scss">
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

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

  .beneficiary-budget--title h2,
  .beneficiary-budget--title p {
    color: var(--primary);
  }
</style>
