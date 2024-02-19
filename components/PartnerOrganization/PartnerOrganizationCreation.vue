<template>
  <PartnerOrganizationForm
    :is-submitting="isSubmitting"
    :caught-errors="caughtErrors"
    @submit="onSubmit"
    @cancel="onCancel"
  />
</template>

<script lang="ts" setup>
  import { toTypedSchema } from '@vee-validate/zod'
  import {
    AddPartnerOrganizationInput,
    addPartnerOrganizationSchema
  } from '~/server/schema'

  defineProps<{
    isSubmitting: boolean
  }>()

  const emit = defineEmits<{
    onFinish: [partner: AddPartnerOrganizationInput]
    onCancel: [filter?: string]
  }>()

  const { handleSubmit } = useForm<AddPartnerOrganizationInput>({
    validationSchema: toTypedSchema(addPartnerOrganizationSchema),
    initialValues: {}
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
