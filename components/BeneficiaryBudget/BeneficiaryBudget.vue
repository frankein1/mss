<template>
  <div class="beneficiary-budget__title">
    <img
      src="/pictograms/money.svg"
      class="img"
      alt=""
    />
    <h2 class="fr-m-0">Budget mensuel du foyer fiscal</h2>
  </div>

  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    :message="`${error}`"
  />
  <div v-else-if="data">
    <BudgetGeneralInformation :budget="data" />

    <div class="fr-container--fluid fr-mt-5w">
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-6">
          <BudgetIncomes
            v-if="data.incomes"
            :beneficiary-identification="beneficiaryIdentification"
            :household-members="householdMembers"
            :incomes="data.incomes"
          />
        </div>

        <div class="fr-col-6">
          <BudgetExpenses
            v-if="data.expenses"
            :beneficiary-id="beneficiaryIdentification.id"
            :expenses="data.expenses"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { AlertType } from '~/utils/constants/alert'
  import {
    BeneficiaryIdentification,
    GetBeneficiaryRelative
  } from '~/types/beneficiary'

  const props = defineProps<{
    beneficiaryIdentification: BeneficiaryIdentification
    taxHousehold: GetBeneficiaryRelative[]
  }>()

  const trpcClient = useTrpcClient()

  const { data, pending, error } = await trpcClient.budget.getBudget.useQuery({
    beneficiaryId: props.beneficiaryIdentification.id
  })

  const householdMembers = computed(() => {
    return props.taxHousehold.reduce<Record<string, GetBeneficiaryRelative>>(
      (acc, cur) => {
        if (cur.hosted) {
          acc[cur.id] = { ...cur }
        }
        return acc
      },
      {}
    )
  })
</script>

<style scoped>
  .beneficiary-budget__title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--primary);
    margin-bottom: 1.25rem;

    > h2 {
      color: var(--primary);
    }
  }
</style>
