<template>
  <BeneficiaryEditFormLayout
    :beneficiary="beneficiary?.identity || null"
    :permissions="permissions"
    :schema="saveBeneficiaryHealthSchema"
    :is-submitting="isSubmitting"
    :current-route="Route.AppBeneficiaryEditHealth"
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
      v-else-if="beneficiary && permissions"
      class="fr-p-3v"
    >
      <div
        v-if="application.module.health"
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
    saveBeneficiaryHealthSchema,
    SaveBeneficiaryHealthInput
  } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { RoutePath, Route } from '~/utils/routing'

  const trpcClient = useTrpcClient()

  const isSubmitting = ref(false)

  const { application } = usePermissions()

  const route = useRoute()
  const beneficiaryId = route.params.id as string

  const { data, pending, error } =
    await trpcClient.beneficiary.getBeneficiaryDetails.useQuery({
      id: beneficiaryId
    })

  const permissions = computed(() => data.value?.permissions)

  const beneficiary = computed(() =>
    data.value ? data.value.beneficiary : null
  )

  function onSaveBeneficiary(
    beneficiary: SaveBeneficiaryHealthInput,
    target: string | undefined
  ) {
    if (!data.value) {
      return
    }

    useTrpcMutation({
      mutation: () =>
        trpcClient.beneficiary.updateHealth.mutate({
          id: beneficiaryId,
          ...beneficiary
        }),
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
