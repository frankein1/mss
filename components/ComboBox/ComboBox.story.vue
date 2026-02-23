<template>
  <div>
    <h3>New Combobox</h3>

    <h4>Simple (slot par défaut)</h4>
    <ComboBox
      v-model="c0"
      label="Label"
      :options
    ></ComboBox>
    <div>Selected value: {{ c0 }}</div>

    <h4>Avec formatage de la liste déroulante</h4>
    <ComboBox
      v-model="c1"
      label="Label"
      :format-display-value="o => ('el' in o ? o['el'] : o['id'])"
      :options
    ></ComboBox>
    <div>Selected value: {{ c1 }}</div>

    <h4>Avec hook à l'entrée de caractères</h4>
    <ComboBox
      v-slot="{ option, input }"
      v-model="c2"
      label="Label"
      :format-display-value="o => ('el' in o ? o['el'] : o['id'])"
      :options
    >
      <span
        >{{ 'el' in option ? option['el'] : option['id'] }} - {{ input }}</span
      >
    </ComboBox>
    <div>Selected value: {{ c2 }}</div>
  </div>
</template>

<script setup lang="ts">
  import ComboBox from './ComboBox.vue'

  const options = [
    { el: 'opt1', disabled: false },
    { id: 'opt2', disabled: false },
    { id: 'opt3', disabled: false },
    { id: 'opt4', disabled: false },
    { id: 'opt5', disabled: false }
  ]

  const c0 = ref()
  const c1 = ref()
  const c2 = ref()
</script>
