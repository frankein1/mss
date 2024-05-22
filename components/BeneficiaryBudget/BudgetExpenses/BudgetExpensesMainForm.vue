<template>
  <section class="feature-section fr-container fr-p-5w fr-mb-3w">
    <h2 class="fr-h2 primary">Charges principales</h2>

    <section class="fr-grid-row fr-grid-row--gutters">
      <h3 class="fr-h5 fr-m-0 fr-col-12">Logement</h3>

      <div class="fr-col-6">
        <VeeCurrencyInput
          name="rent"
          :label="budgetExpensesKeys.byKey.rent"
        />
      </div>

      <div class="fr-col-6">
        <VeeCurrencyInput
          name="expenses"
          :label="budgetExpensesKeys.byKey.expenses"
        />
      </div>

      <div class="fr-col-6">
        <VeeCurrencyInput
          name="water"
          :label="budgetExpensesKeys.byKey.water"
        />
      </div>

      <div class="fr-col-6">
        <VeeCurrencyInput
          name="electricity"
          :label="budgetExpensesKeys.byKey.electricity"
        />
      </div>

      <div class="fr-col-6">
        <VeeCurrencyInput
          name="gas"
          :label="budgetExpensesKeys.byKey.gas"
        />
      </div>

      <div class="fr-col-6">
        <VeeCurrencyInput
          name="fuelOrOther"
          :label="budgetExpensesKeys.byKey.fuelOrOther"
        />
      </div>
    </section>

    <hr class="separator" />

    <section class="fr-grid-row fr-grid-row--gutters">
      <h3 class="fr-h5 fr-m-0 fr-col-12">Impôts</h3>

      <div class="fr-col-6">
        <VeeCurrencyInput
          name="housingTax"
          :label="budgetExpensesKeys.byKey.housingTax"
        />
      </div>

      <div class="fr-col-6">
        <VeeCurrencyInput
          name="propertyTax"
          :label="budgetExpensesKeys.byKey.propertyTax"
        />
      </div>

      <div class="fr-col-12">
        <VeeCurrencyInput
          name="incomeTax"
          :label="budgetExpensesKeys.byKey.incomeTax"
        />
      </div>
    </section>

    <hr class="separator" />

    <section class="fr-grid-row fr-grid-row--gutters">
      <h3 class="fr-h5 fr-m-0 fr-col-12">Autres charges</h3>

      <div class="fr-col-12">
        <VeeCurrencyInput
          name="remittedAlimony"
          :label="budgetExpensesKeys.byKey.remittedAlimony"
        />
      </div>

      <div class="fr-col-12">
        <VeeCurrencyInput
          name="healthInsurance"
          :label="budgetExpensesKeys.byKey.healthInsurance"
        />
      </div>

      <div class="fr-col-12">
        <VeeCurrencyInput
          name="phoneInternet"
          :label="budgetExpensesKeys.byKey.phoneInternet"
        />
      </div>

      <div class="fr-col-6">
        <VeeCurrencyInput
          name="insurance"
          :label="budgetExpensesKeys.byKey.insurance"
        />
      </div>

      <div class="fr-col-6">
        <VeeCurrencyInput
          name="carInsurance"
          :label="budgetExpensesKeys.byKey.carInsurance"
        />
      </div>

      <div class="fr-col-6">
        <VeeCurrencyInput
          name="schoolFees"
          :label="budgetExpensesKeys.byKey.schoolFees"
        />
      </div>

      <div class="fr-col-6">
        <VeeCurrencyInput
          name="schoolCanteen"
          :label="budgetExpensesKeys.byKey.schoolCanteen"
        />
      </div>

      <div class="fr-col-12">
        <VeeCurrencyInput
          name="other"
          :label="budgetExpensesKeys.byKey.other"
        />
      </div>

      <div class="fr-col-6">
        <VeeCurrencyInput
          name="debts"
          :label="budgetExpensesKeys.byKey.debts"
        />
      </div>
    </section>

    <section class="subtotal fr-h4 fr-mt-3w">
      <span>Sous-total charges principales</span>
      <span class="primary"> total €</span>
    </section>
  </section>
</template>

<script setup lang="ts">
  import { budgetExpensesKeys } from '~/client/options'
</script>

<style scoped>
  .separator {
    height: 0.0625rem;
    background-color: var(--border-default-grey);
    padding: 0;
    margin: 2rem 0;
  }

  .subtotal {
    display: flex;
    justify-content: space-between;
    align-content: center;
  }

  .primary {
    color: var(--primary);
  }
</style>
