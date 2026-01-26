<template>
  <div class="fr-container fr-mt-6v">
    <div class="fr-col-12">
      <h1>Liste des ministres</h1>
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

  const trpcClient = useTrpcClient()
  const { data, status, error } = await trpcClient.admin.getMinisters.useQuery()
  const ministers = computed(() =>
    data.value ? data.value : ([] as AdminMinistersOutput[])
  )
</script>
