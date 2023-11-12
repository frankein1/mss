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
      v-if="canSetDocumentAsConfidential"
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
  import { Document as Doc } from '@prisma/client'
  import {
    documentTagOptions,
    documentTypeOptions
  } from '~/client/options/document'
  import { EditDocumentInput, editDocumentSchema } from '~/server/schema'
  import { useAuthStore } from '~/store/auth'
  import { canSetDocumentAsConfidential as canSetDocumentAsConfidentialRule } from '~/server/security'
  import { GetBeneficiaryOutput } from '~/types/beneficiary'
  import { documentFieldLabels } from '~/client/labels'

  const props = defineProps<{
    document: Doc
    beneficiary: GetBeneficiaryOutput
  }>()

  const emit = defineEmits<{
    updateDocument: [values: EditDocumentInput]
  }>()

  const authStore = useAuthStore()

  const isSubmitting = ref(false)
  const form = ref<HTMLFormElement | null>(null)

  const canSetDocumentAsConfidential = computed(() => {
    return canSetDocumentAsConfidentialRule(
      authStore.getAuthUser,
      props.beneficiary.meta,
      props.document
    )
  })

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
