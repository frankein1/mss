<template>
  <BeneficiaryEditFormLayout
    :family-file-id="beneficiary?.familyFileId || ''"
    :family-identification="familyIdentification"
    :beneficiary-identification="beneficiaryIdentification"
    :schema="updateBeneficiaryGeneralInformationSchema"
    :binded-values="bindedValues"
    :permissions="permissions"
    :is-submitting="status === 'pending'"
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
        :permissions="permissions"
        :initial-beneficiary="beneficiaryIdentification"
        :initial-beneficiary-status="beneficiaryStatus"
        :members-accommodation
        @update="updateSimilarBeneficiary"
      />
    </AtomLazyComponent>
  </BeneficiaryEditFormLayout>
</template>

<script lang="ts" setup>
  import type { UpdateBeneficiaryGeneralInformationInput } from '~~/server/schema'
  import { updateBeneficiaryGeneralInformationSchema } from '~~/server/schema'
  import { routes } from '~/utils/routes'
  import type { SimilarBeneficiary } from '~~/server/trpc/routers'

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

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
    beneficiaryIdentification,
    familyIdentification,
    membersAccommodation,
    pending: beneficiaryPending,
    error: beneficiaryError,
    refresh
  } = await useBeneficiaryDetails(beneficiaryId, { accommodation: true })

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
      general
    } = beneficiary.value

    return {
      id,
      structureId,
      referents: referents.map(referent => referent.id),
      aidantConnectAuthorized,
      vulnerablePerson,
      ...general,
      qpv: general.qpv ? true : false,
      birthDate: general.birthDate ? new Date(general.birthDate) : undefined,
      deathDate: general.deathDate ? new Date(general.deathDate) : undefined
    }
  })

  const fetchError = computed(() => {
    if (beneficiaryError.value) {
      return "Les informations du bénéficiaire n'ont pas pu être chargées."
    }
    if (agentsError.value) {
      return "La liste des agents référents n'a pas pu être chargée."
    }
    return ''
  })

  const modal = useModal()
  const onSaveBeneficiary = (
    beneficiary: UpdateBeneficiaryGeneralInformationInput,
    target: string | undefined
  ) => {
    if (
      similarBeneficiary.value &&
      beneficiaryIdentification.value?.id !== similarBeneficiary.value.id
    ) {
      useBeneficiaryFormSimilarModal(modal, similarBeneficiary.value, () => {
        saveBeneficiary(beneficiary, target)
      })
      return
    }

    saveBeneficiary(beneficiary, target)
  }

  const router = trpcClient.beneficiary
  const { mutate, error, status } =
    router.updateGeneralInformation.useMutation()

  async function saveBeneficiary(
    ben: UpdateBeneficiaryGeneralInformationInput,
    target: string | undefined
  ) {
    if (!beneficiary.value) {
      return
    }

    const updated = await mutate(ben)

    if (error.value || !updated) {
      snackbar.error(
        'La mise à jour de la fiche bénéficiaire a échoué.',
        snackbar.focus('.actions-bar', "button[type='submit']" as FocusHTMLTag)
      )
      return
    }

    await refresh()
    navigateTo(target)
  }

  definePageMeta({
    layout: 'second-navigation'
  })
</script>
