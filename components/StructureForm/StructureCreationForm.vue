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
  import type { CreateStructureInput } from '~/server/schema'
  import { createStructureSchema } from '~/server/schema'
  import { structureFieldLabels } from '~/client/labels'

  defineProps<{
    isSubmitting: boolean
  }>()

  const emit = defineEmits<{
    addStructure: [structure: CreateStructureInput]
  }>()

  const form = ref<HTMLFormElement | null>(null)

  const { handleSubmit } = useForm<CreateStructureInput>({
    validationSchema: toTypedSchema(createStructureSchema)
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
    structureFieldLabels
  )
</script>
