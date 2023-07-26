<template>
  <HelpRequestForm
    :is-submitting="isSubmitting"
    :followup-types="followupTypes"
    :prescribing-organizations="prescribingOrganizations"
    :instructor-organizations="instructorOrganizations"
    :beneficiary-id="helpRequest.beneficiaryId"
    :status="values.status"
    :external-structure="values.externalStructure"
    :financial-support="values.financialSupport"
    :past-statuses="pastStatuses"
    is-editing
    :can-edit-private-synthesis="canEditPrivateSynthesis"
    @submit="onSubmit"
  />
</template>

<script lang="ts" setup>
  import {
    FollowupType,
    InstructorOrganization,
    PrescribingOrganization,
    Prisma
  } from '@prisma/client'
  import { useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import {
    EditHelpRequestInput,
    editHelpRequestSchema
  } from '~/server/schema/helpRequest.schema'
  import { canEditHelpRequestPrivateSynthesis } from '~/server/security/rules'
  import { useAuthStore } from '~/store/auth'
  import { pastStatusesFromStatus } from '~/utils/helpRequest'
  import { GetHelpRequestDetailsOutput } from '~/server/routers'

  const authStore = useAuthStore()

  const props = defineProps<{
    isSubmitting: boolean
    followupTypes: FollowupType[]
    prescribingOrganizations: PrescribingOrganization[]
    instructorOrganizations: InstructorOrganization[]
    helpRequest: GetHelpRequestDetailsOutput
  }>()

  const emit = defineEmits<{
    saveHelpRequest: [helpRequest: EditHelpRequestInput]
  }>()

  const pastStatuses = computed(() => {
    if (!props.helpRequest) {
      return []
    }
    return pastStatusesFromStatus(props.helpRequest.status)
  })

  const canEditPrivateSynthesis = computed(() =>
    canEditHelpRequestPrivateSynthesis(authStore.getAuthUser, props.helpRequest)
  )

  const initialDocumentIds = computed(
    () => props.helpRequest.documents?.map(d => d.key) || []
  )

  const { handleSubmit, values } = useForm<EditHelpRequestInput>({
    validationSchema: toTypedSchema(editHelpRequestSchema),
    initialValues: {
      ...props.helpRequest,
      openingDate: props.helpRequest.openingDate,
      documents: initialDocumentIds.value,
      financialSupport: props.helpRequest.financialSupport ? 'true' : 'false',
      externalStructure: props.helpRequest.externalStructure ? 'true' : 'false',
      askedAmount: props.helpRequest.askedAmount
        ? new Prisma.Decimal(props.helpRequest.askedAmount).toNumber()
        : undefined,
      allocatedAmount: props.helpRequest.allocatedAmount
        ? new Prisma.Decimal(props.helpRequest.allocatedAmount).toNumber()
        : undefined,
      fullFile: props.helpRequest.fullFile || false
    }
  })

  const onSubmit = handleSubmit(values => {
    emit('saveHelpRequest', values)
  })
</script>
