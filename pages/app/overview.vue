<template>
  <PageContainer>
    <PageTitle
      :title="title"
      class="fr-mt-2w"
    />
    <BeneficiarySearchbar />
    <div class="fr-grid-row fr-grid-row--gutters fr-mt-3w">
      <div class="fr-col-12">
        <button
          class="fr-btn"
          @click="openModal"
        >
          Ouvrir modale
        </button>
      </div>
      <div class="fr-col-6 fr-col-lg-8">
        <NotificationList />
      </div>
      <div class="fr-col-6 fr-col-lg-4">
        <PartnerOrganizationOverviewCard class="fr-mb-3w" />
        <OngoingFileInstructions class="fr-mb-3w" />
        <OngoingFollowups />
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
  import { RouteTitle, Route } from '~/utils/routing'
  import DpoRedirectModal from '~/components/DpoRedirectModal/DpoRedirectModal.vue'

  const title = RouteTitle.AppOverview()

  useHead({ title })

  definePageMeta({
    name: Route.AppOverview
  })

  const modal = useModal()
  // TODO: check if user is admin and if DPO is defined
  function openModal() {
    modal.open(DpoRedirectModal, {
      title: 'xoxoxoxoxoxo',
      content: 'Compléter les informations de votre structure'
    })
  }
</script>
