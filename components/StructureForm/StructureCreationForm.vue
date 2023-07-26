<template>
  <form
    class="fr-container--fluid"
    @submit="onUpdateStructure"
  >
    <StructureFormAdmin />

    <StructureFormInformation :set-field-value="setFieldValue" />

    <button
      class="fr-btn fr-btn--lg submit-btn"
      type="submit"
      :disabled="isSubmitting"
      :submitting="isSubmitting"
    >
      Ajouter
    </button>
  </form>
</template>

<script lang="ts" setup>
  import type { AdminCreateStructureInput } from '~/server/schema'
  import { adminCreateStructureSchema } from '~/server/schema'

  defineProps<{
    isSubmitting: boolean
  }>()

  const emit = defineEmits<{
    addStructure: [structure: AdminCreateStructureInput]
  }>()

  const { handleSubmit, setFieldValue } = useForm<AdminCreateStructureInput>({
    validationSchema: toTypedSchema(adminCreateStructureSchema)
  })

  const onUpdateStructure = handleSubmit(structure => {
    emit('addStructure', structure)
  })
</script>
