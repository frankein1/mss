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
        :label="adminStructureFieldLabels.inhabitantsNumber"
      />
    </div>
    <div class="fr-fieldset__element">
      <VeeInput
        name="inseeCode"
        :label="adminStructureFieldLabels.inseeCode"
      />
    </div>
    <div class="fr-fieldset__element">
      <VeeInput
        name="siret"
        :label="adminStructureFieldLabels.siret"
      />
    </div>
    <div class="fr-fieldset__element">
      <VeeSelect
        name="type"
        :label="adminStructureFieldLabels.type"
        :options="withEmptyValue(structureTypeOptions)"
        required
      />
    </div>
  </fieldset>
</template>

<script lang="ts" setup>
  import { structureTypeOptions } from '~/client/options'
  import { adminStructureFieldLabels } from '~/client/labels'
</script>
