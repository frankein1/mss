<template>
  <div>
    <h3>Vee Searchable Select</h3>

    <h4>Sélection avec recherche</h4>
    <div id="vee-searchable-select-options">
      <VeeSearchableSelect
        label="Default label"
        name="default"
        :options
      />
    </div>

    <h4>Sélection avec recherche pour champ requis</h4>
    <div id="vee-searchable-select-required">
      <VeeSearchableSelect
        label="Champ requis"
        name="required"
        :options
        required
      />
    </div>

    <h4>Sélection avec recherche avec création d'option</h4>
    <div id="vee-searchable-select-create-option">
      <VeeSearchableSelect
        label="Champ requis"
        name="canCreate"
        :options
        required
        can-create-new-option
      />
    </div>

    <h4>Sélection avec recherche pour champ multiple avec création d'option</h4>
    <div id="vee-searchable-select-multiple">
      <VeeSearchableSelect
        label="Label pour champ multiple avec création d'option"
        name="multiple"
        :options
        multiple
        can-create-new-option
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import VeeSearchableSelect from './VeeSearchableSelect.vue'
  import type { Options } from '~/utils/options'

  const options: Options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option 2', label: 'Option 2' }
  ]
</script>
