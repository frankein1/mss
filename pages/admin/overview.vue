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
          @click="recuperate(false)"
        >
          Information sur les objets d'accompagnement manquants
        </button>
      </div>

      <div
        v-if="info"
        class="fr-col-12 fr-mb-4w"
      >
        {{ info.nToRecuperate }} instructions de dossier avec objet
        d'accompagnement manquant
        <br />
        {{ info.failure }} instructions de dossier dont la récupération est
        impossible
      </div>

      <div class="fr-col-12">
        <button
          class="fr-btn fr-btn--secondary"
          @click="recuperate(true)"
        >
          Exécution de la récupération des objets d'accompagnement
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

  const info = ref<any>(undefined)

  async function recuperate(exec = false) {
    const res = await $fetch(`/api/migration/recover-social-support-subjects`, {
      method: 'POST',
      body: { exec }
    })

    info.value = {
      failure: res.recuperationFailure.length,
      nToRecuperate: res.nToRecuperate
    }
  }
</script>
