<template>
  <HelpRequestForm
    :is-submitting="isSubmitting"
    :social-support-subjects="socialSupportSubjects"
    :partner-organizations="partnerOrganizations"
    :family-file-id="familyFileId"
    :beneficiary-id="beneficiaryId"
    :caught-errors="caughtErrors"
    :subject="subject"
    @submit="onSubmit"
  />
</template>

<script lang="ts" setup>
  import {
    SocialSupportSubject,
    SocialSupportStatus,
    FileInstructionType
  } from '@prisma/client'
  import { toTypedSchema } from '@vee-validate/zod'
  import {
    CreateHelpRequestInput,
    createHelpRequestSchema
  } from '~/server/schema'
  import { PartnerOrganizationIdName } from '~/types/partner'

  const { application } = usePermissions()

  const props = defineProps<{
    isSubmitting: boolean
    socialSupportSubjects: SocialSupportSubject[]
    partnerOrganizations: PartnerOrganizationIdName[]
    beneficiaryId: string
    familyFileId: string
    isFinancial: boolean
  }>()

  const emit = defineEmits<{
    saveHelpRequest: [helpRequest: CreateHelpRequestInput]
  }>()

  const subject = computed(() =>
    props.isFinancial
      ? FileInstructionType.Financial
      : FileInstructionType.Other
  )

  const { handleSubmit, meta } = useForm<CreateHelpRequestInput>({
    validationSchema: toTypedSchema(createHelpRequestSchema),
    initialValues: {
      isMinistry: application.value.module.ministere,
      beneficiaryId: props.beneficiaryId,
      familyFileId: props.familyFileId,
      date: new Date(),
      status: SocialSupportStatus.WaitingAdditionalInformation,
      financialSupport: props.isFinancial
    }
  })

  const isFormDirty = computed(() => meta.value.dirty)

  const { isNavigatingWithFormActions } = useLeaveFormConfirmation({
    isFormDirty
  })

  const { caughtErrors, onSubmit } = useCatchFormErrors<CreateHelpRequestInput>(
    handleSubmit,
    values => {
      isNavigatingWithFormActions.value = true
      emit('saveHelpRequest', values)
    }
  )
</script>
