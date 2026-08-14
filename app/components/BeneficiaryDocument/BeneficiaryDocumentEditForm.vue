<template>
  <FormErrors
    v-if="errors.length > 1"
    :errors="errors"
  />
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
    <VeeInput
      :label="documentFieldLabels.name"
      name="name"
      required
    />
    <VeeInput
      class="fr-mb-3w"
      :label="documentFieldLabels.expirationDate"
      name="expirationDate"
      type="date"
    />
    <VeeCheckbox
      v-if="permissions.set.confidential"
      class="fr-mb-3w"
      :label="documentFieldLabels.confidential"
      name="confidential"
    />
    <VeeSelect
      :label="documentFieldLabels.type"
      name="type"
      :options="documentTypeKeys.options"
      required
    />
    <MultiSelect
      class="fr-mb-3w"
      name="tags"
      :label="documentFieldLabels.tags"
      :options="documentTagKeys.options"
    />
    <button
      class="fr-btn fr-mt-3w"
      title="Modifier"
      type="submit"
      :data-submitting="isSubmitting"
      :disabled="isSubmitting"
    >
      Modifier
    </button>
  </form>
</template>

<script setup lang="ts">
  import type { GetDocument } from './types'
  import { documentTagKeys, documentTypeKeys } from '~~/client/options'
  import type { EditDocumentInput } from '~~/server/schema'
  import { editDocumentSchema } from '~~/server/schema'
  import { documentFieldLabels } from '~~/client/labels'
  import type { DocumentPermissions } from '~~/server/security'

  const props = defineProps<{
    document: GetDocument
    permissions: DocumentPermissions
    updateDocument: (values: EditDocumentInput) => void
  }>()

  const isSubmitting = ref(false)
  const form = useTemplateRef('form')

  const { handleSubmit } = useForm<EditDocumentInput>({
    validationSchema: toTypedSchema(editDocumentSchema),
    initialValues: {
      key: props.document.key,
      beneficiaryId: props.document.beneficiaryId,
      name: props.document.name,
      type: props.document.type,
      tags: props.document.tags,
      confidential: props.document.confidential,
      expirationDate: props.document.expirationDate ?? undefined
    }
  })

  const { onSubmit, caughtErrors } = useCatchFormErrors(
    handleSubmit,
    values => {
      props.updateDocument(values)
    }
  )

  const { errors } = useDisplayFormErrors(
    form,
    caughtErrors,
    documentFieldLabels
  )
</script>
