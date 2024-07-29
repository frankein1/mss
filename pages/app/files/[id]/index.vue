<template>
  <PageContainer v-if="familyFileIdentification">
    <!-- TODO: add breadcrumb -->

    <FamilyFileDetailsHeader
      :beneficiaries="familyFileIdentification"
      :title="title"
      @open-modal="onOpenModal"
    />
  </PageContainer>
</template>

<script lang="ts" setup>
  import { routes } from '~/utils/routes'

  const route = useRoute()

  // Page settings
  const familyFileId = route.params.id as string

  // Get family informations
  const { familyFileIdentification, pending, error } =
    await useFamilyFileMinimalInfo(familyFileId)

  const title = routes.file.AppFile.title(familyFileIdentification.value)

  const onOpenModal = () => {
    console.log('modale ouverte')
  }
  // Open modal

  console.log(pending.value)
  console.log(error.value)
</script>
