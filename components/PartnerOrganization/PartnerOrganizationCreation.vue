<template>
  <PartnerOrganizationForm
    :is-submitting="isSubmitting"
    :caught-errors="caughtErrors"
    :show-phone-2="false"
    @submit="onSubmit"
    @cancel="onCancel"
    @open="onOpen"
  />
</template>

<script lang="ts" setup>
  import { toTypedSchema } from '@vee-validate/zod'
  import { PartnerOrganizationData } from './types'
  import {
    AddPartnerOrganizationInput,
    addPartnerOrganizationSchema
  } from '~/server/schema'

  defineProps<{
    isSubmitting: boolean
  }>()

  const emit = defineEmits<{
    finish: [partner: AddPartnerOrganizationInput]
    cancel: []
    open: [partner: PartnerOrganizationData]
  }>()

  const { handleSubmit } = useForm<AddPartnerOrganizationInput>({
    validationSchema: toTypedSchema(addPartnerOrganizationSchema),
    initialValues: {}
  })

  const { caughtErrors, onSubmit } = useCatchFormErrors(
    handleSubmit,
    values => {
      emit('finish', values)
    }
  )

  function onCancel() {
    emit('cancel')
  }

  function onOpen(partner: PartnerOrganizationData) {
    emit('open', partner)
  }
</script>
