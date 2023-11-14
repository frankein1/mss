<template>
  <BeneficiaryEditFormLayout
    :permissions="permissions"
    :schema="saveBeneficiaryHealthSchema"
    :is-submitting="isSubmitting"
    :beneficiary="beneficiary"
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
        class="fr-grid-row fr-grid-row--gutters fr-px-6w fr-py-2w fr-mb-3w health-info"
      >
        <div class="health-info__title fr-icon-info-fill fr-text--md fr-mb-0">
          Attention aux données de santé
        </div>
        <p class="fr-pl-3w">
          Vous ne pouvez manipuler des données de santé des bénéficiaires que si
          votre structure est habilité à le faire au titre de l'article 9 du
          RGPD (pour plus d'information voir
          <a
            target="_blank"
            href="/notice/20231103_donnees_sante_monsuivisocial.pdf"
            >la notice d'information</a
          >
          ou référez-vous à votre responsable de structure). Nous vous
          encourageons également à ne mentionner que les données qui sont
          strictement nécessaires au suivi des bénéficiaires.
        </p>
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
  import type { MinimalBeneficiaryForFormLayout } from '~/types/beneficiary'

  const trpcClient = useTrpcClient()

  const isSubmitting = ref(false)

  const route = useRoute()
  const beneficiaryId = route.params.id as string

  const { data, pending, error } =
    await trpcClient.beneficiary.getBeneficiaryDetails.useQuery({
      id: beneficiaryId
    })

  const permissions = computed(() => data.value?.permissions)

  const beneficiary = computed(() => {
    if (!data.value) {
      return null
    }

    const {
      beneficiary: { id, structureId, referents, general, health }
    } = data.value

    // Names and id are required for building the breadcrumb in the layout
    return {
      id,
      structureId,
      referents,
      firstName: general.firstName,
      usualName: general.usualName,
      birthName: general.birthName,
      ...health
    } as SaveBeneficiaryHealthInput & MinimalBeneficiaryForFormLayout
  })

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

<style lang="scss" scoped>
  .health-info {
    background-color: var(--primary-light);

    p {
      color: var(--light-text-default-grey, #3a3a3a);
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
    }
  }

  .health-info__title {
    color: var(--light-text-default-info, #0063cb);
  }

  .health-info__icon {
    color: #0063cb;
  }
</style>
