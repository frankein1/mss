<template>
  <section class="fr-p-3v">
    <h2 class="title-blue fr-mb-6v">
      {{ routes.beneficiary.AppBeneficiaryEditEntourage.title }}
    </h2>

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
  </section>
</template>

<script setup lang="ts">
  import { CreateOrUpdateEntourageInput } from '~/server/schema'
  import { routes } from '~/utils/routes'

  const { remove, fields } =
    useFieldArray<CreateOrUpdateEntourageInput>('entourages')
</script>
