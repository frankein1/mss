<template>
  <FollowupForm
    :is-submitting="isSubmitting"
    :social-support-subjects="socialSupportSubjects"
    :partner-organizations="partnerOrganizations"
    :family-file-id="familyFileId"
    :medium="values.medium"
    :is-redirected="values.redirected"
    :caught-errors="caughtErrors"
    @submit="onSubmit"
  />
</template>

<script lang="ts" setup>
  import { SocialSupportSubject, SocialSupportStatus } from '@prisma/client'
  import { toTypedSchema } from '@vee-validate/zod'
  import { AddFollowupInput, addFollowupSchema } from '~/server/schema'
  import { PartnerOrganizationIdName } from '~/types/partner'

  const { application } = usePermissions()

  const props = defineProps<{
    isSubmitting: boolean
    socialSupportSubjects: Array<SocialSupportSubject>
    partnerOrganizations: Array<PartnerOrganizationIdName>
    beneficiaryId: string
    familyFileId: string
  }>()

  const emit = defineEmits<{
    saveFollowup: [followup: AddFollowupInput]
  }>()

  const { handleSubmit, values, meta } = useForm<AddFollowupInput>({
    validationSchema: toTypedSchema(addFollowupSchema),
    initialValues: {
      isMinistry: application.value.module.ministere,
      beneficiaryId: props.beneficiaryId,
      familyFileId: props.familyFileId,
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
      console.log('in submit')
      isNavigatingWithFormActions.value = true
      emit('saveFollowup', values)
    }
  )
</script>
