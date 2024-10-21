<template>
  <PageContainer>
    <PageTitle :title="routes.admin.AdminOverview.title" />
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
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
  import { routes } from '~/utils/routes'

  definePageMeta({
    name: routes.admin.AdminOverview.name
  })

  const data = await useTrpcClient().admin.getOverview.query()
</script>
