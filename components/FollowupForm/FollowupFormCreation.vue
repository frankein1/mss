<template>
  <FollowupForm
    :is-submitting="isSubmitting"
    :followup-types="followupTypes"
    :partner-organizations="partnerOrganizations"
    :beneficiary-id="beneficiaryId"
    :medium="values.medium"
    :is-redirected="values.redirected"
    :caught-errors="caughtErrors"
    @submit="onSubmit"
  />
</template>

<script lang="ts" setup>
  import { FollowupType, SocialSupportStatus } from '@prisma/client'
  import { toTypedSchema } from '@vee-validate/zod'
  import { AddFollowupInput, addFollowupSchema } from '~/server/schema'
  import { PartnerOrganizationIdName } from '~/types/partner'

  const { application } = usePermissions()

  const props = defineProps<{
    isSubmitting: boolean
    followupTypes: Array<FollowupType>
    partnerOrganizations: Array<PartnerOrganizationIdName>
    beneficiaryId: string
  }>()

  const emit = defineEmits<{
    saveFollowup: [followup: AddFollowupInput]
  }>()

  const { handleSubmit, values, meta } = useForm<AddFollowupInput>({
    validationSchema: toTypedSchema(addFollowupSchema),
    initialValues: {
      isMinistry: application.value.module.ministere,
      beneficiaryId: props.beneficiaryId,
      date: new Date(),
      status: SocialSupportStatus.Done,
      redirected: false
    }
  })

  const isFormDirty = computed(() => meta.value.dirty)

  const { isNavigatingWithFormActions } = useLeaveFormConfirmation({
    isFormDirty
  })

  const { onSubmit, caughtErrors } = useCatchFormErrors(
    handleSubmit,
    values => {
      isNavigatingWithFormActions.value = true
      emit('saveFollowup', values)
    }
  )
</script>
