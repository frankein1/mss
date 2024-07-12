<template>
  <article>
    <div class="beneficiary-budget__title">
      <AtomPictogram path="/pictograms/money.svg" />
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
              :incomes="data.incomes"
              :budget-id="data.id"
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
  </article>
</template>

<script lang="ts" setup>
  import { AlertType } from '~/utils/constants/alert'
  import { BeneficiaryIdentification } from '~/types/beneficiary'

  const props = defineProps<{
    familyFileId: string
    beneficiaryIdentification: BeneficiaryIdentification
  }>()

  const trpcClient = useTrpcClient()

  const { data, pending, error } = await trpcClient.budget.getBudget.useQuery({
    familyFileId: props.familyFileId
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
