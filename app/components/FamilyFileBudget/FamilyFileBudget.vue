<template>
  <article>
    <div class="beneficiary-budget--header">
      <div class="beneficiary-budget--title">
        <AtomPictogram path="/pictograms/money.svg" />
        <div>
          <h2 :class="{ 'fr-mb-1v': bugetLastActivity }">
            Budget mensuel du foyer fiscal
          </h2>
          <p
            v-if="bugetLastActivity"
            class="fr-m-0"
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
      <div v-if="budget">
        <BudgetGeneralInformation :budget="budget" />
        <div class="fr-container--fluid fr-mt-5w">
          <div class="fr-grid-row fr-grid-row--gutters">
            <section class="fr-col-12 fr-col-md-6">
              <BudgetIncomes
                v-if="budget.incomes"
                :family-file-id="familyFileId"
                :incomes="budget.incomes"
                :budget-id="budget.id"
                :family-file-identification="familyFileIdentification || []"
              />
            </section>

            <section class="fr-col-12 fr-col-md-6">
              <BudgetExpenses
                v-if="budget.expenses"
                :family-file-id="familyFileId"
                :expenses="budget.expenses"
              />
            </section>
          </div>
        </div>
      </div>
    </AtomLazyComponent>
  </article>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs'
  import type { BudgetWithExpensesAndIncomes } from '~~/types/budget'
  import { EventCategory, ExportEventAction } from '~~/types/matomo'
  import { FAILED_DOWNLOAD_ERROR_MESSAGE } from '~/utils/constants'
  import { getExportFilename } from '~/utils/export/getExportFilename'
  import { getExportUrl } from '~/utils/export/getExportUrl'
  import type { BeneficiaryFileIdentification } from '~~/types/beneficiary'

  const trpcClient = useTrpcClient()
  const matomo = useMatomo()

  const { familyFileId, familyFileIdentification } = defineProps<{
    familyFileId: string
    familyFileIdentification: BeneficiaryFileIdentification[]
  }>()
  const { data: budget, error } = await trpcClient.budget.getBudget.useQuery(
    { familyFileId },
    { queryKey: 'getFamilyFile.budget' }
  )

  const firstFamilyfileId = budget?.value?.familyFileId
    ? budget.value.familyFileId
    : null

  const firstBeneficiary = familyFileIdentification
    ? familyFileIdentification[0]
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
    return getBudgetLastActivity(budget.value)
  })

  const getMostRecenttDate = (dates: Date[]): Date => {
    const unixMilliseconds = dates.map(date => dayjs(date).valueOf())
    const max = Math.max(...unixMilliseconds)
    return new Date(max)
  }

  const getBudgetLastActivity = (
    budget: BudgetWithExpensesAndIncomes | undefined
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
    // 1. exclure toutes les migrations avant le 2024-06-04 00:00:00
    // migrationDate Prod = '2024-06-03T23:06:59.476Z'
    // migrationDate Dev = '2024-06-03 07:54:17.475'
    // 2. exclure toutes les dates correspondant à la date de création du budget
    const migrationDate = new Date('2024-06-04T00:00:00Z')
    const creationDate = dayjs(budget.created).add(1, 'minute').toDate()

    const activities = [
      budget.updated,
      budget.expenses?.updated,
      ...incomesActivites,
      ...loanActivities,
      ...debtsActivities,
      ...customExpenseActivities,
      ...customIncomeActivities
    ].filter(
      date =>
        date != null &&
        date.getTime() >= migrationDate.getTime() &&
        date.getTime() >= creationDate.getTime()
    )

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

  .beneficiary-budget--title h2 {
    color: var(--primary);
  }
</style>
