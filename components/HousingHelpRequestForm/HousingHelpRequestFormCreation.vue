<template>
  <HelpRequestForm
    :is-submitting="isSubmitting"
    :instructor-organizations="instructorOrganizations"
    :beneficiary-id="beneficiaryId"
    :caught-errors="caughtErrors"
    :subject="HelpRequestSubject.Housing"
    @submit="onSubmit"
  />
</template>

<script lang="ts" setup>
  import { SocialSupportStatus, InstructorOrganization } from '@prisma/client'
  import { toTypedSchema } from '@vee-validate/zod'
  import {
    CreateHousingHelpRequestInput,
    createHousingHelpRequestSchema
  } from '~/server/schema'
  import { HelpRequestSubject } from '~/types/socialSupport'

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
