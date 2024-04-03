<template>
  <section class="feature-section fr-container">
    <div class="fr-grid-row fr-grid-row--gutters fr-p-5w">
      <div class="fr-col-12">
        <VeeCurrencyInput
          name="remainingAfterExpenses"
          label="Reste à vivre"
        />
      </div>

      <div class="fr-col-12">
        <VeeCurrencyInput
          name="overdraft"
          label="Découvert bancaire"
        />
      </div>

      <div class="fr-col-12">
        <VeeCurrencyInput
          name="savings"
          label="Info épargne"
        />
      </div>

      <div class="fr-col-12">
        <VeeCurrencyInput
          name="familyQuotient"
          label="Quotient familial"
        />
      </div>
    </div>
  </section>
</template>
