<template>
  <HelpRequestForm
    :is-submitting="isSubmitting"
    :followup-types="followupTypes"
    :prescribing-organizations="prescribingOrganizations"
    :instructor-organizations="instructorOrganizations"
    :beneficiary-id="beneficiaryId"
    :status="values.status"
    :external-structure="values.externalStructure"
    :financial-support="values.financialSupport"
    @submit="onSubmit"
  />
</template>

<script lang="ts" setup>
  import {
    FollowupType,
    HelpRequestStatus,
    InstructorOrganization,
    PrescribingOrganization
  } from '@prisma/client'
  import { useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import {
    CreateHelpRequestInput,
    createHelpRequestSchema
  } from '~/server/schema/helpRequest.schema'

  const props = defineProps<{
    isSubmitting: boolean
    followupTypes: FollowupType[]
    prescribingOrganizations: PrescribingOrganization[]
    instructorOrganizations: InstructorOrganization[]
    beneficiaryId: string
  }>()

  const emit = defineEmits<{
    (e: 'saveHelpRequest', helpRequest: CreateHelpRequestInput): void
  }>()

  const { handleSubmit, values } = useForm<CreateHelpRequestInput>({
    validationSchema: toTypedSchema(createHelpRequestSchema),
    initialValues: {
      beneficiaryId: props.beneficiaryId,
      openingDate: new Date(),
      status: HelpRequestStatus.WaitingAdditionalInformation
    }
  })

  const onSubmit = handleSubmit(values => {
    emit('saveHelpRequest', values)
  })
</script>
