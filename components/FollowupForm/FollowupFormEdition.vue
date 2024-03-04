<template>
  <FollowupForm
    :is-submitting="isSubmitting"
    :followup-types="followupTypes"
    :partner-organizations="partnerOrganizations"
    :beneficiary-id="followup.beneficiaryId"
    :medium="values.medium"
    :is-redirected="values.redirected"
    :can-set-private-synthesis="canSetPrivateSynthesis"
    :caught-errors="caughtErrors"
    @submit="onSubmit"
  />
</template>

<script lang="ts" setup>
  import {
    FollowupType
    // FollowupIntervention,
    // FollowupSignalement
  } from '@prisma/client'
  import { toTypedSchema } from '@vee-validate/zod'
  import { FollowupPageItem } from './types'
  import { EditFollowupInput, editFollowupSchema } from '~/server/schema'
  import { PartnerOrganizationIdName } from '~/types/partner'

  const { application } = usePermissions()

  const props = defineProps<{
    isSubmitting: boolean
    followupTypes: Array<FollowupType>
    partnerOrganizations: Array<PartnerOrganizationIdName>
    data: FollowupPageItem
  }>()

  const emit = defineEmits<{
    saveFollowup: [followup: EditFollowupInput]
  }>()

  const followup = computed(() => props.data.followup)
  const permissions = computed(() => props.data.permissions)

  const initialFollowUpTypeIds = computed(
    () => props.data.followup.types.map(f => f.id) || []
  )

  // const initialInterventions = computed<{
  //   [k in FollowupIntervention]?: boolean
  // }>(() =>
  //   Object.fromEntries(
  //     Object.values(FollowupIntervention).map(key => [
  //       key,
  //       followup.value.interventions?.includes(key)
  //     ])
  //   )
  // )

  // const initialSignalements = computed<{
  //   [k in FollowupSignalement]?: boolean
  // }>(() =>
  //   Object.fromEntries(
  //     Object.values(FollowupSignalement).map(key => [
  //       key,
  //       followup.value.signalements?.includes(key)
  //     ])
  //   )
  // )

  const canSetPrivateSynthesis = computed(
    () => permissions.value.set.privateSynthesis
  )

  const initialDocumentIds = computed(
    () => followup.value.documents?.map(d => d.key) || []
  )

  const { handleSubmit, values, meta } = useForm<EditFollowupInput>({
    validationSchema: toTypedSchema(editFollowupSchema),
    initialValues: {
      id: followup.value.id,
      socialSupportId: followup.value.socialSupportId,
      beneficiaryId: followup.value.beneficiaryId,
      medium: followup.value.medium,
      ministre: followup.value.ministre,
      numeroPegase: followup.value.numeroPegase,
      date: followup.value.date,
      synthesis: followup.value.synthesis,
      privateSynthesis: followup.value.privateSynthesis,
      status: followup.value.status,
      helpRequested: followup.value.helpRequested || false,
      structureName: followup.value.structureName,
      dueDate: followup.value.dueDate,
      thirdPersonName: followup.value.thirdPersonName,
      place: followup.value.place,
      prescribingOrganizationId: followup.value.prescribingOrganization?.id,
      types: initialFollowUpTypeIds.value,
      documents: initialDocumentIds.value,
      redirected: followup.value.redirected || false,
      firstFollowup: followup.value.firstFollowup || false,
      classified: followup.value.classified || false,
      forwardedToJustice: followup.value.forwardedToJustice || false,
      isMinistry: application.value.module.ministere,
      duration: followup.value.duration
      // ...initialInterventions.value,
      // ...initialSignalements.value
    }
  })

  const isFormDirty = computed(() => meta.value.dirty)

  const { isNavigatingWithFormActions } = useLeaveFormConfirmation({
    isFormDirty
  })

  const { onSubmit, caughtErrors } = useCatchFormErrors(
    handleSubmit,
    values => {
      isNavigatingWithFormActions.value = true
      emit('saveFollowup', values)
    }
  )
</script>
