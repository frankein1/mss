<template>
  <p class="fr-text--bold">{{ summarySelected }}</p>

  <FormErrors
    v-if="errors.length > 0"
    :errors
  />
  <form
    ref="formRef"
    novalidate
  >
    <VeeSelect
      name="referentId"
      :label="inputLabel"
      :options="agentOptions ? withEmptyValue(agentOptions) : []"
      required
    />
    <MassReferentTransferStepButtons
      @previous="emit('previous')"
      @next="onSubmit"
    />
  </form>
</template>

<script lang="ts" setup>
  import {
    transfertReferentToFamilyFileSchema,
    type TransferReferentToFamilyFileInput
  } from '~/server/schema'
  import type { Options } from '~/utils/options'

  defineProps<{
    agentOptions: Options | null
  }>()

  const emit = defineEmits<{
    previous: []
    next: []
  }>()

  const { selectedBeneficiaries, referentId, editionChoice, summarySelected } =
    useMassReferentTransferState()

  const inputLabel = computed(() => {
    if (editionChoice.value === 'add') {
      return 'Sélectionner l’agent référent à ajouter'
    }
    if (editionChoice.value === 'delete') {
      return 'Sélectionner l’agent référent à retirer'
    }
    return 'Sélectionner l’agent référent à transferer'
  })

  const { handleSubmit } = useForm<TransferReferentToFamilyFileInput>({
    validationSchema: toTypedSchema(transfertReferentToFamilyFileSchema),
    initialValues: {
      familyFileIds: selectedBeneficiaries.value.map(b => b.familyFileId),
      referentId: referentId.value ?? undefined
    }
  })

  const formRef = useTemplateRef('formRef')

  const { onSubmit, caughtErrors } = useCatchFormErrors(
    handleSubmit,
    values => {
      referentId.value = values.referentId
      emit('next')
    }
  )

  const { errors } = useDisplayFormErrors(formRef, caughtErrors, {
    beneficiaries: 'Bénéficiaires',
    referentId: 'Agent référent'
  })
</script>
