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
        :beneficiary-referent-ids="beneficiaryReferentIds"
        :agents="agents"
        :initial-beneficiary="beneficiaryIdentification"
        :initial-beneficiary-status="beneficiaryStatus"
        @update="updateSimilarBeneficiary"
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
  import { SimilarBeneficiary } from '~/server/trpc/routers'

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const isSubmitting = ref(false)
  const similarBeneficiary = ref<SimilarBeneficiary>(undefined)

  const route = useRoute()
  const beneficiaryId = route.params.id as string

  const updateSimilarBeneficiary = (
    receivedSimilarBeneficiary: SimilarBeneficiary
  ) => {
    similarBeneficiary.value = receivedSimilarBeneficiary
  }

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

  const beneficiaryStatus = computed(() =>
    beneficiary.value ? beneficiary.value.status : undefined
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
      qpv: general.qpv ? true : false,
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

  const onSaveBeneficiary = (
    beneficiary: UpdateBeneficiaryGeneralInformationInput,
    target: string | undefined,
    validate: boolean
  ) => {
    if (
      similarBeneficiary.value &&
      beneficiaryIdentification.value?.id !== similarBeneficiary.value.id
    ) {
      useBeneficiaryFormSimilarModal(similarBeneficiary.value, () => {
        saveBeneficiary(beneficiary, target, validate)
      })
      return
    }

    saveBeneficiary(beneficiary, target, validate)
  }

  function saveBeneficiary(
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
    const errMessage = 'La mise à jour de la fiche bénéficaire a échoué.'

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
        if (updateBeneficiary.error.value) {
          snackbar.error(errMessage, snackbar.focus('form', 'select'))
          return
        }

        const fileRoute = routes.file.AppFile.path(
          beneficiary.value?.familyFileId || '',
          { beneficiaryId: beneficiary.value?.id }
        )
        navigateTo(target || fileRoute)
      },
      onFailure: () => {
        snackbar.error(errMessage, snackbar.focus('form', 'select'))
      }
    })
  }
</script>
