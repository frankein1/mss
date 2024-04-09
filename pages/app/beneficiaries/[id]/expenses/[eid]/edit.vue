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
        <DsfrBreadcrumb
          :links="
            Breadcrumb.AppBeneficiaryBudgetExpensesEdit(
              beneficiaryIdentification,
              expensesId
            )
          "
        />

        <PageTitle
          :title="title"
          pictogram-path="/pictograms/money.svg"
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

        <BudgetExpensesForm v-else-if="expenses" />

        <section class="expenses__total">
          <h2 class="fr-h4 fr-m-0">Total :</h2>
          <span class="fr-h4 fr-m-0 expenses__total__value">{{
            total || '0'
          }}</span>
        </section>
      </div>
    </main>

    <BudgetActionBar
      :is-submitting="isSubmitting"
      has-secondary-action
      confirm-secondary-label="Enregistrer"
      @cancel="() => {}"
    />
  </form>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'
  import { Breadcrumb, RouteTitle, RoutePath } from '~/utils/routing'
  import { useBeneficiarySummary } from '~/composables/useBeneficiarySummary'
  import {
    UpdateBudgetExpensesInput,
    updateBudgetExpensesSchema
  } from '~/server/schema'
  import { prismaDecimalToNumber } from '~/utils/prisma'

  const route = useRoute()
  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const beneficiaryId = route.params.id as string
  const expensesId = route.params.eid as string

  const title = RouteTitle.AppBeneficiaryBudgetExpensesEdit()

  useHead({ title })

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

  const form = ref<HTMLFormElement | null>(null)
  const isSubmitting = ref(false)

  const {
    handleSubmit,
    meta,
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

      // Autres charges
      remittedAlimony: prismaDecimalToNumber(expenses.value?.remittedAlimony),
      healthInsurance: prismaDecimalToNumber(expenses.value?.healthInsurance),
      phoneInternet: prismaDecimalToNumber(expenses.value?.phoneInternet),
      insurance: prismaDecimalToNumber(expenses.value?.insurance),
      carInsurance: prismaDecimalToNumber(expenses.value?.carInsurance),
      schoolFees: prismaDecimalToNumber(expenses.value?.schoolFees),
      schoolCanteen: prismaDecimalToNumber(expenses.value?.schoolCanteen),
      other: prismaDecimalToNumber(expenses.value?.other),

      // Crédits et dettes
      debts: prismaDecimalToNumber(expenses.value?.debts),
      loans: prismaDecimalToNumber(expenses.value?.loans)
    }
  })

  const isFormDirty = computed(() => meta.value.dirty)

  const { isNavigatingWithFormActions } = useLeaveFormConfirmation({
    isFormDirty
  })

  const onSubmit = handleSubmit(async values => {
    isNavigatingWithFormActions.value = true

    await useTrpcMutation({
      mutation: () => trpcClient.budget.updateExpenses.mutate(values),
      onSuccess: () => {
        navigateTo(RoutePath.AppBeneficiary(beneficiaryId))
        snackbar.success(
          'Les charges mensuelles ont été mises à jour avec succès'
        )
      },
      onFailure: () => {
        snackbar.error('La mise à jour des charges mensuelles a échoué.')
      }
    })
  })

  const total = computed(() => {
    return Object.values(expensesValues).reduce<number>((acc, cur) => {
      const expense = typeof cur === 'string' ? 0 : cur || 0
      return acc + expense
    }, 0)
  })
</script>

<style scoped lang="scss">
  @use '~/assets/style/variables' as *;

  $actions-bar-height: 6.0625rem;

  .content {
    height: calc(100vh - #{$actions-bar-height} - #{$top-bar-height});
    overflow-y: auto;
  }

  .expenses__total {
    display: flex;
    justify-content: space-between;
  }

  .expenses__total__value {
    color: var(--primary);
    font-weight: var(--bold);

    &::after {
      content: '\00a0€';
    }
  }
</style>
