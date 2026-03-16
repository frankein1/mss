<template>
  <FormErrors
    v-if="errors.length > 1"
    :errors="errors"
  />
  <p class="fr-mb-2w">
    <RequiredFields />
  </p>
  <AtomNotice class="fr-mb-6v">
    <template #default>Date d'expiration</template>
    <template #content>
      Afin de maintenir à jour vos dossiers et d'être informé lors de
      l'expiration d'un document, nous vous invitons à renseigner une date de
      validité.
    </template>
  </AtomNotice>
  <form
    ref="form"
    novalidate
    @submit.prevent="onSubmit"
  >
    <VeeInputFile
      label="Selectionner un fichier"
      hint="Taille maximum: 20Mo. Type de fichiers accepté: pdf, image, Excel (.xls, .xlsx), Word (.doc, .docx), OpenDocument (.ods, .odt)"
      name="file"
      :accept="documentFileAllowedTypes.join(', ')"
      required
    />
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

    <VeeInput
      class="fr-mb-3w"
      :label="documentFieldLabels.expirationDate"
      name="expirationDate"
      type="date"
    />
    <VeeCheckbox
      class="fr-mb-3w"
      :label="documentFieldLabels.confidential"
      name="confidential"
    />
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
    <button
      class="fr-btn fr-mt-3w"
      type="submit"
      :data-submitting="isSubmitting"
      :disabled="isSubmitting"
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

  const beneficiaryOptions = computed(() =>
    props.familyFileIdentification.map(m => ({
      label: formatBeneficiaryShortenedName(m),
      value: m.id
    }))
  )

  const form = ref<HTMLFormElement | null>(null)
  const isSubmitting = ref(false)

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
        props.newDocument(key, file.name)
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
