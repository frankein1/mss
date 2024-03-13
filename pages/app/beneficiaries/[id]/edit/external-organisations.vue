<template>
  <BeneficiaryEditFormLayout
    :draft="draft"
    :beneficiary-identification="beneficiaryIdentification"
    :binded-values="bindedValues"
    :permissions="permissions"
    :schema="updateBeneficiaryExternalOrganisationsSchema"
    :is-submitting="isSubmitting"
    :current-route="Route.AppBeneficiaryEditExternalOrganisations"
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
      <BeneficiaryFormExternalOrganisations />
    </div>
  </BeneficiaryEditFormLayout>
</template>

<script lang="ts" setup>
  import {
    updateBeneficiaryExternalOrganisationsSchema,
    UpdateBeneficiaryExternalOrganisationsInput
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
      beneficiary: { id, structureId, externalOrganisations }
    } = data.value

    return {
      id,
      structureId,
      ...externalOrganisations
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
    beneficiary: UpdateBeneficiaryExternalOrganisationsInput,
    target: string | undefined,
    validate: boolean
  ) {
    if (!data.value) {
      return
    }

    useTrpcMutation({
      mutation: () => {
        const router = trpcClient.beneficiary
        const validateBeneficiary = router.validate.mutate({
          id: beneficiaryId
        })
        const updateBeneficiary =
          router.updateExternalOrganisations.mutate(beneficiary)

        const res = []
        if (validate && draft.value) {
          res.push(validateBeneficiary)
        }
        res.push(updateBeneficiary)
        return Promise.all(res)
      },
      isSubmitting,
      onSuccess: () => {
        navigateTo(target || RoutePath.AppBeneficiary(beneficiaryId))
      },
      onFailure: () => {
        useSnackbar().error('La mise à jour de la fiche bénéficaire a échoué.')
      }
    })
  }
</script>
