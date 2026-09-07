<template>
  <PageContainer class="fr-p-5w">
    <PageTitle :title="routes.admin.AdminMinisters.title" />

    <div class="fr-grid-row fr-grid-row--gutters fr-mb-6v">
      <div class="fr-col-12">
        <NuxtLink
          class="fr-btn fr-btn--icon-left fr-icon-user-add-line"
          :to="routes.admin.AdminMinisterAdd.path()"
        >
          Ajouter un ministre
        </NuxtLink>
      </div>
    </div>

    <div class="fr-grid-row fr-grid-row--gutters feature-section">
      <div class="fr-col-12">
        <h2>Liste des ministres</h2>
      </div>

      <div class="fr-col-12">
        <AtomLazyComponent
          :pending="status === 'pending'"
          :error="error != null"
          message="Impossible de charger la liste des ministres"
        >
          <AdminMinisterTable :ministers />
        </AtomLazyComponent>
      </div>
    </div>
  </PageContainer>
</template>
<script lang="ts" setup>
  import type { AdminMinistersOutput } from '~/components/AdminMinister/types'
  import { routes } from '~/utils/routes'

  const trpcClient = useTrpcClient()
  const { data, status, error } = await trpcClient.admin.getMinisters.useQuery()
  const ministers = computed(() =>
    data.value ? data.value : ([] as AdminMinistersOutput[])
  )
</script>
