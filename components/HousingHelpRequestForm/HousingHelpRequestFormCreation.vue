<template>
  <HelpRequestForm
    :is-submitting="isSubmitting"
    :partner-organizations="partnerOrganizations"
    :beneficiary-id="beneficiaryId"
    :family-file-id="familyFileId"
    :caught-errors="caughtErrors"
    :subject="FileInstructionType.Housing"
    @submit="onSubmit"
  />
</template>

<script lang="ts" setup>
  import { SocialSupportStatus, FileInstructionType } from '@prisma/client'
  import { toTypedSchema } from '@vee-validate/zod'
  import {
    CreateHousingHelpRequestInput,
    createHousingHelpRequestSchema
  } from '~/server/schema'
  import { PartnerOrganizationIdName } from '~/types/partner'

  const { application } = usePermissions()

  const props = defineProps<{
    isSubmitting: boolean
    partnerOrganizations: PartnerOrganizationIdName[]
    beneficiaryId: string
    familyFileId: string
  }>()

  const emit = defineEmits<{
    saveHousingHelpRequest: [housingHelpRequest: CreateHousingHelpRequestInput]
  }>()

  const { handleSubmit, meta } = useForm<CreateHousingHelpRequestInput>({
    validationSchema: toTypedSchema(createHousingHelpRequestSchema),
    initialValues: {
      isMinistry: application.value.module.ministere,
      beneficiaryId: props.beneficiaryId,
      familyFileId: props.familyFileId,
      date: new Date(),
      status: SocialSupportStatus.WaitingAdditionalInformation
    }
  })

  const isFormDirty = computed(() => meta.value.dirty)

  const { isNavigatingWithFormActions } = useLeaveFormConfirmation({
    isFormDirty
  })

  const { caughtErrors, onSubmit } =
    useCatchFormErrors<CreateHousingHelpRequestInput>(handleSubmit, values => {
      isNavigatingWithFormActions.value = true
      emit('saveHousingHelpRequest', values)
    })
</script>
