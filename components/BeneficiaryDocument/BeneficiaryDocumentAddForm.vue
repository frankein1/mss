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
    <!-- FIXME: Arrow navigation is not working due to DSFR - See https://github.com/GouvernementFR/dsfr/issues/517 -->
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
    <!-- TODO: file upload field -->
    <!--
    <AtomUpload
      label="Ajouter un fichier"
      name="file"
      accept="application/pdf, image/*, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/vnd.oasis.opendocument.spreadsheet, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.oasis.opendocument.text"
      required
    /> -->
    <button
      class="fr-btn fr-mt-3w"
      title="Ajouter"
      type="submit"
      :submitting="isSubmitting"
      @click="onCheckValidationBeforeSubmit"
    >
      Ajouter
    </button>
  </form>
</template>

<script lang="ts" setup>
  import { useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  // import { Document } from '@prisma/client'
  import { addDocumentSchema, AddDocumentInput } from '~/server/schema'
  import {
    documentTypeOptions,
    documentTagOptions
  } from '~/client/options/document'

  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()

  const props = defineProps<{
    beneficiaryId: string
  }>()

  // const emit = defineEmits<{
  //   (e: 'added', document: Document): void
  // }>()

  const form = ref<HTMLFormElement | null>(null)
  const isSubmitting = ref(false)

  const { handleSubmit } = useForm<AddDocumentInput>({
    validationSchema: toTypedSchema(addDocumentSchema),
    initialValues: {
      beneficiaryId: props.beneficiaryId,
      tags: [],
      confidential: false
    }
  })

  const onSubmit = handleSubmit(async values => {
    isSubmitting.value = true
    try {
      const document = await trpcClient.documents.add.mutate(values)
      console.log({ document })
      // emit('added', document)
    } catch {
      snackbar.error("L'envoi du fichier a échoué.")
    } finally {
      isSubmitting.value = false
    }
  })

  function onCheckValidationBeforeSubmit() {
    // Open the accordion containing the first invalid field
    const firstInvalidField = form.value?.querySelector(
      'input:invalid, select:invalid'
    )
    if (!firstInvalidField) {
      return
    }
    const closestAccordionCollapse = firstInvalidField.closest('.fr-collapse')
    if (!closestAccordionCollapse) {
      return
    }
    window.dsfr(closestAccordionCollapse as HTMLElement).collapse.disclose()
  }
</script>
