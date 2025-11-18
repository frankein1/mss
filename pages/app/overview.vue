<template>
  <PageContainer>
    <PageTitle
      :title="title"
      class="fr-mt-2w"
    />
    <BeneficiarySearchbar />
    <div class="fr-grid-row fr-grid-row--gutters fr-mt-3w">
      <div class="fr-col-12 fr-col-sm-6 fr-col-lg-8">
        <NotificationList />
      </div>
      <div class="fr-col-12 fr-col-sm-6 fr-col-lg-4">
        <PartnerOrganizationOverviewCard class="fr-mb-3w" />
        <OngoingFileInstructions class="fr-mb-3w" />
        <OngoingFollowups class="fr-mb-3w" />
        <OngoingAppointments v-if="application.module.rdv" />
      </div>
    </div>
    <OpenModalHack />
  </PageContainer>
</template>

<script setup lang="ts">
  import { routes } from '~/utils/routes'

  const title = routes.user.AppOverview.title
  const { application } = usePermissions()

  useHead({ title })

  definePageMeta({
    name: routes.user.AppOverview.name
  })

  useDPOCheckOnStartup()
</script>
