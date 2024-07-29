<template>
  <PageContainer v-if="familyFileIdentification">
    <!-- TODO: add loader + error components -->

    <!-- TODO: add permissions on header + actions -->
    <AtomBreadcrumb
      :links="breadcrumbs.file.AppFile(familyFileId, familyFileIdentification)"
    />

    <FamilyFileDetailsHeader
      :beneficiaries="familyFileIdentification"
      :title="title"
      @open-modal="onOpenModal"
    />

    <hr />

    <!-- TODO: demander des permissions pour avoir acces au bouton instruction de dossier -->
    <BeneficiaryDetailsHistoryActions
      :beneficiary-id="familyFileIdentification[0].id"
      :permissions="undefined"
      class="fr-pb-3w"
    />
  </PageContainer>
</template>

<script lang="ts" setup>
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'

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
