<template>
  <PageContainer class="fr-p-5w">
    <PageTitle :title="routes.admin.AdminOverview.title" />
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12 fr-col-md-6">
        <div class="fr-card">
          <div class="fr-card__body">
            <div class="fr-card__content">
              <p class="fr-card__title">
                {{ data.users }}
              </p>
              <h2 class="fr-text--lg">Utilisateurs</h2>
            </div>
          </div>
        </div>
      </div>
      <div class="fr-col-12 fr-col-md-6">
        <div class="fr-card">
          <div class="fr-card__body">
            <div class="fr-card__content">
              <p class="fr-card__title">
                {{ data.structures }}
              </p>
              <h2 class="fr-text--lg">Structures actives</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
  import { routes } from '~/utils/routes'

  definePageMeta({
    name: routes.admin.AdminOverview.name
  })

  /* server/route/admin/getOverview.query.ts */
  const data = await useTrpcClient().admin.getOverview.query()
</script>
