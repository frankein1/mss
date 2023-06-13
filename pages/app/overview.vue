<template>
  <PageContainer>
    <PageBreadcrumb :links="Breadcrumb.Overview()" />
    <BeneficiarySearchbar class="fr-mt-3w" />
    <div class="fr-grid-row fr-grid-row--gutters fr-mt-3w">
      <NotificationList />
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
  import { Breadcrumb, Route } from '~/utils/routing'

  definePageMeta({
    name: Route.Overview
  })
</script>
