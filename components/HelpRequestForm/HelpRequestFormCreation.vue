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
    HelpRequestStatus,
    InstructorOrganization,
    PrescribingOrganization,
    HelpRequestSubject
  } from '@prisma/client'
  import { toTypedSchema } from '@vee-validate/zod'
  import {
    CreateHelpRequestInput,
    createHelpRequestSchema
  } from '~/server/schema'

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
      beneficiaryId: props.beneficiaryId,
      openingDate: new Date(),
      status: HelpRequestStatus.WaitingAdditionalInformation,
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
