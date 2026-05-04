<template>
  <p>
    {{ selectedBeneficiaries.length }}/{{ MAX_BENEFICIARIES_REFERENT_TRANSFER }}
    bénéficiaires sélectionné(s).
  </p>
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
    addReferentToFamilyFileSchema,
    deleteReferentFromFamilyFileSchema,
    type AddReferentToFamilyFileInput
  } from '~/server/schema'
  import { MAX_BENEFICIARIES_REFERENT_TRANSFER } from '~/utils/constants'
  import type { Options } from '~/utils/options'

  defineProps<{
    agentOptions: Options | null
  }>()

  const emit = defineEmits<{
    previous: []
    next: []
  }>()

  const { selectedBeneficiaries, referentId, editionChoice } =
    useMassReferentTransferState()

  const inputLabel = computed(() => {
    if (editionChoice.value === 'add') {
      return 'Sélectionnez l’agent référent à ajouter'
    }
    if (editionChoice.value === 'delete') {
      return 'Sélectionnez l’agent référent à retirer'
    }
    return 'Sélectionnez l’agent référent à transferer'
  })

  const validationSchema = computed(() =>
    editionChoice.value === 'delete'
      ? deleteReferentFromFamilyFileSchema
      : addReferentToFamilyFileSchema
  )

  const { handleSubmit } = useForm<AddReferentToFamilyFileInput>({
    validationSchema: computed(() => toTypedSchema(validationSchema.value)),
    initialValues: {
      beneficiaries: selectedBeneficiaries.value.map(b => ({
        beneficiaryId: b.beneficiaryId,
        familyFileId: b.familyFileId
      })),
      referentId: referentId.value ?? undefined
    }
  })

  const formRef = ref<HTMLFormElement | null>(null)

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
