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
    <template v-if="familyFileIdentification.length > 1">
      <VeeRadioButtons
        v-if="beneficiaryOptions.length > 0"
        name="beneficiaryId"
        label="Ce document appartient à :"
        :options="beneficiaryOptions"
        :inline="true"
        required
      />
    </template>
    <VeeSelect
      :label="documentFieldLabels.type"
      name="type"
      :options="withEmptyValue(documentTypeKeys.options)"
      required
    />
    <MultiSelect
      class="fr-mb-3w"
      name="tags"
      :label="documentFieldLabels.tags"
      :options="documentTagKeys.options"
      :dropdown-over="false"
    />
    <VeeCheckbox
      class="fr-mb-3w"
      :label="documentFieldLabels.confidential"
      name="confidential"
    />

    <VeeInputFile
      label="Selectionner un fichier"
      hint="Taille maximum: 20 Mo. Type de fichiers accepté: pdf, image, Excel (.xls, .xlsx), Word (.doc, .docx), OpenDocument (.ods, .odt)"
      name="file"
      :accept="documentFileAllowedTypes.join(', ')"
      required
    />
    <button
      class="fr-btn fr-mt-3w"
      type="submit"
      :data-submitting="upload.status === 'pending'"
      :disabled="upload.status === 'pending'"
    >
      Ajouter le document
    </button>
  </form>
</template>

<script lang="ts" setup>
  import { toTypedSchema } from '@vee-validate/zod'
  import type { UploadBrowserDocumentInput } from '~/server/schema'
  import { uploadBrowserDocumentSchema } from '~/server/schema'
  import {
    documentTypeKeys,
    documentTagKeys,
    documentFileAllowedTypes
  } from '~/client/options'
  import { documentFieldLabels } from '~/client/labels'
  import type { BeneficiaryFileIdentification } from '~/types/beneficiary'
  import { formatBeneficiaryShortenedName } from '~/utils/beneficiary/formatBeneficiaryShortenedName'

  const props = withDefaults(
    defineProps<{
      familyFileId: string
      familyFileIdentification?: BeneficiaryFileIdentification[]
      beneficiaryId?: string
      newDocument: (key: string, name: string) => void
    }>(),
    { familyFileIdentification: () => [], beneficiaryId: undefined }
  )

  if (!props.beneficiaryId && props.familyFileIdentification.length === 0) {
    throw new Error(
      'One of beneficiaryId or familyFileIdentification props is compulsory'
    )
  }

  const snackbar = useSnackbar()

  const beneficiaryOptions = computed(() =>
    props.familyFileIdentification.map(m => ({
      label: formatBeneficiaryShortenedName(m),
      value: m.id
    }))
  )

  const form = ref<HTMLFormElement | null>(null)

  const initialBeneficiaryId =
    props.beneficiaryId || props.familyFileIdentification[0]?.id

  if (!initialBeneficiaryId) {
    throw createError({ message: 'Echec de chargement du composant' })
  }

  const { handleSubmit } = useForm<UploadBrowserDocumentInput>({
    validationSchema: toTypedSchema(uploadBrowserDocumentSchema),
    initialValues: {
      familyFileId: props.familyFileId,
      beneficiaryId: initialBeneficiaryId,
      tags: [],
      confidential: false
    }
  })

  const { onSubmit, caughtErrors } = useCatchFormErrors(handleSubmit, onUpload)

  const upload = ref({
    status: 'idle',
    error: undefined as any,
    res: null as string | null
  })

  const showError = (message: string) => {
    upload.value.status = 'error'
    snackbar.error(message, () => form.value?.querySelector('select')?.focus())
  }

  async function onUpload(values: UploadBrowserDocumentInput) {
    upload.value.status = 'pending'
    upload.value.error = undefined

    const { file, ...data } = values

    const formData = new FormData()
    formData.append(
      'input',
      JSON.stringify({
        ...data,
        file: { size: file.size, mimeType: file.type, name: file.name }
      })
    )
    formData.append('file', file)

    // Upload document to S3 bucket via MSS server
    try {
      upload.value.res = await $fetch<string>('/api/document/upload', {
        method: 'POST',
        body: formData
      })
    } catch (e: unknown) {
      upload.value.error = e
      showError('Le téléversement du document a échoué.')
      throw e
    }

    upload.value.status = 'success'
    console.log(upload.value.res)
    props.newDocument(upload.value.res, file.name)
  }

  const { errors } = useDisplayFormErrors(
    form,
    caughtErrors,
    documentFieldLabels
  )
</script>
