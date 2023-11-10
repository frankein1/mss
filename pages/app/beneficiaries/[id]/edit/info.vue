<template>
  <BeneficiaryEditFormLayout
    v-if="permissions"
    :schema="saveBeneficiaryGeneralInformationSchema"
    :permissions="permissions"
    :is-submitting="isSubmitting"
    :beneficiary="beneficiary"
    title-icon="fr-icon-user-line"
    :current-route="Route.AppBeneficiaryEditInfo"
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
      v-else-if="beneficiary && permissions && agents?.length"
      :permissions="permissions"
      :beneficiary="beneficiary"
      :agents="agents"
    />
  </BeneficiaryEditFormLayout>
</template>

<script lang="ts" setup>
  import {
    SaveBeneficiaryGeneralInformationInput,
    saveBeneficiaryGeneralInformationSchema
  } from '~/server/schema'
  import { MinimalBeneficiaryForFormLayout } from '~/types/beneficiary'
  import { AlertType } from '~/utils/constants/alert'
  import { RoutePath, Route } from '~/utils/routing'

  const trpcClient = useTrpcClient()

  const isSubmitting = ref(false)

  const route = useRoute()
  const beneficiaryId = route.params.id as string

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

  const permissions = computed(() => data.value?.permissions)

  const fetchError = computed(() => {
    if (beneficiaryError.value) {
      return "Les informations du bénéficiaires n'ont pas pu être chargées."
    }
    if (agentsError.value) {
      return "La liste des agents référents n'a pas pu être chargée."
    }
    return ''
  })

  const beneficiary = computed(() => {
    if (!data.value) {
      return null
    }

    const {
      beneficiary: { id, meta, general }
    } = data.value

    // Id is required for building the breadcrumb in the layout
    return {
      id,
      structureId: meta.structureId,
      referents: meta.referents.map(referent => referent.id),
      aidantConnectAuthorized: meta.aidantConnectAuthorized,
      status: meta.status,
      title: general.title,
      firstName: general.firstName,
      usualName: general.usualName,
      birthName: general.birthName,
      birthDate: general.birthDate ? new Date(general.birthDate) : undefined,
      birthPlace: general.birthPlace,
      deathDate: general.deathDate ? new Date(general.deathDate) : undefined,
      gender: general.gender,
      nationality: general.nationality,
      numeroPegase: general.numeroPegase,
      accommodationMode: general.accommodationMode,
      accommodationName: general.accommodationName,
      accommodationAdditionalInformation:
        general.accommodationAdditionalInformation,
      zipcode: general.zipcode,
      city: general.city,
      region: general.region,
      addressComplement: general.addressComplement,
      accommodationZone: general.accommodationZone,
      street: general.street,
      noPhone: general.noPhone,
      phone1: general.phone1,
      phone2: general.phone2,
      email: general.email,
      mobility: general.mobility
    } as SaveBeneficiaryGeneralInformationInput &
      MinimalBeneficiaryForFormLayout
  })

  function onSaveBeneficiary(
    beneficiary: SaveBeneficiaryGeneralInformationInput,
    target: string | undefined
  ) {
    if (!data.value) {
      return
    }

    const structureId = data.value.beneficiary.meta.structureId

    useTrpcMutation({
      mutation: () =>
        trpcClient.beneficiary.updateGeneralInformation.mutate({
          id: beneficiaryId,
          structureId,
          ...beneficiary
        }),
      isSubmitting,
      onSuccess: () => {
        navigateTo(target || RoutePath.AppBeneficiary(beneficiaryId))
      },
      onFailure: () => {
        useSnackbar().error('La mise à jour de la fiche bénéficiaire a échoué.')
      }
    })
  }
</script>
