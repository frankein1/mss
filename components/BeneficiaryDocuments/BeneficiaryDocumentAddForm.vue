<template>
  <form
    ref="form"
    @submit.prevent="onSubmit"
  >
    <VeeSelect
      label="Type de fichier"
      name="type"
      :options="withEmptyValue(documentTypeOptions)"
      required
    />
    <VeeSearchableSelect
      label="Thèmes"
      name="tags"
      :options="documentTagOptions"
      multiple
    />
    <VeeCheckbox
      class="fr-mb-2w"
      label="Confidentiel"
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
  import { useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import {
    UploadBrowserDocumentInput,
    uploadBrowserDocumentSchema
  } from '~/server/schema'
  import {
    documentTypeOptions,
    documentTagOptions
  } from '~/client/options/document'

  const props = defineProps<{
    beneficiaryId: string
  }>()

  const emit = defineEmits<{
    (e: 'newDocument'): void
  }>()

  const form = ref<HTMLFormElement | null>(null)
  const isSubmitting = ref(false)
  const submitErrors = ref(null)

  const { handleSubmit } = useForm<UploadBrowserDocumentInput>({
    validationSchema: toTypedSchema(uploadBrowserDocumentSchema),
    initialValues: {
      beneficiaryId: props.beneficiaryId,
      tags: [],
      confidential: false
    }
  })

  const onSubmit = handleSubmit(async values => {
    isSubmitting.value = true
    const { file } = values
    const client = useTrpcClient()
    const { url, key } = await client.documents.createUploadUrl.mutate({
      name: file.name,
      beneficiaryId: values.beneficiaryId,
      mimeType: file.type
    })

    const data = new FormData()
    data.append('file', file)

    await useFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': file.type
      },
      body: data
    })
      .then(async () => {
        await client.documents.add.mutate({
          beneficiaryId: values.beneficiaryId,
          type: values.type,
          tags: values.tags,
          confidential: values.confidential,
          file: {
            name: file.name,
            key,
            mimeType: file.type,
            size: file.size
          }
        })
        emit('newDocument')
      })
      .catch(error => {
        submitErrors.value = error
      })
  })
</script>
