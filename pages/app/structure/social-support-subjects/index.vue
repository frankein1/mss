<template>
  <AtomLazyComponent
    :error="Boolean(error)"
    message="Les informations de votre stucture n'ont pas pu être chargées."
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
