<template>
  <div class="feature-section fr-container fr-p-5w fr-mb-3w">
    <section class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-6">
        <VeeCurrencyInput
          name="salary"
          :label="budgetIncomeKeys.byKey.salary"
        />
      </div>

      <div class="fr-col-6">
        <VeeCurrencyInput
          name="primeActivite"
          :label="budgetIncomeKeys.byKey.primeActivite"
        />
      </div>
    </section>

    <hr class="separator" />

    <section class="fr-grid-row fr-grid-row--gutters">
      <h2 class="fr-h5 fr-m-0 fr-col-12">Pensions</h2>

      <div class="fr-col-6">
        <VeeCurrencyInput
          name="retirement"
          :label="budgetIncomeKeys.byKey.retirement"
        />
      </div>

      <div class="fr-col-6">
        <VeeCurrencyInput
          name="alimony"
          :label="budgetIncomeKeys.byKey.alimony"
        />
      </div>

      <div class="fr-col-12">
        <VeeCurrencyInput
          name="disability"
          :label="budgetIncomeKeys.byKey.disability"
        />
      </div>
    </section>

    <hr class="separator" />

    <section class="fr-grid-row fr-grid-row--gutters">
      <h2 class="fr-h5 fr-m-0 fr-col-12">Allocations</h2>

      <div class="fr-col-6">
        <VeeCurrencyInput
          name="unemployment"
          :label="budgetIncomeKeys.byKey.unemployment"
        />
      </div>

      <div class="fr-col-6">
        <VeeCurrencyInput
          name="ass"
          :label="budgetIncomeKeys.byKey.ass"
        />
      </div>

      <div class="fr-col-6">
        <VeeCurrencyInput
          name="rsa"
          :label="budgetIncomeKeys.byKey.rsa"
        />
      </div>

      <div class="fr-col-6">
        <VeeCurrencyInput
          name="apl"
          :label="budgetIncomeKeys.byKey.apl"
        />
      </div>

      <div class="fr-col-6">
        <VeeCurrencyInput
          name="family"
          :label="budgetIncomeKeys.byKey.family"
        />
      </div>

      <div class="fr-col-6">
        <VeeCurrencyInput
          name="aah"
          :label="budgetIncomeKeys.byKey.aah"
        />
      </div>

      <div class="fr-col-12">
        <VeeCurrencyInput
          name="aspa"
          :label="budgetIncomeKeys.byKey.aspa"
        />
      </div>
    </section>

    <hr class="separator" />

    <section class="fr-grid-row fr-grid-row--gutters">
      <h2 class="fr-h5 fr-m-0 fr-col-12">Autres ressources</h2>

      <div class="fr-col-6">
        <VeeCurrencyInput
          name="dailyAllowance"
          :label="budgetIncomeKeys.byKey.dailyAllowance"
        />
      </div>

      <div class="fr-col-6">
        <VeeCurrencyInput
          name="annuity"
          :label="budgetIncomeKeys.byKey.annuity"
        />
      </div>

      <div class="fr-col-12">
        <VeeCurrencyInput
          name="other"
          :label="budgetIncomeKeys.byKey.other"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { budgetIncomeKeys } from '~/client/options'
</script>

<style scoped>
  .separator {
    height: 0.0625rem;
    background-color: var(--border-default-grey);
    padding: 0;
    margin: 2rem 0;
  }
</style>
