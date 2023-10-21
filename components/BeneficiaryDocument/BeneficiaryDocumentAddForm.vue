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
    <VeeSelect
      :label="documentFieldLabels.type"
      name="type"
      :options="withEmptyValue(documentTypeOptions)"
      required
    />
    <VeeSearchableSelect
      :label="documentFieldLabels.tags"
      name="tags"
      :options="documentTagOptions"
      multiple
    />
    <VeeCheckbox
      class="fr-mb-2w"
      :label="documentFieldLabels.confidential"
      name="confidential"
    />

    <VeeInputFile
      label="Ajouter un fichier"
      name="file"
      accept="application/pdf, image/*, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/vnd.oasis.opendocument.spreadsheet, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.oasis.opendocument.text"
      required
    />
    <button
      class="fr-btn fr-mt-3w"
      title="Ajouter"
      type="submit"
      :submitting="isSubmitting"
    >
      Ajouter
    </button>
  </form>
</template>

<script lang="ts" setup>
  import { toTypedSchema } from '@vee-validate/zod'
  import {
    UploadBrowserDocumentInput,
    uploadBrowserDocumentSchema
  } from '~/server/schema'
  import {
    documentTypeOptions,
    documentTagOptions
  } from '~/client/options/document'
  import { documentFieldLabels } from '~/client/labels'

  const props = defineProps<{
    beneficiaryId: string
  }>()

  const emit = defineEmits<{
    newDocument: [key: string]
  }>()

  const form = ref<HTMLFormElement | null>(null)
  const isSubmitting = ref(false)
  // const submitErrors = ref(null)

  const { handleSubmit } = useForm<UploadBrowserDocumentInput>({
    validationSchema: toTypedSchema(uploadBrowserDocumentSchema),
    initialValues: {
      beneficiaryId: props.beneficiaryId,
      tags: [],
      confidential: false
    }
  })

  const { onSubmit, caughtErrors } = useCatchFormErrors(
    handleSubmit,
    async values => {
      isSubmitting.value = true
      const { file, ...data } = values

      const input = JSON.stringify({
        ...data,
        file: {
          size: file.size,
          mimeType: file.type,
          name: file.name
        }
      })

      const formData = new FormData()
      formData.append('file', file)
      formData.append('input', input)

      const key = await $fetch<string>('/api/s3/create', {
        method: 'POST',
        body: formData
      })
      emit('newDocument', key)
    }
  )

  const { errors } = useDisplayFormErrors(
    form,
    caughtErrors,
    documentFieldLabels
  )
</script>
