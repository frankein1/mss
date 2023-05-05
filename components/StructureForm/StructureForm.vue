<template>
  <form
    class="fr-container--fluid"
    @submit.prevent="onUpdateStructure"
  >
    <StructureFormInformation :structure="structure" />

    <StructureFormFollowupTypes
      :structure-followup-types="structure.followupTypes"
    />

    <button
      class="fr-btn fr-btn--lg submit-btn"
      type="submit"
      :disabled="isSubmitting"
      :submitting="isSubmitting"
    >
      Modifier ma structure
    </button>
  </form>
</template>

<script lang="ts" setup>
  import type {
    StructureWithFollowupTypesWithSupportsCount,
    EditCurrentUserStructureSubmit
  } from './types'
  import type { EditCurrentUserStructureInput } from '~/server/schema'

  defineProps<{
    structure: StructureWithFollowupTypesWithSupportsCount
    isSubmitting: boolean
  }>()

  const emit = defineEmits<{
    (e: 'updateStructure', structure: EditCurrentUserStructureInput): void
  }>()

  function onUpdateStructure(event: Event) {
    // TODO: https://nuxt.com/modules/vee-validate
    const {
      data: {
        legallyRequiredFollowupTypes,
        legallyNotRequiredFollowupTypes,
        ...structure
      }
    } = useFormData<EditCurrentUserStructureSubmit>(event)

    const followupTypes = [
      ...legallyRequiredFollowupTypes.split(','),
      ...legallyNotRequiredFollowupTypes.split(',')
    ]

    emit('updateStructure', { ...structure, followupTypes })
  }
</script>
