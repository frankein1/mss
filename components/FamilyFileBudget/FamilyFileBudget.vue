<template>
  <article>
    <div class="beneficiary-budget__title">
      <AtomPictogram path="/pictograms/money.svg" />
      <h2 class="fr-m-0">Budget mensuel du foyer fiscal</h2>
    </div>

    <AtomLazyComponent
      :pending
      :error="Boolean(error)"
      message="Le budget du foyer n'a pas pu être chargé"
    >
      <div v-if="data">
        <BudgetGeneralInformation :budget="data" />

        <div class="fr-container--fluid fr-mt-5w">
          <div class="fr-grid-row fr-grid-row--gutters">
            <div class="fr-col-6">
              <BudgetIncomes
                v-if="data.incomes"
                :family-file-id="familyFileId"
                :incomes="data.incomes"
                :budget-id="data.id"
                :family-file-identification="familyFileIdentification"
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
    </AtomLazyComponent>
  </article>
</template>

<script lang="ts" setup>
  import { BeneficiaryFileIdentification } from '~/types/beneficiary'

  const props = defineProps<{
    familyFileId: string
    familyFileIdentification: BeneficiaryFileIdentification[]
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
