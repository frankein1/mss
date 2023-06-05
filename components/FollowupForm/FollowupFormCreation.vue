<template>
  <FollowupForm
    :is-submitting="isSubmitting"
    :followup-types="followupTypes"
    :prescribing-organizations="prescribingOrganizations"
    :beneficiary-id="beneficiaryId"
    :medium="values.medium"
    :is-redirected="values.redirected"
    @submit="onSubmit"
  />
</template>

<script lang="ts" setup>
  import {
    FollowupType,
    PrescribingOrganization,
    FollowupStatus
  } from '@prisma/client'
  import { useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import {
    AddFollowupInput,
    addFollowupSchema
  } from '~/server/schema/followup.schema'

  const props = defineProps<{
    isSubmitting: boolean
    followupTypes: Array<FollowupType>
    prescribingOrganizations: Array<PrescribingOrganization>
    beneficiaryId: string
  }>()

  const emit = defineEmits<{
    (e: 'saveFollowup', followup: AddFollowupInput): void
  }>()

  const { handleSubmit, values } = useForm<AddFollowupInput>({
    validationSchema: toTypedSchema(addFollowupSchema),
    initialValues: {
      beneficiaryId: props.beneficiaryId,
      // FIXME: date type error
      date: new Date(),
      status: FollowupStatus.Done
    }
  })

  const onSubmit = handleSubmit(values => {
    emit('saveFollowup', values)
  })
</script>
