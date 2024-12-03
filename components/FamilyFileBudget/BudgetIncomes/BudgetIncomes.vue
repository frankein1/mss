<template>
  <div class="card card--deep-blue fr-mb-2w">
    <h3 class="fr-h6 fr-m-0">Revenus du foyer fiscal</h3>
    <span class="fr-h4 fr-m-0 euro-symbol">{{ euros(total) }}</span>
  </div>

  <BudgetCard
    v-for="(income, idxIncome) in incomes"
    :key="idxIncome"
    class="fr-mb-2w"
    color="deep-blue"
    :title="memberNames[idxIncome]"
    :total="
      memberDefaultIncomes[idxIncome] + getMemberTotalCustomIncome(income)
    "
    :items="getIncome(income)"
    :edit-route="
      routes.budget.AppFileBudgetIncomeEdit.path(familyFileId, income.id)
    "
  />

  <section>
    <BudgetIncomesAddMember
      :family-file-id="familyFileId"
      :budget-id="budgetId"
      :family-file-identification="filterdFamilifileIdentitfication"
    />
  </section>
</template>

<script lang="ts" setup>
  import { routes } from '~/utils/routes'
  import { budgetIncomeKeys } from '~/client/options'
  import { IncomeKey, GetBudgetIncomeHouseholdMember } from '~/types/budget'
  import { prismaDecimalToNumber } from '~/utils/prisma'
  import { formatBudgetMemberLabel, incrementBudgetTotal } from '~/utils/budget'
  import { euros } from '~/utils/euros'
  import { BeneficiaryFileIdentification } from '~/types/beneficiary'

  const props = defineProps<{
    familyFileId: string
    budgetId: string
    incomes: GetBudgetIncomeHouseholdMember[]
    familyFileIdentification: BeneficiaryFileIdentification[]
  }>()

  const getIncome = (income: GetBudgetIncomeHouseholdMember) => {
    const keys = budgetIncomeKeys.keys.filter(
      key => (prismaDecimalToNumber(income[key as IncomeKey]) || 0) > 0
    )
    const regularIncome = keys.map(key => {
      return {
        key: key,
        label: budgetIncomeKeys.value(key) || '',
        amount: (income[key as IncomeKey] || 0) as number
      }
    })

    const customIncome = income.customs.map(custom => ({
      key: custom.id,
      label: custom.type || '',
      amount: Number(custom.amount) || 0
    }))

    return [...regularIncome, ...customIncome]
  }

  const memberNames = computed(() =>
    props.incomes.map(income => {
      return formatBudgetMemberLabel(income)
    })
  )

  const filterdFamilifileIdentitfication = computed(() => {
    return props.familyFileIdentification.filter(
      beneficiary =>
        !props.incomes.some(income => income.beneficiaryId === beneficiary.id)
    )
  })

  const nonZeroIncomeKeys = computed(() =>
    props.incomes.map(income =>
      budgetIncomeKeys.keys.filter(
        key => (prismaDecimalToNumber(income[key as IncomeKey]) || 0) > 0
      )
    )
  )

  const memberDefaultIncomes = computed(() =>
    props.incomes.map(
      (income, index) =>
        nonZeroIncomeKeys.value[index].reduce<number | null>(
          (acc, cur) => incrementBudgetTotal(acc, income[cur as IncomeKey]),
          null
        ) || 0
    )
  )

  const getMemberTotalCustomIncome = (
    income: GetBudgetIncomeHouseholdMember
  ) => {
    return (
      income.customs.reduce<number | null>(
        (acc, cur) => incrementBudgetTotal(acc, cur.amount),
        null
      ) || 0
    )
  }

  const total = computed(() => {
    let subTotal = 0
    props.incomes.forEach((income, idxIncome) => {
      subTotal =
        subTotal +
        memberDefaultIncomes.value[idxIncome] +
        getMemberTotalCustomIncome(income)
    })
    return subTotal
  })
</script>

<style scoped lang="scss">
  @use '~/assets/style/card' as *;
</style>
