<template>
  <FormErrors
    v-if="errors.length > 1"
    :errors="errors"
  />
  <form
    ref="form"
    novalidate
    @submit.prevent="onSubmit"
  >
    <VeeInput
      :label="documentFieldLabels.name"
      name="name"
      required
    />
    <VeeSelect
      :label="documentFieldLabels.type"
      name="type"
      :options="documentTypeOptions"
      required
    />
    <VeeSearchableSelect
      :label="documentFieldLabels.tags"
      name="tags"
      :options="documentTagOptions"
      multiple
    />
    <VeeCheckbox
      v-if="permissions.set.confidential"
      class="fr-mb-2w"
      :label="documentFieldLabels.confidential"
      name="confidential"
    />
    <button
      class="fr-btn fr-mt-3w"
      title="Modifier"
      type="submit"
      :submitting="isSubmitting"
    >
      Modifier
    </button>
  </form>
</template>

<script setup lang="ts">
  import { GetDocument } from './types'
  import { documentTagOptions, documentTypeOptions } from '~/client/options'
  import { EditDocumentInput, editDocumentSchema } from '~/server/schema'
  import { documentFieldLabels } from '~/client/labels'
  import { DocumentPermissions } from '~/server/security'

  const props = defineProps<{
    document: GetDocument
    permissions: DocumentPermissions
  }>()

  const emit = defineEmits<{
    updateDocument: [values: EditDocumentInput]
  }>()

  const isSubmitting = ref(false)
  const form = ref<HTMLFormElement | null>(null)

  const { handleSubmit } = useForm<EditDocumentInput>({
    validationSchema: toTypedSchema(editDocumentSchema),
    initialValues: {
      key: props.document.key,
      beneficiaryId: props.document.beneficiaryId,
      name: props.document.name,
      type: props.document.type,
      tags: props.document.tags,
      confidential: props.document.confidential
    }
  })

  const { onSubmit, caughtErrors } = useCatchFormErrors(
    handleSubmit,
    values => {
      emit('updateDocument', values)
    }
  )

  const { errors } = useDisplayFormErrors(
    form,
    caughtErrors,
    documentFieldLabels
  )
</script>
