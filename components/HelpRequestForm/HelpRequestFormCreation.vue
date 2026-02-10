<template>
  <HelpRequestForm
    :is-submitting="isSubmitting"
    :social-support-subjects="socialSupportSubjects"
    :partner-organizations="partnerOrganizations"
    :family-file-identification="familyFileIdentification || []"
    :caught-errors="caughtErrors"
    :subject="subject"
    @submit="onSubmit"
  />
</template>

<script lang="ts" setup>
  import type { SocialSupportSubject } from '~/prisma/generated/browser'
  import {
    SocialSupportStatus,
    FileInstructionType
  } from '~/prisma/generated/browser'
  import { toTypedSchema } from '@vee-validate/zod'
  import type { CreateHelpRequestInput } from '~/server/schema'
  import { createHelpRequestSchema } from '~/server/schema'
  import type { PartnerOrganizationIdName } from '~/types/partner'
  import type { BeneficiaryFileIdentification } from '~/types/beneficiary'

  const { application } = usePermissions()

  const props = defineProps<{
    isSubmitting: boolean
    socialSupportSubjects: SocialSupportSubject[]
    partnerOrganizations: PartnerOrganizationIdName[]
    beneficiaryId: string
    familyFileId: string
    familyFileIdentification: BeneficiaryFileIdentification[]
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
