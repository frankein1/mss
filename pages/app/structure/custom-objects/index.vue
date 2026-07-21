<template>
  <AtomLazyComponent
    :error="Boolean(error)"
    message="Les objets personnalisés de votre structure n'ont pas pu être chargés."
    :pending="status === 'pending'"
  >
    <SocialSupportSubjects
      v-if="data"
      :subjects="data"
      :edit-path="routes.structure.AppStructureSocialSupportSubjectsEdit.path()"
      @refresh="refresh"
    />
  </AtomLazyComponent>
</template>

<script lang="ts" setup>
  import { routes } from '~/utils/routes'

  const trpcClient = useTrpcClient()

  const { data, error, status, refresh } =
    await trpcClient.structure.getActiveSocialSupportSubjects.useQuery()
</script>
