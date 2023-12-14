<template>
  <HelpRequestForm
    :is-submitting="isSubmitting"
    :followup-types="followupTypes"
    :prescribing-organizations="prescribingOrganizations"
    :instructor-organizations="instructorOrganizations"
    :beneficiary-id="helpRequest.beneficiaryId"
    :can-edit-private-synthesis="permissions?.set.privateSynthesis"
    :caught-errors="caughtErrors"
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
  import { EditHelpRequestInput, editHelpRequestSchema } from '~/server/schema'
  import { GetHelpRequestDetailsOutput } from '~/server/trpc/routers'
  import { prismaDecimalToNumber } from '~/utils/prisma'

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

  const { data: permissions } =
    await useTrpcClient().permissions.getHelpRequestEditionPermissions.useQuery()

  const initialDocumentIds = computed(
    () => props.helpRequest.documents?.map(d => d.key) || []
  )

  const { handleSubmit } = useForm<EditHelpRequestInput>({
    validationSchema: toTypedSchema(editHelpRequestSchema),
    initialValues: {
      ...props.helpRequest,
      openingDate: props.helpRequest.openingDate,
      documents: initialDocumentIds.value,
      externalStructure: props.helpRequest.externalStructure ? 'true' : 'false',
      askedAmount: prismaDecimalToNumber(props.helpRequest.askedAmount),
      allocatedAmount: prismaDecimalToNumber(props.helpRequest.allocatedAmount),
      fullFile: props.helpRequest.fullFile || false
    }
  })

  const { caughtErrors, onSubmit } = useCatchFormErrors<EditHelpRequestInput>(
    handleSubmit,
    values => {
      emit('saveHelpRequest', values)
    }
  )
</script>
