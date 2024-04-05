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

  const props = defineProps<{
    isSubmitting: boolean
    finish: (partner: AddPartnerOrganizationInput) => void
    cancel: () => void
    restore: (partner: PartnerOrganizationData) => void
  }>()

  const { handleSubmit } = useForm<AddPartnerOrganizationInput>({
    validationSchema: toTypedSchema(addPartnerOrganizationSchema),
    initialValues: {}
  })

  const { caughtErrors, onSubmit } = useCatchFormErrors(
    handleSubmit,
    values => {
      props.finish(values)
    }
  )

  function onCancel() {
    props.cancel()
  }

  function onRestore(partner: PartnerOrganizationData) {
    props.restore(partner)
  }
</script>
