<template>
  <BeneficiaryFormLayout
    :schema="saveBeneficiaryGeneralInformationSchema"
    :is-submitting="isSubmitting"
    :beneficiary="beneficiary"
    title-icon="fr-icon-user-line"
    :next-page="nextPage"
    :saved="saved"
    :current="Route.AppBeneficiaryEditInfo"
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
      v-else-if="beneficiary && agents?.length"
      :beneficiary="beneficiary"
      :agents="agents"
      :can-set-referents="canSetReferents"
    />
  </BeneficiaryFormLayout>
</template>

<script lang="ts" setup>
  import {
    SaveBeneficiaryGeneralInformationInput,
    saveBeneficiaryGeneralInformationSchema
  } from '~/server/schema'
  import {
    canEditBeneficiaryReferents,
    canEditBeneficiaryRelatives,
    canEditBeneficiaryHealthInfo
  } from '~/server/security/rules'
  import { useAuthStore } from '~/store/auth'
  import { AlertType } from '~/utils/constants/alert'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { RoutePath, RouteTitle, Route } from '~/utils/routing'

  definePageMeta({
    middleware: 'is-beneficiary-referent'
  })

  const trpcClient = useTrpcClient()

  const isSubmitting = ref(false)

  const authStore = useAuthStore()
  const route = useRoute()
  const beneficiaryId = route.params.id as string
  const saved = route.query.saved !== undefined
  const originTab = route.query.originTab
    ? (route.query.originTab as BeneficiaryTab)
    : undefined

  const {
    data: agents,
    pending: agentsPending,
    error: agentsError
  } = await trpcClient.config.getAgents.useQuery({})

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

  const fetchError = computed(() => {
    if (beneficiaryError.value) {
      return "Les informations du bénéficiaires n'ont pas pu être chargées."
    }
    if (agentsError.value) {
      return "La liste des agents référents n'a pas pu être chargée."
    }
    return ''
  })

  const user = computed(() => authStore.getAuthUser)

  const nextPage = computed(() => {
    if (!data.value) {
      return undefined
    }

    if (canEditBeneficiaryRelatives(user.value, data.value.beneficiary)) {
      return {
        title: RouteTitle.AppBeneficiaryEditTaxHousehold(),
        path: RoutePath.AppBeneficiaryEditTaxHousehold(beneficiaryId, {
          saved: true,
          originTab
        })
      }
    }

    if (canEditBeneficiaryHealthInfo(user.value, data.value.beneficiary)) {
      return {
        title: RouteTitle.AppBeneficiaryEditHealth(),
        path: RoutePath.AppBeneficiaryEditHealth(beneficiaryId, {
          saved: true,
          originTab
        })
      }
    }

    return undefined
  })

  const beneficiary = computed(() => {
    if (!data.value) {
      return null
    }

    const b = data.value.beneficiary

    // Id is required for building the breadcrumb in the layout
    return {
      id: b.id,
      referents: b.referents.map(referent => referent.id),
      aidantConnectAuthorized: b.aidantConnectAuthorized,
      status: b.status,
      title: b.title,
      firstName: b.firstName,
      usualName: b.usualName,
      birthName: b.birthName,
      birthDate: b.birthDate ? new Date(b.birthDate) : undefined,
      birthPlace: b.birthPlace,
      deathDate: b.deathDate ? new Date(b.deathDate) : undefined,
      gender: b.gender,
      nationality: b.nationality,
      numeroPegase: b.numeroPegase,
      accommodationMode: b.accommodationMode,
      accommodationName: b.accommodationName,
      accommodationAdditionalInformation: b.accommodationAdditionalInformation,
      zipcode: b.zipcode,
      city: b.city,
      region: b.region,
      addressComplement: b.addressComplement,
      accommodationZone: b.accommodationZone,
      street: b.street,
      noPhone: b.noPhone,
      phone1: b.phone1,
      phone2: b.phone2,
      email: b.email,
      mobility: b.mobility
    } as SaveBeneficiaryGeneralInformationInput & { id: string }
  })

  const canSetReferents = computed(() =>
    data.value?.beneficiary
      ? canEditBeneficiaryReferents(user.value, data.value.beneficiary)
      : false
  )

  async function onSaveBeneficiary(
    beneficiary: SaveBeneficiaryGeneralInformationInput,
    target: string | undefined
  ) {
    if (!data.value) {
      return
    }

    isSubmitting.value = true

    try {
      await trpcClient.beneficiary.updateGeneralInformation.mutate({
        id: beneficiaryId,
        structureId: data.value.beneficiary.structureId,
        ...beneficiary
      })

      navigateTo(target || RoutePath.AppBeneficiary(beneficiaryId))
    } catch {
      useSnackbar().error('La mise à jour de la fiche bénéficiaire a échoué.')
    } finally {
      isSubmitting.value = false
    }
  }
</script>
