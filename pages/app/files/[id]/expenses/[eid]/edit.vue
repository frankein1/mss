<template>
  <AtomLoader
    v-if="beneficiaryPending"
    class="fr-mx-auto"
  />

  <AtomAlert
    v-else-if="beneficiaryError"
    :alert-type="AlertType.Error"
    message="Le bénéficiaire n'a pas pu être chargé."
  />

  <form
    v-else-if="beneficiaryIdentification"
    ref="form"
    novalidate
    @submit.prevent="onSubmit"
  >
    <main class="content">
      <div class="fr-container fr-pb-2w">
        <!-- <DsfrBreadcrumb
          :links="
            Breadcrumb.AppFileBudgetExpensesEdit(
              beneficiaryIdentification,
              expensesId
            )
          "
        /> -->

        <PageTitle
          :title="title"
          pictogram-path="/pictograms/money.svg"
          pictogram-background
          subtitle="du foyer fiscal"
        />

        <AtomLoader
          v-if="pending"
          class="fr-mx-auto"
        />

        <AtomAlert
          v-else-if="error"
          :alert-type="AlertType.Error"
          message="Les charges mensuelles n'ont pas pu être chargées."
        />

        <BudgetExpensesForm
          v-else-if="expenses"
          :main-total="mainExpensesTotal"
          :loans-total="loansTotal"
          :debts-total="debtsTotal"
        />

        <section class="expenses__total">
          <h2 class="fr-h4 fr-m-0">Total :</h2>
          <span class="fr-h4 fr-m-0 euro-symbol">{{
            total !== null ? euros(total) : '-'
          }}</span>
        </section>
      </div>
    </main>

    <BudgetActionBar
      :is-submitting="isSubmitting"
      @cancel="onCancel"
    />
  </form>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'
  import { useBeneficiarySummary } from '~/composables/useBeneficiarySummary'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import {
    UpdateBudgetExpensesInput,
    updateBudgetExpensesSchema
  } from '~/server/schema'
  import { prismaDecimalToNumber } from '~/utils/prisma'
  import { euros } from '~/utils/euros'
  import { incrementBudgetTotal } from '~/utils/budget'
  import { budgetExpensesKeys } from '~/client/options'
  import { ExpensesKey } from '~/types/budget'
  import { routes } from '~/routes'

  const route = useRoute()
  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const beneficiaryId = route.params.id as string
  const expensesId = route.params.eid as string

  const title = routes.budget.AppFileBudgetExpensesEdit.title

  useHead({ title })

  definePageMeta({
    name: routes.budget.AppFileBudgetExpensesEdit.name
  })

  const {
    beneficiaryIdentification,
    pending: beneficiaryPending,
    error: beneficiaryError
  } = await useBeneficiarySummary(beneficiaryId)

  const {
    data: expenses,
    pending,
    error
  } = await trpcClient.budget.getExpenses.useQuery({ id: expensesId })

  const {
    handleSubmit,
    meta,
    isSubmitting,
    values: expensesValues
  } = useForm<UpdateBudgetExpensesInput>({
    validationSchema: toTypedSchema(updateBudgetExpensesSchema),
    initialValues: {
      id: expenses.value?.id,
      rent: prismaDecimalToNumber(expenses.value?.rent),
      expenses: prismaDecimalToNumber(expenses.value?.expenses),
      water: prismaDecimalToNumber(expenses.value?.water),
      electricity: prismaDecimalToNumber(expenses.value?.electricity),
      gas: prismaDecimalToNumber(expenses.value?.gas),
      fuelOrOther: prismaDecimalToNumber(expenses.value?.fuelOrOther),
      // Impôts
      housingTax: prismaDecimalToNumber(expenses.value?.housingTax),
      propertyTax: prismaDecimalToNumber(expenses.value?.propertyTax),
      incomeTax: prismaDecimalToNumber(expenses.value?.incomeTax),

      // Assurances
      carInsurance: prismaDecimalToNumber(expenses.value?.carInsurance),
      homeInsurance: prismaDecimalToNumber(expenses.value?.homeInsurance),
      deathInsurance: prismaDecimalToNumber(expenses.value?.deathInsurance),
      retirementInsurance: prismaDecimalToNumber(
        expenses.value?.retirementInsurance
      ),
      otherInsurance: prismaDecimalToNumber(expenses.value?.otherInsurance),

      // Autres charges
      remittedAlimony: prismaDecimalToNumber(expenses.value?.remittedAlimony),
      healthInsurance: prismaDecimalToNumber(expenses.value?.healthInsurance),
      phoneInternet: prismaDecimalToNumber(expenses.value?.phoneInternet),
      schoolFees: prismaDecimalToNumber(expenses.value?.schoolFees),
      schoolCanteen: prismaDecimalToNumber(expenses.value?.schoolCanteen),
      other: prismaDecimalToNumber(expenses.value?.other),

      // Crédits et dettes
      loans: (expenses.value?.loans || []).map(loan => ({
        id: loan.id,
        type: loan.type,
        amountTotal: prismaDecimalToNumber(loan.amountTotal),
        amountPerMonth: prismaDecimalToNumber(loan.amountPerMonth),
        dueDate: loan.dueDate
      })),
      debts: (expenses.value?.debts || []).map(debt => ({
        id: debt.id,
        type: debt.type,
        amountTotal: prismaDecimalToNumber(debt.amountTotal),
        amountPerMonth: prismaDecimalToNumber(debt.amountPerMonth),
        dueDate: debt.dueDate
      }))
    }
  })

  const isFormDirty = computed(() => meta.value.dirty)

  const { isNavigatingWithFormActions } = useLeaveFormConfirmation({
    isFormDirty
  })

  const budgetTabRoute = routes.beneficiary.AppBeneficiary.path(beneficiaryId, {
    tab: BeneficiaryTab.Budget,
    originPage:
      route.name as typeof routes.budget.AppFileBudgetExpensesEdit.name
  })

  const onSubmit = handleSubmit(async values => {
    isNavigatingWithFormActions.value = true

    await useTrpcMutation({
      mutation: () => trpcClient.budget.updateExpenses.mutate(values),
      onSuccess: () => {
        navigateTo(budgetTabRoute)
        snackbar.success(
          'Les charges mensuelles ont été mises à jour avec succès'
        )
      },
      onFailure: () => {
        snackbar.error('La mise à jour des charges mensuelles a échoué.')
      }
    })
  })

  const mainExpensesTotal = computed(() =>
    budgetExpensesKeys.keys.reduce<number | null>(
      (acc, cur) =>
        incrementBudgetTotal(acc, expensesValues[cur as ExpensesKey]),
      null
    )
  )

  const loansTotal = computed(() =>
    expensesValues.loans.reduce<number | null>(
      (acc, cur) => incrementBudgetTotal(acc, cur.amountPerMonth),
      null
    )
  )

  const debtsTotal = computed(() =>
    expensesValues.debts.reduce<number | null>(
      (acc, cur) => incrementBudgetTotal(acc, cur.amountPerMonth),
      null
    )
  )

  const total = computed(() => {
    if (
      mainExpensesTotal.value === null &&
      loansTotal.value === null &&
      debtsTotal.value === null
    ) {
      return null
    }

    return (
      (mainExpensesTotal.value || 0) +
      (loansTotal.value || 0) +
      (debtsTotal.value || 0)
    )
  })

  function onCancel() {
    navigateTo(budgetTabRoute)
  }
</script>

<style scoped lang="scss">
  .expenses__total {
    display: flex;
    justify-content: space-between;
  }

  .expenses__total__value {
    color: var(--primary);
    font-weight: var(--bold);
  }
</style>
