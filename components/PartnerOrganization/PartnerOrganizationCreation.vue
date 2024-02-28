<template>
  <PartnerOrganizationForm
    :is-submitting="isSubmitting"
    :caught-errors="caughtErrors"
    :show-phone-2="false"
    @submit="onSubmit"
    @cancel="onCancel"
    @restore="onRestore"
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
    restore: [partner: PartnerOrganizationData]
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

  function onRestore(partner: PartnerOrganizationData) {
    emit('restore', partner)
  }
</script>
