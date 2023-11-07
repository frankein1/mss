<template>
  <FollowupForm
    :permissions="permissions"
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
    FollowupStatus
  } from '@prisma/client'
  import { toTypedSchema } from '@vee-validate/zod'
  import { FollowupPermissions } from '~/server/route'
  import { AddFollowupInput, addFollowupSchema } from '~/server/schema'

  const props = defineProps<{
    isSubmitting: boolean
    followupTypes: Array<FollowupType>
    prescribingOrganizations: Array<PrescribingOrganization>
    beneficiaryId: string
    permissions: FollowupPermissions
  }>()

  const emit = defineEmits<{
    saveFollowup: [followup: AddFollowupInput]
  }>()

  const { handleSubmit, values } = useForm<AddFollowupInput>({
    validationSchema: toTypedSchema(addFollowupSchema),
    initialValues: {
      beneficiaryId: props.beneficiaryId,
      date: new Date(),
      status: FollowupStatus.Done,
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
