<template>
  <BeneficiaryEditFormLayout
    :draft="draft"
    :beneficiary-identification="beneficiaryIdentification"
    :schema="updateBeneficiaryOccupationSchema"
    :binded-values="bindedValues"
    :permissions="permissions"
    :is-submitting="isSubmitting"
    :current-route="routes.beneficiary.AppBeneficiaryEditOccupation.name"
    :small-title="true"
    title-icon="fr-icon-user-line"
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
      v-else-if="bindedValues && permissions"
      class="fr-p-3v"
    >
      <h2 class="title-blue fr-mb-6v">{{ pageTitle }}</h2>
      <BeneficiaryFormOccupationIncome />
    </div>
  </BeneficiaryEditFormLayout>
</template>

<script lang="ts" setup>
  import {
    updateBeneficiaryOccupationSchema,
    UpdateBeneficiaryOccupationInput
  } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'

  definePageMeta({
    name: routes.beneficiary.AppBeneficiaryEditOccupation.name
  })

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
      beneficiary: { id, structureId, occupationIncome }
    } = data.value

    return {
      id,
      structureId,
      ...occupationIncome,
      pensionOrganisations: occupationIncome?.pensionOrganisations || []
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
    beneficiary: UpdateBeneficiaryOccupationInput,
    target: string | undefined,
    validate: boolean
  ) {
    if (!data.value) {
      return
    }

    const router = trpcClient.beneficiary
    const validateBeneficiary = router.validate.useMutation()
    const updateBeneficiary = router.updateOccupationIncome.useMutation()

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
        useSnackbar().error('La mise à jour de la fiche bénéficaire a échoué.')
      }
    })
  }
  const pageTitle = computed(
    () => routes.beneficiary.AppBeneficiaryEditOccupation.title
  )
</script>
