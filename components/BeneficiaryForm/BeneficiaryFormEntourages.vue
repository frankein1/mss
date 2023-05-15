<template>
  <div
    v-for="(field, idx) in fields"
    :key="field.key"
  >
    <BeneficiaryFormEntourage
      :entourage="field"
      :index="idx"
      @remove-entourage="remove(idx)"
    />
    <hr class="fr-mt-5w fr-mb-2w" />
  </div>

  <button
    class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-add-circle-line"
    type="button"
    @click="push({ id: v4(), caregiver: false })"
  >
    Ajouter un proche
  </button>
</template>

<script setup lang="ts">
  import { v4 } from 'uuid'
  import { CreateOrUpdateEntourageInput } from '~/server/schema'

  const { push, remove, fields } = useFieldArray<CreateOrUpdateEntourageInput>(
    'entourage.entourages'
  )
</script>
