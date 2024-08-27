<template>
  <article>
    <div class="beneficiary-budget__title">
      <AtomPictogram path="/pictograms/money.svg" />
      <p class="fr-text--xxl fr-text--bold fr-m-0">
        Budget mensuel du foyer fiscal
      </p>
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
              :family-file-id="familyFileId"
              :incomes="data.incomes"
              :budget-id="data.id"
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
  </article>
</template>

<script lang="ts" setup>
  import { AlertType } from '~/utils/constants/alert'

  const props = defineProps<{
    familyFileId: string
  }>()

  const trpcClient = useTrpcClient()

  const { data, pending, error } = await trpcClient.budget.getBudget.useQuery({
    familyFileId: props.familyFileId
  })
</script>

<style lang="scss" scoped>
  .beneficiary-budget__title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--primary);
    margin-bottom: 1.25rem;

    p {
      font-size: 2rem;
      line-height: 2rem;
    }
  }
</style>
