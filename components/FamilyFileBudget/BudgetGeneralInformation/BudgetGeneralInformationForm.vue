<template>
  <section class="feature-section fr-container">
    <div class="fr-grid-row fr-grid-row--gutters fr-p-5w">
      <div class="fr-col-12 fr-py-0">
        <h2 class="fr-h5 fr-mb-1w">Reste à vivre</h2>

        <p class="grey fr-m-0">
          Calcul automatique : revenus moins charges divisé par le nombre de
          personnes dans le foyer
        </p>
      </div>

      <div class="fr-col-6">
        <VeeInput
          type="number"
          name="numberHouseholdMembers"
          label="Nombre de personnes dans le foyer"
        />
      </div>

      <div class="fr-col-6">
        <VeeCurrencyInput
          name="remainingAfterExpenses"
          label="Reste à vivre"
          disabled
        />
      </div>

      <div class="fr-col-12">
        <hr class="separator" />
      </div>

      <div class="fr-col-12 fr-mb-2w">
        <VeeCurrencyInput
          name="savings"
          label="Epargne"
        />
      </div>

      <div class="fr-col-12 fr-mb-2w">
        <VeeCurrencyInput
          name="overdraft"
          label="Découvert bancaire"
        />
      </div>

      <div class="fr-col-12 fr-mb-2w">
        <VeeCurrencyInput
          name="banqueDeFrance"
          label="Banque de France"
        />
      </div>

      <div class="fr-col-12">
        <VeeInput
          type="number"
          name="familyQuotient"
          label="Quotient familial"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
  .separator {
    height: 0.0625rem;
    background-color: var(--border-default-grey);
    padding: 0;
    margin: 1.5rem 0;
  }

  .grey {
    color: var(--text-mention-grey);
  }

  .disabled {
    color: var(--text-mention-grey);
  }
</style>
