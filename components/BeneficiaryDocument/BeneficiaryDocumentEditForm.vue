<template>
  <form @submit.prevent="onSubmit">
    <VeeInput
      label="Nom du document"
      name="name"
      required
    />
    <VeeSelect
      label="Type de fichier"
      name="type"
      :options="documentTypeOptions"
      required
    />
    <VeeSearchableSelect
      label="Thèmes"
      name="tags"
      :options="documentTagOptions"
      multiple
    />
    <VeeCheckbox
      v-if="canSetDocumentAsConfidential"
      class="fr-mb-2w"
      label="Confidentiel"
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
  import { canSetDocumentAsConfidential as canSetDocumentAsConfidentialRule } from '~/server/security/rules'
  import { GetBeneficiaryOutput } from '~/server/trpc/routers'

  const props = defineProps<{
    document: Doc
    beneficiary: GetBeneficiaryOutput
  }>()

  const emit = defineEmits<{
    updateDocument: [values: EditDocumentInput]
  }>()

  const authStore = useAuthStore()

  const isSubmitting = ref(false)

  const canSetDocumentAsConfidential = computed(() => {
    return canSetDocumentAsConfidentialRule(
      authStore.getAuthUser,
      props.beneficiary,
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

  const onSubmit = handleSubmit(values => {
    emit('updateDocument', values)
  })
</script>
