<template>
  <BeneficiaryEditFormLayout
    :family-file-id="beneficiary?.familyFileId || ''"
    :family-identification="familyIdentification"
    :beneficiary-identification="beneficiaryIdentification"
    :binded-values="bindedValues"
    :permissions="permissions"
    :schema="updateBeneficiaryExternalOrganisationsSchema"
    :is-submitting="status === 'pending'"
    :current-route="
      routes.beneficiary.AppBeneficiaryEditExternalOrganisations.name
    "
    :small-title="true"
    :title-icon="getFormIcon(familyIdentification.length)"
    @save="onSaveBeneficiary"
  >
    <AtomLazyComponent
      :pending
      :error="Boolean(errorBen || errorPartner)"
      message="Les informations du bénéficiaire n'ont pas pu être chargées."
    >
      <BeneficiaryFormExternalOrganisations
        v-if="bindedValues && partnerOrganizations"
        :partner-organizations="partnerOrganizations"
        :external-organisations="beneficiary?.externalOrganisations"
      />
    </AtomLazyComponent>
  </BeneficiaryEditFormLayout>
</template>

<script lang="ts" setup>
  import type { UpdateBeneficiaryExternalOrganisationsInput } from '~~/server/schema'
  import { updateBeneficiaryExternalOrganisationsSchema } from '~~/server/schema'
  import { routes } from '~/utils/routes'

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const route = useRoute()
  const beneficiaryId = route.params.id as string

  const [beneficiaryDetails, partnerResult] = await Promise.all([
    useBeneficiaryDetails(beneficiaryId),
    trpcClient.partner.getAll.useQuery()
  ])

  const {
    beneficiary,
    permissions,
    beneficiaryIdentification,
    familyIdentification,
    pending: beneficiaryPending,
    error: errorBen
  } = beneficiaryDetails

  const {
    data: partnerOrganizations,
    pending: partnerOrganizationsPending,
    error: errorPartner
  } = partnerResult

  const pending = computed(
    () => beneficiaryPending.value || partnerOrganizationsPending.value
  )

  const bindedValues = computed(() => {
    if (!beneficiary.value) {
      return null
    }

    const { id, externalOrganisations } = beneficiary.value

    return {
      id,
      protectionMeasure: externalOrganisations?.protectionMeasure,
      representative: externalOrganisations?.representative,
      prescribingOrganizationId:
        externalOrganisations?.prescribingOrganization?.id || null,
      prescribingOrganizationContactId:
        externalOrganisations?.prescribingOrganizationContact?.id || null,
      contributingPartners: (
        externalOrganisations?.contributingPartners || []
      ).map(cp => ({
        id: cp.id,
        partnerOrganizationId: cp.partnerOrganization.id,
        partnerOrganizationContactId: cp.partnerOrganizationContact?.id || null,
        precisions: cp.precisions
      }))
    }
  })

  const router = trpcClient.beneficiary
  const { mutate, error, status } =
    router.updateExternalOrganisations.useMutation()

  async function onSaveBeneficiary(
    ben: UpdateBeneficiaryExternalOrganisationsInput,
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

    navigateTo(target)
  }

  definePageMeta({
    layout: 'second-navigation'
  })
</script>
