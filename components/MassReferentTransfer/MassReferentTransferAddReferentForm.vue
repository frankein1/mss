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
      :label="beneficiaryReferentTransfertLabels.referentId"
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
  import { beneficiaryReferentTransfertLabels } from '~/client/labels/beneficiary.labels'
  import type { AddReferentToFamilyFileInput } from '~/server/schema'
  import { addReferentToFamilyFileSchema } from '~/server/schema'
  import { MAX_BENEFICIARIES_REFERENT_TRANSFER } from '~/utils/constants'
  import type { Options } from '~/utils/options'

  defineProps<{
    agentOptions: Options | null
  }>()

  const emit = defineEmits<{
    previous: []
    next: []
  }>()

  const { selectedBeneficiaries, referentId } = useMassReferentTransferState()

  const { handleSubmit } = useForm<AddReferentToFamilyFileInput>({
    validationSchema: toTypedSchema(addReferentToFamilyFileSchema),
    initialValues: {
      beneficiaries: selectedBeneficiaries.value.map(b => ({
        beneficiaryId: b.beneficiaryId,
        familyFileId: b.familyFileId
      })),
      referentId: undefined
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
