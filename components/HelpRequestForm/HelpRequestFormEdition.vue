<template>
  <HelpRequestForm
    :is-submitting="isSubmitting"
    :followup-types="followupTypes"
    :prescribing-organizations="prescribingOrganizations"
    :instructor-organizations="instructorOrganizations"
    :beneficiary-id="helpRequestData.beneficiaryId"
    :can-edit-private-synthesis="permissions?.set.privateSynthesis"
    :caught-errors="caughtErrors"
    :subject="subject"
    @submit="onSubmit"
  />
</template>

<script lang="ts" setup>
  import {
    FollowupType,
    InstructorOrganization,
    PrescribingOrganization
  } from '@prisma/client'
  import { toTypedSchema } from '@vee-validate/zod'
  import { HelpRequestPageItem } from './types'
  import { EditHelpRequestInput, editHelpRequestSchema } from '~/server/schema'
  import { prismaDecimalToNumber } from '~/utils/prisma'
  import { HelpRequestSubject } from '~/types/socialSupport'

  const { application } = usePermissions()

  const props = defineProps<{
    isSubmitting: boolean
    followupTypes: FollowupType[]
    prescribingOrganizations: PrescribingOrganization[]
    instructorOrganizations: InstructorOrganization[]
    data: HelpRequestPageItem
  }>()

  const emit = defineEmits<{
    saveHelpRequest: [helpRequest: EditHelpRequestInput]
  }>()

  const helpRequestData = computed(() => props.data.helpRequest)
  const permissions = computed(() => props.data.permissions)

  const initialDocumentIds = computed(
    () => helpRequestData.value.documents?.map(d => d.key) || []
  )

  const subject = computed(() =>
    helpRequestData.value.financialSupport
      ? HelpRequestSubject.Financial
      : HelpRequestSubject.Other
  )

  const { handleSubmit } = useForm<EditHelpRequestInput>({
    validationSchema: toTypedSchema(editHelpRequestSchema),
    initialValues: {
      ...helpRequestData.value,
      isRefundable: helpRequestData.value.isRefundable ? 'true' : 'false',
      isMinistry: application.value.module.ministere,
      date: helpRequestData.value.date,
      documents: initialDocumentIds.value,
      externalStructure: helpRequestData.value.externalStructure
        ? 'true'
        : 'false',
      askedAmount: prismaDecimalToNumber(helpRequestData.value.askedAmount),
      allocatedAmount: prismaDecimalToNumber(
        helpRequestData.value.allocatedAmount
      ),
      fullFile: helpRequestData.value.fullFile || false
    }
  })

  const { caughtErrors, onSubmit } = useCatchFormErrors<EditHelpRequestInput>(
    handleSubmit,
    values => {
      emit('saveHelpRequest', values)
    }
  )
</script>
