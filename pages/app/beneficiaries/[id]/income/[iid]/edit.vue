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
        <AtomBreadcrumb
          :links="
            breadcrumbs.budget.AppBeneficiaryBudgetIncomeEdit(
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
            message="Veuillez répartir les ressources précedemment renseignées via l'ancienne section “Activité/Revenu” du formulaire bénéficiaire, sinon elles seront perdues :"
          >
            <template #detailedMessage>
              <p class="euro-symbol">{{ legacyResources }}</p>
            </template>
          </AtomAlert>

          <BudgetIncomeForm />
        </div>

        <section class="income__total">
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
  import { useBeneficiaryMinimalInfo } from '~/composables/useBeneficiaryMinimalInfo'
  import {
    UpdateBudgetIncomeInput,
    updateBudgetIncomeSchema
  } from '~/server/schema'
  import { prismaDecimalToNumber } from '~/utils/prisma'
  import {
    taxHouseHoldRelationshipKeys,
    incomeSourceKeys,
    budgetIncomeKeys
  } from '~/client/options'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { incomeHasBeenFilled, incrementBudgetTotal } from '~/utils/budget'
  import { euros } from '~/utils/euros'
  import { IncomeKey } from '~/types/budget'
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'

  const route = useRoute()
  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const beneficiaryId = route.params.id as string
  const incomeId = route.params.iid as string

  const title = routes.budget.AppBeneficiaryBudgetIncomeEdit.title

  useHead({ title })

  definePageMeta({
    name: routes.budget.AppBeneficiaryBudgetIncomeEdit.name
  })

  const {
    beneficiaryIdentification,
    pending: beneficiaryPending,
    error: beneficiaryError
  } = await useBeneficiaryMinimalInfo(beneficiaryId)

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

  const incomeIsFilled = computed(() =>
    income.value ? incomeHasBeenFilled(income.value) : false
  )

  /** Convert legacy income source (e.g. "Aah,PrimeActivite") into readable labels */
  function formatIncomeSource(incomeSource: string | null) {
    const sources = incomeSource
      ? incomeSource.replace(/[{}]/g, '').split(',')
      : []
    return sources
      .map(
        source =>
          incomeSourceKeys.byKey[source as keyof typeof incomeSourceKeys.byKey]
      )
      .join(', ')
  }

  const legacyResources = computed(() => {
    const budget = income.value?.budget
    if (!budget) {
      return null
    }

    if (incomeIsFilled.value) {
      return null
    }

    if (income.value?.type === 'Beneficiary') {
      const amount = prismaDecimalToNumber(budget.legacyMainIncomeAmount)
      return amount
        ? `${formatIncomeSource(budget.legacyMainIncomeSource) || budget.legacyMainIncomeSource} : ${amount}`
        : null
    }

    const relationship = income.value?.householdMember?.relationship
    if (relationship === 'Conjoint') {
      const amount = prismaDecimalToNumber(budget.legacyPartnerMainIncomeAmount)
      return amount
        ? `${formatIncomeSource(budget.legacyPartnerMainIncomeSource) || budget.legacyPartnerMainIncomeSource} : ${amount}`
        : null
    }

    if (relationship === 'EnfantMajeur') {
      const amount = prismaDecimalToNumber(
        budget.legacyMajorChildrenMainIncomeAmount
      )
      return amount
        ? `${formatIncomeSource(budget.legacyMajorChildrenMainIncomeSource) || budget.legacyMajorChildrenMainIncomeSource} : ${amount}`
        : null
    }

    const amount = prismaDecimalToNumber(
      budget.legacyOtherMembersMainIncomeAmount
    )

    return amount
      ? `${formatIncomeSource(budget.legacyOtherMembersMainIncomeSource) || budget.legacyOtherMembersMainIncomeSource} : ${amount}`
      : null
  })

  const {
    handleSubmit,
    meta,
    isSubmitting,
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

  const budgetTabRoute = routes.beneficiary.AppBeneficiary.path(beneficiaryId, {
    tab: BeneficiaryTab.Budget,
    originPage:
      route.name as typeof routes.budget.AppBeneficiaryBudgetIncomeEdit.name
  })

  const onSubmit = handleSubmit(async values => {
    isNavigatingWithFormActions.value = true

    await useTrpcMutation({
      mutation: () => trpcClient.budget.updateIncome.mutate(values),
      onSuccess: () => {
        navigateTo(budgetTabRoute)
        snackbar.success('Les revenus mensuels ont été mis à jour avec succès')
      },
      onFailure: () => {
        snackbar.error('La mise à jour des revenus mensuels a échoué.')
      }
    })
  })

  const total = computed(() =>
    budgetIncomeKeys.keys.reduce<number | null>(
      (acc, cur) => incrementBudgetTotal(acc, incomeValues[cur as IncomeKey]),
      null
    )
  )

  function onCancel() {
    navigateTo(budgetTabRoute)
  }
</script>

<style scoped lang="scss">
  .income__total {
    display: flex;
    justify-content: space-between;
  }

  .income__total__value {
    color: var(--primary);
    font-weight: var(--bold);
  }
</style>
