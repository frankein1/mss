<template>
  <FormErrors
    v-if="errors.length > 1"
    :errors="errors"
  />
  <p class="fr-mb-2w">
    <RequiredFields />
  </p>
  <form
    ref="form"
    novalidate
    @submit.prevent="onSubmit"
  >
    <VeeRadioButtons
      v-if="beneficiaryOptions.length > 0"
      name="beneficiaryId"
      label="Ce document appartient à :"
      :options="beneficiaryOptions"
      :inline="false"
      required
    />
    <VeeSelect
      :label="documentFieldLabels.type"
      name="type"
      :options="withEmptyValue(documentTypeKeys.options)"
      required
    />
    <VeeSearchableSelect
      :label="documentFieldLabels.tags"
      name="tags"
      :options="documentTagKeys.options"
      multiple
    />
    <VeeCheckbox
      class="fr-mb-2w"
      :label="documentFieldLabels.confidential"
      name="confidential"
    />

    <VeeInputFile
      label="Ajouter un fichier"
      hint="Taille maximum: 20Mo"
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
  import { documentTypeKeys, documentTagKeys } from '~/client/options'
  import { documentFieldLabels } from '~/client/labels'
  import { BeneficiaryFileIdentification } from '~/types/beneficiary'
  import { formatBeneficiaryShortenedName } from '~/utils/beneficiary/formatBeneficiaryShortenedName'

  const props = withDefaults(
    defineProps<{
      familyFileId: string
      familyFileIdentification?: BeneficiaryFileIdentification[]
      beneficiaryId?: string
      newDocument: (key: string) => void
    }>(),
    { familyFileIdentification: () => [], beneficiaryId: undefined }
  )

  if (!props.beneficiaryId && props.familyFileIdentification.length === 0) {
    throw new Error(
      'One of beneficiaryId or familyFileIdentification props is compulsory'
    )
  }

  const beneficiaryOptions = computed(() =>
    props.familyFileIdentification.map(m => ({
      label: formatBeneficiaryShortenedName(m),
      value: m.id
    }))
  )

  const form = ref<HTMLFormElement | null>(null)
  const isSubmitting = ref(false)

  const initialBeneficiaryId =
    props.beneficiaryId || props.familyFileIdentification[0].id

  const { handleSubmit } = useForm<UploadBrowserDocumentInput>({
    validationSchema: toTypedSchema(uploadBrowserDocumentSchema),
    initialValues: {
      familyFileId: props.familyFileId,
      beneficiaryId: initialBeneficiaryId,
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

      try {
        const key = await $fetch<string>('/api/document/upload', {
          method: 'POST',
          body: formData
        })
        props.newDocument(key)
      } catch {
        useSnackbar().error("L'ajout du document a échoué.", () =>
          form.value?.querySelector('select')?.focus()
        )
      } finally {
        isSubmitting.value = false
      }
    }
  )

  const { errors } = useDisplayFormErrors(
    form,
    caughtErrors,
    documentFieldLabels
  )
</script>
