<template>
  <FormErrors
    v-if="errors.length > 1"
    :errors="errors"
  />
  <form
    ref="form"
    novalidate
    class="fr-container--fluid"
    @submit.prevent="onUpdateStructure"
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
  import { adminStructureFieldLabels } from '~/client/labels'

  defineProps<{
    isSubmitting: boolean
  }>()

  const emit = defineEmits<{
    addStructure: [structure: AdminCreateStructureInput]
  }>()

  const form = ref<HTMLFormElement | null>(null)

  const { handleSubmit, setFieldValue } = useForm<AdminCreateStructureInput>({
    validationSchema: toTypedSchema(adminCreateStructureSchema)
  })

  const { onSubmit: onUpdateStructure, caughtErrors } = useCatchFormErrors(
    handleSubmit,
    structure => {
      emit('addStructure', structure)
    }
  )

  const { errors } = useDisplayFormErrors(
    form,
    caughtErrors,
    adminStructureFieldLabels
  )
</script>
