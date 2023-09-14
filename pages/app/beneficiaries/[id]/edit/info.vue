<template>
  <BeneficiaryFormLayout
    :schema="saveBeneficiaryGeneralInformationSchema"
    :is-submitting="isSubmitting"
    :beneficiary="beneficiary"
    :title="RouteTitle.AppBeneficiaryEditInfo()"
    is-editting
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
    <BeneficiaryFormGeneralInformation2
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
  import { canEditBeneficiaryReferents } from '~/server/security/rules'
  import { useAuthStore } from '~/store/auth'
  import { AlertType } from '~/utils/constants/alert'
  import { RoutePath, RouteTitle } from '~/utils/routing'

  definePageMeta({
    middleware: 'is-beneficiary-referent'
  })

  const trpcClient = useTrpcClient()

  const isSubmitting = ref(false)

  const authStore = useAuthStore()
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

  const beneficiary = computed(() => {
    if (!data.value) {
      return null
    }

    const b = data.value.beneficiary

    return {
      referents: b.referents.map(referent => referent.id),
      aidantConnectAuthorized: b.aidantConnectAuthorized,
      status: b.status,
      title: b.title,
      firstName: b.firstName || '',
      usualName: b.usualName,
      birthName: b.birthName || '',
      birthDate: b.birthDate,
      birthPlace: b.birthPlace,
      deathDate: b.deathDate,
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
      postOfficeBox: b.postOfficeBox,
      accommodationZone: b.accommodationZone,
      street: b.street,
      noPhone: b.noPhone,
      phone1: b.phone1,
      phone2: b.phone2,
      email: b.email,
      caregiver: b.caregiver,
      mobility: b.mobility
    } as SaveBeneficiaryGeneralInformationInput
  })

  const canSetReferents = computed(() =>
    data.value?.beneficiary
      ? canEditBeneficiaryReferents(user.value, data.value.beneficiary)
      : false
  )

  async function onSaveBeneficiary(
    beneficiary: SaveBeneficiaryGeneralInformationInput
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

      navigateTo(RoutePath.AppBeneficiary(beneficiaryId))
    } catch {
      useSnackbar().error('La mise à jour de la synthèse a échoué.')
    } finally {
      isSubmitting.value = false
    }
  }
</script>
