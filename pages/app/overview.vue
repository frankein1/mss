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
        <NuxtLink :href="RoutePath.AppPartners()">
          <div class="partner-box fr-px-1w fr-py-2w">
            <div></div>
            <div class="fr-link">Partenaires</div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
  import { RouteTitle, Route, RoutePath } from '~/utils/routing'

  const title = RouteTitle.AppOverview()

  useHead({ title })

  definePageMeta({
    name: Route.AppOverview
  })
</script>

<style lang="scss">
  .partner-box {
    background-color: white;
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }
</style>
