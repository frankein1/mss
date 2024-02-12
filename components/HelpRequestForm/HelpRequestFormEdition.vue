<template>
  <HelpRequestForm
    :is-submitting="isSubmitting"
    :followup-types="followupTypes"
    :prescribing-organizations="prescribingOrganizations"
    :instructor-organizations="instructorOrganizations"
    :beneficiary-id="socialSupport.beneficiary.id"
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
    PrescribingOrganization,
    FileInstructionType
  } from '@prisma/client'
  import { toTypedSchema } from '@vee-validate/zod'
  import { HelpRequestPageItem } from './types'
  import { EditHelpRequestInput, editHelpRequestSchema } from '~/server/schema'
  import { prismaDecimalToNumber } from '~/utils/prisma'

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

  const helpRequest = computed(() => props.data.helpRequest)
  const fileInstruction = computed(() => helpRequest.value.fileInstruction)
  const socialSupport = computed(() => fileInstruction.value.socialSupport)
  const permissions = computed(() => props.data.permissions)

  const initialDocumentIds = computed(
    () => socialSupport.value.documents?.map(d => d.key) || []
  )

  const subject = computed(() =>
    helpRequest.value.financialSupport
      ? FileInstructionType.Financial
      : FileInstructionType.Other
  )

  const { handleSubmit } = useForm<EditHelpRequestInput>({
    validationSchema: toTypedSchema(editHelpRequestSchema),
    initialValues: {
      id: helpRequest.value.id,
      socialSupportId: socialSupport.value.id,
      beneficiaryId: socialSupport.value.beneficiary.id,
      numeroPegase: socialSupport.value.numeroPegase,
      ministre: socialSupport.value.ministre,
      typeId: helpRequest.value.typeId,
      status: socialSupport.value.status,
      examinationDate: fileInstruction.value.examinationDate,
      decisionDate: fileInstruction.value.decisionDate,
      paymentMethod: helpRequest.value.paymentMethod,
      paymentDate: helpRequest.value.paymentDate,
      handlingDate: helpRequest.value.handlingDate,
      refusalReason: fileInstruction.value.refusalReason,
      prescribingOrganizationId: helpRequest.value.prescribingOrganizationId,
      instructorOrganizationId: fileInstruction.value.instructorOrganizationId,
      dispatchDate: fileInstruction.value.dispatchDate,
      synthesis: socialSupport.value.synthesis,
      privateSynthesis: socialSupport.value.privateSynthesis,
      dueDate: socialSupport.value.dueDate,
      isRefundable: helpRequest.value.isRefundable ? 'true' : 'false',
      isMinistry: application.value.module.ministere,
      date: socialSupport.value.date,
      documents: initialDocumentIds.value,
      externalStructure: fileInstruction.value.externalStructure
        ? 'true'
        : 'false',
      askedAmount: prismaDecimalToNumber(helpRequest.value.askedAmount),
      allocatedAmount: prismaDecimalToNumber(helpRequest.value.allocatedAmount),
      fullFile: fileInstruction.value.fullFile || false
    }
  })

  const { caughtErrors, onSubmit } = useCatchFormErrors<EditHelpRequestInput>(
    handleSubmit,
    values => {
      emit('saveHelpRequest', values)
    }
  )
</script>
