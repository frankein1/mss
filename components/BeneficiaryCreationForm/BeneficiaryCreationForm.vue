<template>
  <PageTitle title="Créer un.e bénéficiaire" />
  <form @submit="onSubmit">
    <div
      class="fr-grid-row fr-grid-row--center fr-grid-row--gutters fr-p-2w fr-mt-2w fr-mb-2w bg-color-white"
    >
      <div class="fr-col-6">
        <VeeSelect
          name="status"
          :label="beneficiaryFieldLabels.status"
          :options="beneficiaryStatusOptions"
          required
        />
        <VeeCheckbox
          :label="beneficiaryFieldLabels.aidantConnectAuthorized"
          name="aidantConnectAuthorized"
        />
      </div>
      <div class="fr-col-6">
        <VeeMultiSelect
          name="referents"
          label="Agent(s) référent(s)"
          :options="referentOptions"
          required
          dropdown
        />
      </div>
    </div>

    <div
      class="fr-grid-row fr-grid-row--center fr-grid-row--gutters fr-p-2w fr-mt-2w fr-mb-2w bg-color-white"
    >
      <div class="fr-col-6">
        <VeeInput
          name="usualName"
          :label="beneficiaryFieldLabels.usualName"
        />
        <VeeInput
          name="firstName"
          :label="beneficiaryFieldLabels.firstName"
        />
        <VeeInput
          name="birthDate"
          :label="beneficiaryFieldLabels.birthDate"
          type="date"
        />
      </div>
      <div class="fr-col-6">
        <VeeInput
          name="phone1"
          :label="beneficiaryFieldLabels.phone1"
          type="tel"
        />
        <VeeInput
          name="email"
          :label="beneficiaryFieldLabels.email"
          type="email"
        />
      </div>
    </div>

    <button
      class="fr-btn fr-btn--lg submit-btn"
      type="submit"
      :submitting="isSubmitting"
      :disabled="isSubmitting"
    >
      Enregistrer
    </button>
  </form>
</template>

<script setup lang="ts">
  import { BeneficiaryStatus } from '@prisma/client'
  import { useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import { BeneficiaryReferent } from '~/utils/beneficiary'
  import {
    CreateBeneficiaryInput,
    createBeneficiarySchema
  } from '~/server/schema/beneficiary.schema'

  import { useAuthStore } from '~/store/auth'
  import { beneficiaryFieldLabels } from '~/client/labels'
  import { beneficiaryStatusOptions } from '~/client/options/beneficiary'

  const props = defineProps<{
    isSubmitting: boolean
    agents: BeneficiaryReferent[]
  }>()

  const authStore = useAuthStore()
  const user = authStore.getAuthUser

  const emit = defineEmits<{
    (e: 'saveBeneficiary', beneficiary: CreateBeneficiaryInput): void
  }>()

  const { handleSubmit } = useForm<CreateBeneficiaryInput>({
    validationSchema: toTypedSchema(createBeneficiarySchema),
    initialValues: {
      structureId: user.structureId || '',
      referents: [],
      aidantConnectAuthorized: false,
      status: BeneficiaryStatus.Active,
      firstName: '',
      usualName: '',
      birthDate: null,
      phone1: '',
      email: ''
    }
  })

  const onSubmit = handleSubmit(values => {
    emit('saveBeneficiary', values)
  })

  const referentOptions = computed(() =>
    withEmptyValue(toOptions(props.agents, 'id', 'name'))
  )
</script>
