<template>
  <BeneficiaryEditFormLayout
    :draft="draft"
    :beneficiary-identification="beneficiaryIdentification"
    :schema="updateBeneficiaryGeneralInformationSchema"
    :binded-values="bindedValues"
    :permissions="permissions"
    :is-submitting="isSubmitting"
    title-icon="fr-icon-user-line"
    :current-route="routes.beneficiary.AppBeneficiaryEditInfo.name"
    @save="onSaveBeneficiary"
  >
    <AtomAlert
      v-if="fetchError"
      class="fr-mb-2w"
      :alert-type="AlertType.Error"
      :message="fetchError"
    />
    <AtomLoader
      v-else-if="pending"
      class="fr-mx-auto"
    />
    <BeneficiaryFormGeneralInformation
      v-else-if="bindedValues && permissions && agents?.length"
      :permissions="permissions"
      :beneficiary-referent-ids="beneficiaryReferentIds"
      :agents="agents"
    />
  </BeneficiaryEditFormLayout>
</template>

<script lang="ts" setup>
  import {
    UpdateBeneficiaryGeneralInformationInput,
    updateBeneficiaryGeneralInformationSchema
  } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'

  const trpcClient = useTrpcClient()

  const isSubmitting = ref(false)

  const route = useRoute()
  const beneficiaryId = route.params.id as string

  const {
    data: agents,
    pending: agentsPending,
    error: agentsError
  } = await trpcClient.config.getAgents.useQuery()

  const {
    data,
    pending: beneficiaryPending,
    error: beneficiaryError
  } = await trpcClient.beneficiary.getBeneficiaryDetails.useQuery({
    id: beneficiaryId
  })

  const pending = computed(
    () => agentsPending.value || beneficiaryPending.value
  )

  const permissions = computed(() => data.value?.permissions)

  const beneficiaryReferentIds = computed(() =>
    data.value ? data.value.beneficiary.referents.map(r => r.id) : []
  )

  const bindedValues = computed(() => {
    if (!data.value) {
      return null
    }

    const {
      beneficiary: {
        id,
        structureId,
        referents,
        aidantConnectAuthorized,
        vulnerablePerson,
        status,
        general
      }
    } = data.value

    return {
      id,
      structureId,
      referents: referents.map(referent => referent.id),
      aidantConnectAuthorized,
      vulnerablePerson,
      status,
      ...general,
      birthDate: general.birthDate ? new Date(general.birthDate) : undefined,
      deathDate: general.deathDate ? new Date(general.deathDate) : undefined
    }
  })
  const draft = computed(() => {
    if (!data.value) {
      return true
    }

    return data.value.beneficiary.draft
  })

  const beneficiaryIdentification = computed(() =>
    data.value
      ? {
          id: data.value.beneficiary.id,
          firstName: data.value.beneficiary.general.firstName,
          birthName: data.value.beneficiary.general.birthName,
          usualName: data.value.beneficiary.general.usualName,
          birthDate: data.value.beneficiary.general.birthDate
        }
      : null
  )

  const fetchError = computed(() => {
    if (beneficiaryError.value) {
      return "Les informations du bénéficiaires n'ont pas pu être chargées."
    }
    if (agentsError.value) {
      return "La liste des agents référents n'a pas pu être chargée."
    }
    return ''
  })

  function onSaveBeneficiary(
    beneficiary: UpdateBeneficiaryGeneralInformationInput,
    target: string | undefined,
    validate: boolean
  ) {
    if (!data.value) {
      return
    }

    const router = trpcClient.beneficiary
    const validateBeneficiary = router.validate.useMutation()
    const updateBeneficiary = router.updateGeneralInformation.useMutation()

    useTrpcMutation({
      mutation: () => {
        const mutations = []
        if (validate && draft.value) {
          mutations.push(validateBeneficiary.mutate({ id: beneficiaryId }))
        }
        mutations.push(updateBeneficiary.mutate(beneficiary))
        return Promise.all(mutations)
      },
      isSubmitting,
      onSuccess: () => {
        navigateTo(
          target || routes.beneficiary.AppBeneficiary.path(beneficiaryId)
        )
      },
      onFailure: () => {
        useSnackbar().error('La mise à jour de la fiche bénéficiaire a échoué.')
      }
    })
  }
</script>
