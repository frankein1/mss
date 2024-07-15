<template>
  <AtomLoader class="fr-mx-auto" />
</template>

<script lang="ts" setup>
  const route = useRoute()
  const trpcClient = useTrpcClient()

  const familyFileId = route.params.id as string

  const data = await trpcClient.file.getBeneficiaryId.query({
    familyFileId
  })

  navigateTo(`/app/beneficiaries/${data}`)
</script>
