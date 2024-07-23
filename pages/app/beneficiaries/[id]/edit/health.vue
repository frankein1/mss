<template>
  <BeneficiaryEditFormLayout
    :draft="draft"
    :beneficiary-identification="beneficiaryIdentification"
    :binded-values="bindedValues"
    :permissions="permissions"
    :schema="updateBeneficiaryHealthSchema"
    :is-submitting="isSubmitting"
    :current-route="routes.beneficiary.AppBeneficiaryEditHealth.name"
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
      <div
        class="fr-grid-row fr-grid-row--center fr-grid-row--gutters fr-pb-3w"
      >
        <AtomNotice>
          <template #default> Attention aux données de santé </template>

          <template #content>
            Vous ne pouvez manipuler des données de santé des bénéficiaires que
            si votre structure est habilitée à le faire au titre de l'article 9
            du RGPD (pour plus d'information voir
            <a
              target="_blank"
              href="/notice/20231103_donnees_sante_monsuivisocial.pdf"
              rel="noopener external"
              title="Notice d'information - nouvelle fenêtre"
              >la notice d'information</a
            >
            ou référez-vous à votre responsable de structure). Nous vous
            encourageons également à ne mentionner que les données qui sont
            strictement nécessaires au suivi des bénéficiaires.
          </template>
        </AtomNotice>
      </div>
      <BeneficiaryFormHealth :permissions="permissions" />
    </div>
  </BeneficiaryEditFormLayout>
</template>

<script lang="ts" setup>
  import {
    updateBeneficiaryHealthSchema,
    UpdateBeneficiaryHealthInput
  } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'

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
      beneficiary: { id, structureId, health }
    } = data.value

    return {
      id,
      structureId,
      ...health
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
    beneficiary: UpdateBeneficiaryHealthInput,
    target: string | undefined,
    validate: boolean
  ) {
    if (!data.value) {
      return
    }

    const router = trpcClient.beneficiary
    const validateBeneficiary = router.validate.useMutation()
    const updateBeneficiary = router.updateHealth.useMutation()

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
    () => routes.beneficiary.AppBeneficiaryEditHealth.name
  )
</script>
