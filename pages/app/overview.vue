<template>
  <PageContainer>
    <PageTitle
      :title="RouteTitle.AppOverview()"
      class="fr-mt-2w"
    />
    <BeneficiarySearchbar />
    <div class="fr-grid-row fr-grid-row--gutters fr-mt-3w">
      <NotificationList />
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
  import { RouteTitle, Route } from '~/utils/routing'

  definePageMeta({
    name: Route.AppOverview
  })
</script>
