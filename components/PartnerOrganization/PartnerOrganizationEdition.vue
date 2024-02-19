<template>
  <PartnerOrganizationForm
    :is-submitting="isSubmitting"
    :caught-errors="caughtErrors"
    :partner-id="partner.id"
    :show-phone-2="!!partner.phone2"
    @submit="onSubmit"
    @cancel="onCancel"
  />
</template>

<script lang="ts" setup>
  import { toTypedSchema } from '@vee-validate/zod'
  import {
    EditPartnerOrganizationInput,
    editPartnerOrganizationSchema
  } from '~/server/schema'

  const props = defineProps<{
    isSubmitting: boolean
    id: string
  }>()

  const emit = defineEmits<{
    onFinish: [partner: EditPartnerOrganizationInput]
    onCancel: [filter?: string]
  }>()

  const partner = await useTrpcClient().partner.getOne.query({ id: props.id })

  const { handleSubmit } = useForm<EditPartnerOrganizationInput>({
    validationSchema: toTypedSchema(editPartnerOrganizationSchema),
    initialValues: {
      id: partner.id,
      siret: partner.siret || '',
      name: partner.name,
      email: partner.email,
      phone1: partner.phone1,
      phone2: partner.phone2,
      address: partner.address,
      city: partner.city,
      zipcode: partner.zipcode,
      workingHours: partner.workingHours
    }
  })

  const { caughtErrors, onSubmit } = useCatchFormErrors(
    handleSubmit,
    values => {
      emit('onFinish', values)
    }
  )

  function onCancel(filter?: string) {
    emit('onCancel', filter)
  }
</script>
