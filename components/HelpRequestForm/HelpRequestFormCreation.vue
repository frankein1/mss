<template>
  <HelpRequestForm
    :is-submitting="isSubmitting"
    :followup-types="followupTypes"
    :prescribing-organizations="prescribingOrganizations"
    :instructor-organizations="instructorOrganizations"
    :beneficiary-id="beneficiaryId"
    :caught-errors="caughtErrors"
    @submit="onSubmit"
  />
</template>

<script lang="ts" setup>
  import {
    FollowupType,
    SocialSupportStatus,
    InstructorOrganization,
    PrescribingOrganization,
    HelpRequestSubject
  } from '@prisma/client'
  import { toTypedSchema } from '@vee-validate/zod'
  import {
    CreateHelpRequestInput,
    createHelpRequestSchema
  } from '~/server/schema'

  const isMinistryAgent = useAuthState().isMinistryAgent()

  const props = defineProps<{
    isSubmitting: boolean
    followupTypes: FollowupType[]
    prescribingOrganizations: PrescribingOrganization[]
    instructorOrganizations: InstructorOrganization[]
    beneficiaryId: string
    subject: HelpRequestSubject
  }>()

  const emit = defineEmits<{
    saveHelpRequest: [helpRequest: CreateHelpRequestInput]
  }>()

  const { handleSubmit } = useForm<CreateHelpRequestInput>({
    validationSchema: toTypedSchema(createHelpRequestSchema),
    initialValues: {
      isMinistry: isMinistryAgent,
      beneficiaryId: props.beneficiaryId,
      date: new Date(),
      status: SocialSupportStatus.WaitingAdditionalInformation,
      subject: props.subject
    }
  })

  const { caughtErrors, onSubmit } = useCatchFormErrors<CreateHelpRequestInput>(
    handleSubmit,
    values => {
      emit('saveHelpRequest', values)
    }
  )
</script>
