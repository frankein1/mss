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
            Breadcrumb.AppBeneficiaryBudgetIncomeEdit(
              beneficiaryIdentification,
              incomeId
            )
          "
        />

        <PageTitle
          :title="title"
          pictogram-path="/pictograms/money.svg"
          pictogram-background
          :subtitle="subtitle"
        />

        <AtomLoader
          v-if="pending"
          class="fr-mx-auto"
        />

        <AtomAlert
          v-else-if="error"
          :alert-type="AlertType.Error"
          message="Le revenu mensuel n'a pas pu être chargé."
        />

        <div v-else-if="income">
          <AtomAlert
            v-if="legacyResources"
            class="fr-mb-4w"
            :alert-type="AlertType.Warning"
            message="Veuillez répartir les ressources renseignées via la section “Activité/Revenu” du formulaire bénéficiaire, sinon elles seront perdues :"
          >
            <template #detailedMessage>
              <p class="euro-symbol">{{ legacyResources }}</p>
            </template>
          </AtomAlert>

          <BudgetIncomeForm />
        </div>

        <section class="income__total">
          <h2 class="fr-h4 fr-m-0">Total :</h2>
          <span class="fr-h4 fr-m-0 income__total__value">{{
            total || '0'
          }}</span>
        </section>
      </div>
    </main>

    <BudgetActionBar
      :is-submitting="isSubmitting"
      has-secondary-action
      confirm-secondary-label="Enregistrer"
      @cancel="onCancel"
    />
  </form>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'
  import { Breadcrumb, RouteTitle, RoutePath, Route } from '~/utils/routing'
  import { useBeneficiarySummary } from '~/composables/useBeneficiarySummary'
  import {
    UpdateBudgetIncomeInput,
    updateBudgetIncomeSchema
  } from '~/server/schema'
  import { prismaDecimalToNumber } from '~/utils/prisma'
  import {
    taxHouseHoldRelationshipKeys,
    budgetIncomeKeys
  } from '~/client/options'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { IncomeKey } from '~/types/budget'
  const route = useRoute()
  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const beneficiaryId = route.params.id as string
  const incomeId = route.params.iid as string

  const title = RouteTitle.AppBeneficiaryBudgetIncomeEdit()

  useHead({ title })

  definePageMeta({
    name: Route.AppBeneficiaryBudgetIncomeEdit
  })

  const {
    beneficiaryIdentification,
    pending: beneficiaryPending,
    error: beneficiaryError
  } = await useBeneficiarySummary(beneficiaryId)

  const {
    data: income,
    pending,
    error
  } = await trpcClient.budget.getIncome.useQuery({ id: incomeId })

  const subtitle = computed(() => {
    if (income.value?.type === 'Beneficiary') {
      return `de ${beneficiaryIdentification.value?.firstName || ''} ${beneficiaryIdentification.value?.usualName || ''}`
    }

    const member = income.value?.householdMember
    return member && (member.firstName || member.lastName)
      ? `de ${member.firstName || ''} ${member.lastName || ''}  - ${taxHouseHoldRelationshipKeys.value(member.relationship) || 'Membre du foyer'}`
      : `Membre du foyer`
  })

  const incomeHasBeenFilled = computed(() => {
    return budgetIncomeKeys.keys.some(key => {
      const incomeSource = income.value?.[key as IncomeKey]
      return incomeSource !== null && incomeSource !== undefined
    })
  })

  const legacyResources = computed(() => {
    const budget = income.value?.budget
    if (!budget) {
      return null
    }

    if (incomeHasBeenFilled.value) {
      return null
    }

    if (income.value?.type === 'Beneficiary') {
      const amount = prismaDecimalToNumber(budget.legacyMainIncomeAmount)
      return amount
        ? `${budget.legacyMainIncomeSource || ''} : ${amount}`
        : null
    }

    const relationship = income.value?.householdMember?.relationship
    if (
      relationship === 'Conjoint' &&
      budget.legacyPartnerMainIncomeAmount?.gt(0)
    ) {
      return `${budget.legacyPartnerMainIncomeSource || ''} : ${budget.legacyPartnerMainIncomeAmount.toString()}`
    }
    if (
      relationship === 'EnfantMajeur' &&
      budget.legacyMajorChildrenMainIncomeAmount?.gt(0)
    ) {
      return `${budget.legacyMajorChildrenMainIncomeSource || ''} : ${budget.legacyMajorChildrenMainIncomeAmount.toString()}`
    }

    return null
  })

  const form = ref<HTMLFormElement | null>(null)
  const isSubmitting = ref(false)

  const {
    handleSubmit,
    meta,
    values: incomeValues
  } = useForm<UpdateBudgetIncomeInput>({
    validationSchema: toTypedSchema(updateBudgetIncomeSchema),
    initialValues: {
      id: income.value?.id,
      salary: prismaDecimalToNumber(income.value?.salary),
      primeActivite: prismaDecimalToNumber(income.value?.primeActivite),

      // Pensions
      retirement: prismaDecimalToNumber(income.value?.retirement),
      alimony: prismaDecimalToNumber(income.value?.alimony),
      disability: prismaDecimalToNumber(income.value?.disability),

      // Allocations
      unemployment: prismaDecimalToNumber(income.value?.unemployment),
      ass: prismaDecimalToNumber(income.value?.ass),
      rsa: prismaDecimalToNumber(income.value?.rsa),
      apl: prismaDecimalToNumber(income.value?.apl),
      family: prismaDecimalToNumber(income.value?.family),
      aah: prismaDecimalToNumber(income.value?.aah),
      aspa: prismaDecimalToNumber(income.value?.aspa),

      // Autre ressources
      dailyAllowance: prismaDecimalToNumber(income.value?.dailyAllowance),
      annuity: prismaDecimalToNumber(income.value?.annuity),
      other: prismaDecimalToNumber(income.value?.other)
    }
  })

  const isFormDirty = computed(() => meta.value.dirty)

  const { isNavigatingWithFormActions } = useLeaveFormConfirmation({
    isFormDirty
  })

  const onSubmit = handleSubmit(async values => {
    isNavigatingWithFormActions.value = true

    await useTrpcMutation({
      mutation: () => trpcClient.budget.updateIncome.mutate(values),
      onSuccess: () => {
        navigateTo(RoutePath.AppBeneficiary(beneficiaryId))
        snackbar.success('Les revenus mensuels ont été mis à jour avec succès')
      },
      onFailure: () => {
        snackbar.error('La mise à jour des revenus mensuels a échoué.')
      }
    })
  })

  const total = computed(() => {
    return Object.values(incomeValues).reduce<number>((acc, cur) => {
      const income = typeof cur === 'string' ? 0 : cur || 0
      return acc + income
    }, 0)
  })

  function onCancel() {
    navigateTo(
      RoutePath.AppBeneficiary(beneficiaryId, {
        tab: BeneficiaryTab.Budget,
        originPage: route.name as Route.AppBeneficiaryBudgetIncomeEdit
      })
    )
  }
</script>

<style scoped lang="scss">
  @use '~/assets/style/variables' as *;

  $actions-bar-height: 6.0625rem;

  .content {
    height: calc(100vh - #{$actions-bar-height} - #{$top-bar-height});
    overflow-y: auto;
  }

  .income__total {
    display: flex;
    justify-content: space-between;
  }

  .income__total__value {
    color: var(--primary);
    font-weight: var(--bold);

    // TODO use euro-symbol
    &::after {
      content: '\00a0€';
    }
  }
</style>
