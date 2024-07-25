<template>
  <h2 class="title-blue fr-mb-6v">{{ pageTitle }}</h2>
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
  import { routes } from '~/utils/routes'

  const { remove, fields } =
    useFieldArray<CreateOrUpdateEntourageInput>('entourages')

  const pageTitle = computed(
    () => routes.beneficiary.AppBeneficiaryEditEntourage.title
  )
</script>
