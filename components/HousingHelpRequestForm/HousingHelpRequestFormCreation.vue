<template>
  <HelpRequestForm
    :is-submitting="isSubmitting"
    :instructor-organizations="instructorOrganizations"
    :beneficiary-id="beneficiaryId"
    :caught-errors="caughtErrors"
    :subject="FileInstructionType.Housing"
    @submit="onSubmit"
  />
</template>

<script lang="ts" setup>
  import {
    SocialSupportStatus,
    InstructorOrganization,
    FileInstructionType
  } from '@prisma/client'
  import { toTypedSchema } from '@vee-validate/zod'
  import {
    CreateHousingHelpRequestInput,
    createHousingHelpRequestSchema
  } from '~/server/schema'

  const { application } = usePermissions()

  const props = defineProps<{
    isSubmitting: boolean
    instructorOrganizations: InstructorOrganization[]
    beneficiaryId: string
  }>()

  const emit = defineEmits<{
    saveHousingHelpRequest: [housingHelpRequest: CreateHousingHelpRequestInput]
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
      emit('saveHousingHelpRequest', values)
    })
</script>
