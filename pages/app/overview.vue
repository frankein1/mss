<template>
  <PageContainer>
    <PageTitle
      :title="title"
      class="fr-mt-2w"
    />
    <BeneficiarySearchbar />
    <div class="fr-grid-row fr-grid-row--gutters fr-mt-3w">
      <div class="fr-col-8 fr-col-lg-6">
        <NotificationList />
      </div>
      <div class="fr-col-4 fr-col-lg-2">
        <PartnerOrganizationOverviewCard />
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
  import { RouteTitle, Route } from '~/utils/routing'

  const title = RouteTitle.AppOverview()

  useHead({ title })

  definePageMeta({
    name: Route.AppOverview
  })
</script>
