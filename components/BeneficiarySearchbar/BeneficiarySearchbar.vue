<template>
  <div class="beneficiary-toolbar toolbar-wrapper">
    <div class="toolbar-search">
      <BeneficiarySearchCombobox
        class="beneficiary-search fr-mr-2w"
        label="Rechercher un dossier bénéficiaire"
        :label-visible="false"
        placeholder="Rechercher un dossier bénéficiaire"
        :search-fn="searchBeneficiaries"
        :action="{
          title: `Créer une synthèse`
        }"
        @on-action-click="onActionClick($event)"
      />
    </div>
    <div class="toolbar-create">
      <NuxtLink
        :to="routes.file.AppFileAdd.path()"
        class="fr-btn fr-btn--lg fr-btn--icon-left fr-icon-user-add-line add-beneficiary-btn"
        @click="onAccessBeneficiaryAdd"
      >
        Créer un dossier bénéficiaire
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    AccessBeneficiaryAddEventAction,
    EventCategory,
    FollowupAction
  } from '~/types/matomo'
  import BeneficiarySearchCombobox from './BeneficiarySearchCombobox.vue'
  import { routes } from '~/utils/routes'
  import type { BeneficiarySearchResult } from '~/types/beneficiary'

  async function searchBeneficiaries(query: string) {
    const beneficiaries = await useTrpcClient().beneficiary.search.query({
      query
    })
    return beneficiaries
  }

  function onAccessBeneficiaryAdd() {
    const matomo = useMatomo()
    matomo.trackEvent(
      EventCategory.AccessBeneficiaryAdd,
      AccessBeneficiaryAddEventAction.FromOverview
    )
  }

  const onActionClick = (beneficiary: BeneficiarySearchResult) => {
    const matomo = useMatomo()
    matomo.trackEvent(
      EventCategory.CreateFollowup,
      FollowupAction.CreateFromBeneficiarySearch
    )
    const path = routes.followup.AppBeneficiaryFollowupAdd.path(
      beneficiary.familyFileId,
      {
        beneficiaryId: beneficiary.id
      }
    )
    navigateTo(path)
  }
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .beneficiary-toolbar {
    display: flex;
  }

  .add-beneficiary-btn {
    border-radius: 2.25rem;
  }

  .beneficiary-search {
    flex: 1 1 auto;
  }

  .toolbar-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;

    .toolbar-search {
      width: auto;
      flex: 2;
    }

    .toolbar-create {
      min-width: fit-content;
      max-width: fit-content;
      flex: 1;
    }

    @include dsfr-media-query.respond-from('md') {
      flex-direction: row;
      align-items: center;
    }
  }
</style>
