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
    :is-owned-by-current-user="isOwnedByCurrentUser"
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
  import { isCreator } from '~/server/security/rules'
  import { useAuthStore } from '~/store/auth'
  import { pastStatusesFromStatus } from '~/utils/helpRequest/pastStatusesFromStatus'
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
    (e: 'saveHelpRequest', helpRequest: EditHelpRequestInput): void
  }>()

  const pastStatuses = computed(() => {
    if (!props.helpRequest) {
      return []
    }
    return pastStatusesFromStatus(props.helpRequest.status)
  })

  const isOwnedByCurrentUser = computed(() =>
    isCreator(authStore.getAuthUser, props.helpRequest, [
      'Administrator',
      'StructureManager',
      'SocialWorker',
      'Instructor',
      'ReceptionAgent',
      'Referent'
    ])
  )

  const initialDocumentIds = computed(
    () => props.helpRequest.documents.map(d => d.key) || []
  )

  const { handleSubmit, values } = useForm<EditHelpRequestInput>({
    validationSchema: toTypedSchema(editHelpRequestSchema),
    initialValues: {
      ...props.helpRequest,
      // FIXME: date type error
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
