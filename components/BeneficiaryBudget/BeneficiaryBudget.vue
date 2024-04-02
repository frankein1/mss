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
    <BudgetGeneralInformation
      :beneficiary-id="beneficiaryId"
      :budget-id="data.id"
    />

    <div class="fr-container--fluid fr-mt-5w">
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-6">
          <!-- <BudgetIncomes /> -->
        </div>

        <div class="fr-col-6">
          <AtomLoader
            v-if="p"
            class="fr-mx-auto"
          />
          <AtomAlert
            v-else-if="e"
            :alert-type="AlertType.Error"
            :message="`${e}`"
          />
          <BudgetExpenses
            v-else-if="budget && budget.expenses"
            :beneficiary-id="beneficiaryId"
            :expenses="budget.expenses"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { AlertType } from '~/utils/constants/alert'

  const props = defineProps<{ beneficiaryId: string }>()

  const trpcClient = useTrpcClient()

  const { data, pending, error } = await trpcClient.budget.getBudgetId.useQuery(
    { beneficiaryId: props.beneficiaryId }
  )

  const {
    data: budget,
    pending: p,
    error: e
  } = await trpcClient.budget.getBudget.useQuery({ id: data?.value?.id || '' })
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
