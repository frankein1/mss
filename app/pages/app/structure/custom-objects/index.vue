<template>
  <AtomLazyComponent
    :error="Boolean(error)"
    message="Les objets personnalisés de votre structure n'ont pas pu être chargés."
    :pending="status === 'pending'"
  >
    <StructureCustomObjects
      :social-support-subjects="data"
      @refresh="refresh"
    />
  </AtomLazyComponent>
</template>

<script lang="ts" setup>
  const trpcClient = useTrpcClient()

  const { data, error, status, refresh } =
    await trpcClient.structure.getActiveSocialSupportSubjects.useQuery()
</script>
