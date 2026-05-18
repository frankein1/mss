<template>
  <PageContainer>
    <PageTitle
      :title="title"
      class="fr-mt-2w"
    />
    <AtomNotice
      v-if="isSafari"
      class="fr-mb-6v"
    >
      Navigateur non supporté
      <template #content
        >Safari n'est pas géré par Mon Suivi Social, votre expérience risque
        d'être dégradée. Nous vous invitons à utiliser un autre
        navigateur.</template
      >
    </AtomNotice>
    <BeneficiarySearchbar />
    <div class="fr-grid-row fr-grid-row--gutters fr-mt-3w">
      <div class="fr-col-12 fr-col-sm-6 fr-col-lg-8">
        <NotificationList />
      </div>
      <div class="fr-col-12 fr-col-sm-6 fr-col-lg-4">
        <PartnerOrganizationOverviewCard class="fr-mb-3w" />
        <OngoingFileInstructions class="fr-mb-3w" />
        <OngoingFollowups class="fr-mb-3w" />
      </div>
    </div>
    <OpenModalHack />
  </PageContainer>
</template>

<script setup lang="ts">
  import { routes } from '~/utils/routes'

  const title = routes.user.AppOverview.title

  useHead({ title })

  definePageMeta({
    name: routes.user.AppOverview.name
  })

  const isSafari = computed(() => {
    if (typeof navigator === 'undefined') {
      return false
    }
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  })
</script>
