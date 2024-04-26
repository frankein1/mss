<template>
  <PageContainer>
    <PageTitle :title="RouteTitle.AdminOverview()" />
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-2">
        <div class="fr-card">
          <div class="fr-card__body">
            <div class="fr-card__content">
              <h3 class="fr-card__title">
                <span>{{ data.users }}</span>
              </h3>
              <div>Utilisateurs</div>
            </div>
          </div>
        </div>
      </div>
      <div class="fr-col-2">
        <div class="fr-card">
          <div class="fr-card__body">
            <div class="fr-card__content">
              <h3 class="fr-card__title">
                <span>{{ data.structures }}</span>
              </h3>
              <div>Structures</div>
            </div>
          </div>
        </div>
      </div>
      <div class="fr-col-12">
        <button
          class="fr-btn fr-btn--secondary"
          @click="migrate"
        >
          Migration des documents
        </button>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
  import { Route, RouteTitle } from '~/utils/routing'

  definePageMeta({
    name: Route.AdminOverview
  })

  const data = await useTrpcClient().admin.getOverview.query()

  function migrate() {
    $fetch(`/api/document/s3ToDb`)
  }
</script>
