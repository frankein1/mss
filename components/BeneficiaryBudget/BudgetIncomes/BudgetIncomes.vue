<template>
  <div class="card card--deep-blue fr-mb-2w">
    <h3 class="fr-h6 fr-m-0">Revenus du foyer fiscal</h3>
    <span
      class="fr-h4 fr-m-0"
      :class="{ 'euro-symbol': total !== null }"
      >{{ total !== null ? euros(total) : '-' }}</span
    >
  </div>

  <section
    v-for="(income, idxIncome) in incomes"
    :key="idxIncome"
    class="card-outline card-outline--deep-blue fr-mb-2w"
  >
    <div class="budget-income__title">
      <h4 class="fr-text--lead fr-m-0">{{ memberNames[idxIncome] }}</h4>
      <span
        class="fr-h6 fr-m-0"
        :class="{ 'euro-symbol': memberTotalIncomes[idxIncome] !== null }"
        >{{
          memberTotalIncomes[idxIncome] !== null
            ? euros(memberTotalIncomes[idxIncome])
            : '-'
        }}</span
      >
    </div>

    <ul class="list-styled">
      <li
        v-for="(category, idxCategory) in nonZeroIncomeKeys[idxIncome]"
        :key="idxCategory"
      >
        <span>{{ budgetIncomeKeys.value(category) }}</span>
        <span class="budget-income__item__value euro-symbol">{{
          euros(income[category as IncomeKey])
        }}</span>
      </li>
    </ul>

    <div class="budget-income__action">
      <NuxtLink
        :to="
          routes.budget.AppBeneficiaryBudgetIncomeEdit.path(
            beneficiaryIdentification.id,
            income.id
          )
        "
        class="fr-btn fr-btn--tertiary-no-outline fr-icon-edit-line"
        title="Modifier"
      >
      </NuxtLink>
    </div>
  </section>

  <section>
    <BudgetIncomesAddMember
      :budget-id="budgetId"
      :beneficiary-id="beneficiaryIdentification.id"
    />
  </section>
</template>

<script lang="ts" setup>
  import { routes } from '~/utils/routes'
  import {
    taxHouseHoldRelationshipKeys,
    budgetIncomeKeys
  } from '~/client/options'
  import { IncomeKey, GetBudgetIncomeHouseholdMember } from '~/types/budget'
  import { prismaDecimalToNumber } from '~/utils/prisma'
  import { BeneficiaryIdentification } from '~/types/beneficiary'
  import { incrementBudgetTotal } from '~/utils/budget'
  import { euros } from '~/utils/euros'

  const props = defineProps<{
    beneficiaryIdentification: BeneficiaryIdentification
    budgetId: string
    incomes: GetBudgetIncomeHouseholdMember[]
  }>()

  const memberNames = computed(() =>
    props.incomes.map((income, index) => {
      if (income.type === 'Beneficiary') {
        return `Revenus - ${props.beneficiaryIdentification.firstName} ${props.beneficiaryIdentification.usualName}`
      }

      const member = income.householdMember
      return member && (member.firstName || member.lastName)
        ? `${member.firstName || ''} ${member.lastName || ''} - ${taxHouseHoldRelationshipKeys.value(member.relationship) || 'Membre du foyer'}`
        : `Membre du foyer ${index}`
    })
  )

  const nonZeroIncomeKeys = computed(() =>
    props.incomes.map(income =>
      budgetIncomeKeys.keys.filter(
        key => (prismaDecimalToNumber(income[key as IncomeKey]) || 0) > 0
      )
    )
  )

  const memberTotalIncomes = computed(() =>
    props.incomes.map((income, index) =>
      nonZeroIncomeKeys.value[index].reduce<number | null>(
        (acc, cur) => incrementBudgetTotal(acc, income[cur as IncomeKey]),
        null
      )
    )
  )

  const total = computed(() =>
    memberTotalIncomes.value.reduce(
      (acc, cur) => incrementBudgetTotal(acc, cur),
      null
    )
  )
</script>

<style scoped lang="scss">
  @use '~/assets/style/card' as *;
  @use '~/assets/style/list' as *;

  .budget-income__title {
    display: flex;
    justify-content: space-between;
  }

  .budget-income__item__value {
    font-weight: var(--bold);
  }

  .budget-income__action {
    display: flex;
    justify-content: flex-end;

    > .fr-btn {
      color: var(--deep-blue);
    }
  }
</style>
