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
