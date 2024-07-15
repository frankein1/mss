<template>
  <PageContainer>
    <PageTitle
      :title="title"
      class="fr-mt-2w"
    />
    <BeneficiarySearchbar />
    <div class="fr-grid-row fr-grid-row--gutters fr-mt-3w">
      <div class="fr-col-6 fr-col-lg-8">
        <NotificationList />
      </div>
      <div class="fr-col-6 fr-col-lg-4">
        <PartnerOrganizationOverviewCard class="fr-mb-3w" />
        <OngoingFileInstructions class="fr-mb-3w" />
        <OngoingFollowups />
      </div>
    </div>
    <OpenModalHack />
  </PageContainer>
</template>

<script setup lang="ts">
  import DpoRedirectModal from '~/components/DpoRedirectModal/DpoRedirectModal.vue'
  import { routes } from '~/routes'

  const title = routes.user.AppOverview.title
  const route = useRoute()
  const modal = useModal()

  useHead({ title })

  definePageMeta({
    name: routes.user.AppOverview.name
  })

  const unwatch = watch(modal.isReady, () => {
    if (modal.isReady) {
      if (route.query.shouldFillDPO === 'true') {
        modal.open(DpoRedirectModal, {
          triggerOpen: true,
          title: 'Compléter les informations de votre structure',
          content:
            'Conformément aux conditions générales d’utilisation, vous devez renseigner les coordonnées du délégué ou de la personne référente à la protection de données.'
        })
      }
      unwatch()
    }
  })
</script>
