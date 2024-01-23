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
    CreateHelpRequestInput,
    createHelpRequestSchema
  } from '~/server/schema'
  import { HelpRequestSubject } from '~/types/socialSupport'

  const { application } = usePermissions()

  const props = defineProps<{
    isSubmitting: boolean
    followupTypes: FollowupType[]
    prescribingOrganizations: PrescribingOrganization[]
    instructorOrganizations: InstructorOrganization[]
    beneficiaryId: string
    isFinancial: boolean
  }>()

  const emit = defineEmits<{
    saveHelpRequest: [helpRequest: CreateHelpRequestInput]
  }>()

  const subject = computed(() =>
    props.isFinancial ? HelpRequestSubject.Financial : HelpRequestSubject.Other
  )

  const { handleSubmit } = useForm<CreateHelpRequestInput>({
    validationSchema: toTypedSchema(createHelpRequestSchema),
    initialValues: {
      isMinistry: application.value.module.ministere,
      beneficiaryId: props.beneficiaryId,
      date: new Date(),
      status: SocialSupportStatus.WaitingAdditionalInformation,
      financialSupport: props.isFinancial
    }
  })

  const { caughtErrors, onSubmit } = useCatchFormErrors<CreateHelpRequestInput>(
    handleSubmit,
    values => {
      emit('saveHelpRequest', values)
    }
  )
</script>
