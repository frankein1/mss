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
  import { RouteTitle, Route } from '~/utils/routing'
  import DpoRedirectModal from '~/components/DpoRedirectModal/DpoRedirectModal.vue'

  const title = RouteTitle.AppOverview()
  const route = useRoute()
  const modal = useModal()

  useHead({ title })

  definePageMeta({
    name: Route.AppOverview
  })

  onMounted(() => {
    if (route.query.shouldFillDPO === 'true') {
      console.log('dans le onMounted')
      modal.open(DpoRedirectModal, {
        triggerOpen: true,
        title: 'Compléter les informations de votre structure',
        content:
          'Conformément aux conditions générales d’utilisation, vous devez renseigner les coordonnées du délégué ou de la personne référente à la protection de données.'
      })
    }
  })
</script>
