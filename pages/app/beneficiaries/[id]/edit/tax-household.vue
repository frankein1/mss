<template>
  <BeneficiaryEditFormLayout
    :draft="draft"
    :beneficiary-identification="beneficiaryIdentification"
    :binded-values="bindedValues"
    :schema="updateBeneficiaryTaxHouseholdSchema"
    :permissions="permissions"
    :is-submitting="isSubmitting"
    :current-route="Route.AppBeneficiaryEditTaxHousehold"
    :has-required-fields="false"
    @save="onSaveBeneficiary"
  >
    <AtomAlert
      v-if="error"
      class="fr-mb-2w"
      :alert-type="AlertType.Error"
      message="Les informations du bénéficiaires n'ont pas pu être chargées."
    />
    <AtomLoader
      v-else-if="pending"
      class="fr-mx-auto"
    />
    <div
      v-else-if="bindedValues"
      class="fr-p-3v"
    >
      <AtomNotice
        class="fr-mx-n3v fr-mb-4w"
        :close-button="true"
      >
        <template #default
          >Si des membres du foyer étaient précédemment renseignés dans la
          section "foyer fiscal", ils se trouvent désormais dans la section
          "Entourage".</template
        >
      </AtomNotice>
      <BeneficiaryFormFamilySituation />
    </div>
  </BeneficiaryEditFormLayout>
</template>

<script lang="ts" setup>
  import {
    updateBeneficiaryTaxHouseholdSchema,
    UpdateBeneficiaryTaxHouseholdInput
  } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { RoutePath, Route } from '~/utils/routing'

  const trpcClient = useTrpcClient()

  const isSubmitting = ref(false)

  const route = useRoute()
  const beneficiaryId = route.params.id as string

  const { data, pending, error } =
    await trpcClient.beneficiary.getBeneficiaryDetails.useQuery({
      id: beneficiaryId
    })

  const permissions = computed(() => data.value?.permissions)

  const bindedValues = computed(() => {
    if (!data.value) {
      return null
    }

    const {
      beneficiary: { id, structureId, taxHouseholds }
    } = data.value

    return {
      id,
      structureId,
      familySituation: taxHouseholds?.familySituation || null,
      minorChildren: taxHouseholds?.minorChildren || null,
      majorChildren: taxHouseholds?.majorChildren || null,
      caregiver: taxHouseholds?.caregiver || false,
      weddingDate: taxHouseholds?.weddingDate
        ? new Date(taxHouseholds.weddingDate)
        : undefined,
      divorceDate: taxHouseholds?.divorceDate
        ? new Date(taxHouseholds.divorceDate)
        : undefined
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

  function onSaveBeneficiary(
    beneficiary: UpdateBeneficiaryTaxHouseholdInput,
    target: string | undefined,
    validate: boolean
  ) {
    if (!data.value) {
      return
    }
    const router = trpcClient.beneficiary
    const validateBeneficiary = router.validate.useMutation()
    const updateBeneficiary = router.updateTaxHousehold.useMutation()

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
        navigateTo(target || RoutePath.AppBeneficiary(beneficiaryId))
      },
      onFailure: () => {
        useSnackbar().error('La mise à jour de la fiche bénéficiaire a échoué.')
      }
    })
  }
</script>
