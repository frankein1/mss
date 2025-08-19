<template>
  <h3>Simple ComboBox with no customization</h3>
  <ComboBox label="Taper pour chercher">
    <template #listbox>
      <ComboBoxItem
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        >{{ option.label }}</ComboBoxItem
      >
    </template>
  </ComboBox>
</template>

<script lang="ts" setup>
  const options = [
    {
      label: 'Ain',
      value: '01'
    },
    {
      label: 'Aisne',
      value: '02'
    },
    {
      label: 'Allier',
      value: '03'
    }
  ]
</script>
