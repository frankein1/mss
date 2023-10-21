<template>
  <FollowupForm
    :is-submitting="isSubmitting"
    :followup-types="followupTypes"
    :prescribing-organizations="prescribingOrganizations"
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
    FollowupType,
    PrescribingOrganization,
    FollowupIntervention,
    FollowupSignalement
  } from '@prisma/client'
  import { toTypedSchema } from '@vee-validate/zod'
  import { canEditFollowupPrivateSynthesis } from '~/server/security/rules'
  import { EditFollowupInput, editFollowupSchema } from '~/server/schema'
  import { useAuthStore } from '~/store/auth'
  import { GetFollowupDetailsOutput } from '~/server/trpc/routers'

  const authStore = useAuthStore()

  const props = defineProps<{
    isSubmitting: boolean
    followupTypes: Array<FollowupType>
    prescribingOrganizations: Array<PrescribingOrganization>
    followup: GetFollowupDetailsOutput
  }>()

  const emit = defineEmits<{
    saveFollowup: [followup: EditFollowupInput]
  }>()

  const initialFollowUpTypeIds = computed(
    () => props.followup.types.map(f => f.id) || []
  )

  const initialInterventions = computed<{
    [k in FollowupIntervention]?: boolean
  }>(() =>
    Object.fromEntries(
      Object.values(FollowupIntervention).map(key => [
        key,
        props.followup.interventions?.includes(key)
      ])
    )
  )

  const initialSignalements = computed<{
    [k in FollowupSignalement]?: boolean
  }>(() =>
    Object.fromEntries(
      Object.values(FollowupSignalement).map(key => [
        key,
        props.followup.signalements?.includes(key)
      ])
    )
  )

  const user = computed(() => authStore.getAuthUser)

  const canSetPrivateSynthesis = computed(() =>
    canEditFollowupPrivateSynthesis(user.value, props.followup)
  )

  const initialDocumentIds = computed(
    () => props.followup.documents?.map(d => d.key) || []
  )

  const { handleSubmit, values } = useForm<EditFollowupInput>({
    validationSchema: toTypedSchema(editFollowupSchema),
    initialValues: {
      ...props.followup,
      types: initialFollowUpTypeIds.value,
      documents: initialDocumentIds.value,
      helpRequested: props.followup.helpRequested || false,
      redirected: props.followup.redirected || false,
      firstFollowup: props.followup.firstFollowup || false,
      classified: props.followup.classified || false,
      forwardedToJustice: props.followup.forwardedToJustice || false,
      ...initialInterventions.value,
      ...initialSignalements.value
    }
  })

  const { onSubmit, caughtErrors } = useCatchFormErrors(
    handleSubmit,
    values => {
      emit('saveFollowup', values)
    }
  )
</script>
