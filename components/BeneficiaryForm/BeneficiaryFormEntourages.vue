<template>
  <BeneficiaryFormEntourage
    v-for="(field, idx) in fields"
    :key="field.key"
    :entourage="field"
    :index="idx"
    @remove-entourage="remove(idx)"
  />

  <BeneficiaryFormAddRelative
    name="entourages"
    add-button-label="Ajouter un proche"
  />
</template>

<script setup lang="ts">
  import { CreateOrUpdateEntourageInput } from '~/server/schema'

  const { remove, fields } =
    useFieldArray<CreateOrUpdateEntourageInput>('entourages')
</script>
