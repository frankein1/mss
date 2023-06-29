<template>
  <PageContainer>
    <PageTitle :title="structure?.name || '-'" />
    <!-- TODO: structure form -->
  </PageContainer>
</template>

<script setup lang="ts">
  const route = useRoute()
  const structureId = route.params.id as string
  const trpcClient = useTrpcClient()

  const { data: structure } = await trpcClient.admin.getStructure.useQuery({
    id: structureId
  })
</script>
