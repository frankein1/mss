<template>
  <BeneficiaryEditFormLayout
    :draft
    :family-file-id="beneficiary?.familyFileId || ''"
    :family-identification="familyIdentification"
    :beneficiary-identification="beneficiaryIdentification"
    :binded-values="bindedValues"
    :permissions="permissions"
    :schema="updateBeneficiaryHealthSchema"
    :is-submitting="isSubmitting"
    :current-route="routes.beneficiary.AppBeneficiaryEditHealth.name"
    :small-title="true"
    :title-icon="getFormIcon(familyIdentification.length)"
    @save="onSaveBeneficiary"
  >
    <AtomLazyComponent
      :pending
      :error="Boolean(error)"
      message="Les informations du bénéficiaires n'ont pas pu être chargées."
    >
      <div
        v-if="bindedValues && permissions"
        class="fr-p-3v"
      >
        <h2 class="title-blue fr-mb-6v">{{ pageTitle }}</h2>
        <div
          class="fr-grid-row fr-grid-row--center fr-grid-row--gutters fr-pb-3w"
        >
          <AtomNotice>
            <template #default> Attention aux données de santé </template>

            <template #content>
              Vous ne pouvez manipuler des données de santé des bénéficiaires
              que si votre structure est habilitée à le faire au titre de
              l'article 9 du RGPD (pour plus d'information voir
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
        <BeneficiaryFormHealth :permissions />
      </div>
    </AtomLazyComponent>
  </BeneficiaryEditFormLayout>
</template>

<script lang="ts" setup>
  import {
    updateBeneficiaryHealthSchema,
    UpdateBeneficiaryHealthInput
  } from '~/server/schema'
  import { routes } from '~/utils/routes'

  const trpcClient = useTrpcClient()

  const isSubmitting = ref(false)

  const route = useRoute()
  const beneficiaryId = route.params.id as string

  const {
    beneficiary,
    permissions,
    draft,
    beneficiaryIdentification,
    familyIdentification,
    pending,
    error
  } = await useBeneficiaryDetails(beneficiaryId)

  const bindedValues = computed(() => {
    if (!beneficiary.value) {
      return null
    }

    const { id, structureId, health } = beneficiary.value

    return {
      id,
      structureId,
      ...health
    }
  })

  function onSaveBeneficiary(
    ben: UpdateBeneficiaryHealthInput,
    target: string | undefined,
    validate: boolean
  ) {
    if (!beneficiary.value) {
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
        mutations.push(updateBeneficiary.mutate(ben))
        return Promise.all(mutations)
      },
      isSubmitting,
      onSuccess: () => {
        const fileRoute = routes.file.AppFile.path(
          beneficiary.value?.familyFileId || '',
          { beneficiaryId: beneficiary.value?.id }
        )
        navigateTo(target || fileRoute)
      },
      onFailure: () => {
        useSnackbar().error('La mise à jour de la fiche bénéficaire a échoué.')
      }
    })
  }

  const pageTitle = computed(
    () => routes.beneficiary.AppBeneficiaryEditHealth.title
  )
</script>
