<template>
  <div class="fr-container fr-mt-6v fr-grid-row fr-grid-row--gutters fr-mt-3w">
    <div class="fr-col-12">
      <h1>Liste des ministres</h1>
      <NuxtLink
        class="fr-btn fr-btn--secondary fr-mb-0"
        :to="routes.admin.AdminMinisterAdd.path()"
      >
        Ajouter un ministre
      </NuxtLink>
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
