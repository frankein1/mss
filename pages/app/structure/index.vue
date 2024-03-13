<template>
  <PageContainer no-max-width>
    <DsfrBreadcrumb :links="Breadcrumb.AppStructure()" />

    <PageTitle :title="title" />

    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />

    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les informations de votre structure n'ont pas pu être chargées."
    />

    <StructureInfoHeader
      v-else-if="data"
      :structure="data.structure"
    />
  </PageContainer>
</template>

<script lang="ts" setup>
  import { RouteTitle, Breadcrumb } from '~/utils/routing'
  import { AlertType } from '~/utils/constants/alert'

  const title = RouteTitle.AppStructure()

  useHead({ title })

  const trpcClient = useTrpcClient()

  const { data, pending, error } =
    await trpcClient.structure.getCurrentUserStructure.useQuery()
</script>
