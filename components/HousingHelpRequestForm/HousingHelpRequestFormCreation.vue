<template>
  <HelpRequestForm
    :is-submitting="isSubmitting"
    :followup-types="followupTypes"
    :prescribing-organizations="prescribingOrganizations"
    :instructor-organizations="instructorOrganizations"
    :beneficiary-id="beneficiaryId"
    :caught-errors="caughtErrors"
    :subject="subject"
    @submit="onSubmit"
  />
</template>

<script lang="ts" setup>
  import {
    FollowupType,
    SocialSupportStatus,
    InstructorOrganization,
    PrescribingOrganization
  } from '@prisma/client'
  import { toTypedSchema } from '@vee-validate/zod'
  import {
    CreateHousingHelpRequestInput,
    createHousingHelpRequestSchema
  } from '~/server/schema'
  import { ExtendedHelpRequestSubject } from '~/types/socialSupport'

  const { application } = usePermissions()

  const props = defineProps<{
    isSubmitting: boolean
    followupTypes: FollowupType[]
    prescribingOrganizations: PrescribingOrganization[]
    instructorOrganizations: InstructorOrganization[]
    beneficiaryId: string
    subject: ExtendedHelpRequestSubject
  }>()

  const emit = defineEmits<{
    saveHelpRequest: [helpRequest: CreateHousingHelpRequestInput]
  }>()

  const { handleSubmit } = useForm<CreateHousingHelpRequestInput>({
    validationSchema: toTypedSchema(createHousingHelpRequestSchema),
    initialValues: {
      isMinistry: application.value.module.ministere,
      beneficiaryId: props.beneficiaryId,
      date: new Date(),
      status: SocialSupportStatus.WaitingAdditionalInformation
    }
  })

  const { caughtErrors, onSubmit } =
    useCatchFormErrors<CreateHousingHelpRequestInput>(handleSubmit, values => {
      emit('saveHelpRequest', values)
    })
</script>
