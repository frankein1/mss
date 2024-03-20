<template>
  <fieldset
    class="fr-fieldset fr-grid-row fr-grid-row--gutters form-grid"
    aria-labelledby="structure-information-legend"
  >
    <legend
      id="structure-information-legend"
      class="fr-fieldset__legend fr-h4"
    >
      Champs administrateurs
    </legend>
    <div class="fr-fieldset__element">
      <VeeInput
        name="inhabitantsNumber"
        :label="structureFieldLabels.inhabitantsNumber"
      />
    </div>
    <div class="fr-fieldset__element">
      <VeeInput
        name="inseeCode"
        :label="structureFieldLabels.inseeCode"
      />
    </div>
    <div class="fr-fieldset__element">
      <VeeInput
        name="siret"
        :label="structureFieldLabels.siret"
      />
    </div>
    <div class="fr-fieldset__element">
      <VeeSelect
        name="type"
        :label="structureFieldLabels.type"
        :options="withEmptyValue(structureTypeKeys.options)"
        required
      />
    </div>
  </fieldset>
</template>

<script lang="ts" setup>
  import { structureTypeKeys } from '~/client/options'
  import { structureFieldLabels } from '~/client/labels'
</script>
