<template>
  <FollowupForm
    :is-submitting="isSubmitting"
    :followup-types="followupTypes"
    :prescribing-organizations="prescribingOrganizations"
    :beneficiary-id="beneficiaryId"
    :medium="values.medium"
    :is-redirected="values.redirected"
    :caught-errors="caughtErrors"
    @submit="onSubmit"
  />
</template>

<script lang="ts" setup>
  import {
    FollowupType,
    PrescribingOrganization,
    SocialSupportStatus
  } from '@prisma/client'
  import { toTypedSchema } from '@vee-validate/zod'
  import { AddFollowupInput, addFollowupSchema } from '~/server/schema'

  const { application } = usePermissions()

  const props = defineProps<{
    isSubmitting: boolean
    followupTypes: Array<FollowupType>
    prescribingOrganizations: Array<PrescribingOrganization>
    beneficiaryId: string
  }>()

  const emit = defineEmits<{
    saveFollowup: [followup: AddFollowupInput]
  }>()

  const { handleSubmit, values } = useForm<AddFollowupInput>({
    validationSchema: toTypedSchema(addFollowupSchema),
    initialValues: {
      isMinistry: application.value.module.ministere,
      beneficiaryId: props.beneficiaryId,
      date: new Date(),
      status: SocialSupportStatus.Done,
      redirected: false
    }
  })

  const { onSubmit, caughtErrors } = useCatchFormErrors(
    handleSubmit,
    values => {
      emit('saveFollowup', values)
    }
  )
</script>
