<template>
  <fieldset class="fr-fieldset fr-container--fluid relatives-fieldset">
    <legend class="fr-fieldset__legend--regular fr-fieldset__legend">
      <h3 class="fr-h5">Situation du foyer fiscal</h3>
    </legend>
    <div class="fr-grid-row fr-grid-row--gutters form-grid">
      <div class="fr-fieldset__element">
        <VeeSelect
          name="taxHousehold.familySituation"
          label="Situation familiale"
          :options="withEmptyValue(beneficiaryFamilySituationOptions)"
        />
      </div>
      <div class="fr-fieldset__element">
        <VeeInput
          name="taxHousehold.minorChildren"
          label="Nombre d'enfant(s) mineur(s)"
          type="number"
          :min="0"
        />
      </div>
      <div class="fr-fieldset__element">
        <VeeInput
          name="taxHousehold.majorChildren"
          label="Nombre d'enfant(s) majeur(s)"
          type="number"
          :min="0"
        />
      </div>
    </div>
  </fieldset>
  <hr class="fr-mt-5w fr-mb-2w" />
</template>

<script setup lang="ts">
  import { beneficiaryFamilySituationOptions } from '~/client/options/beneficiary'
</script>

<style scoped>
  .relatives-fieldset {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
