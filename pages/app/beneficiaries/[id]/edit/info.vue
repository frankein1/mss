<template>
  <BeneficiaryEditFormLayout
    :draft
    :family-file-id="beneficiary?.familyFileId || ''"
    :family-identification="familyIdentification"
    :beneficiary-identification="beneficiaryIdentification"
    :schema="updateBeneficiaryGeneralInformationSchema"
    :binded-values="bindedValues"
    :permissions="permissions"
    :is-submitting="isSubmitting"
    :title-icon="getFormIcon(familyIdentification.length)"
    :current-route="routes.beneficiary.AppBeneficiaryEditInfo.name"
    @save="onSaveBeneficiary"
  >
    <AtomLazyComponent
      :pending
      :error="Boolean(fetchError)"
      :message="fetchError"
    >
      <BeneficiaryFormGeneralInformation
        v-if="bindedValues && permissions && agents?.length"
        :permissions="permissions"
        :beneficiary-referent-ids="beneficiaryReferentIds"
        :agents="agents"
      />
    </AtomLazyComponent>
  </BeneficiaryEditFormLayout>
</template>

<script lang="ts" setup>
  import {
    UpdateBeneficiaryGeneralInformationInput,
    updateBeneficiaryGeneralInformationSchema
  } from '~/server/schema'
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
    beneficiary,
    permissions,
    draft,
    beneficiaryIdentification,
    familyIdentification,
    pending: beneficiaryPending,
    error: beneficiaryError
  } = await useBeneficiaryDetails(beneficiaryId)

  const pending = computed(
    () => agentsPending.value || beneficiaryPending.value
  )

  const beneficiaryReferentIds = computed(() =>
    beneficiary.value ? beneficiary.value.referents.map(r => r.id) : []
  )

  const bindedValues = computed(() => {
    if (!beneficiary.value) {
      return null
    }

    const {
      id,
      structureId,
      referents,
      aidantConnectAuthorized,
      vulnerablePerson,
      status,
      general
    } = beneficiary.value

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
    ben: UpdateBeneficiaryGeneralInformationInput,
    target: string | undefined,
    validate: boolean
  ) {
    if (!beneficiary.value) {
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
        mutations.push(updateBeneficiary.mutate(ben))
        return Promise.all(mutations)
      },
      isSubmitting,
      onSuccess: () => {
        const fileRoute = routes.file.AppFile.path(
          beneficiary.value?.familyFileId || '',
          { beneficiaryId: beneficiary.value?.id }
        )
        navigateTo(target || fileRoute)
      },
      onFailure: () => {
        useSnackbar().error('La mise à jour de la fiche bénéficiaire a échoué.')
      }
    })
  }
</script>
