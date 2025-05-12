<template>
  <div class="beneficiary-toolbar toolbar-wrapper">
    <div class="toolbar-search">
      <BeneficiarySearchbarInput
        class="beneficiary-search fr-mr-2w"
        label="Rechercher un dossier bénéficiaire"
        name="beneficiary-search"
        :search-fn="searchBeneficiaries"
      >
        <template #result="{ result: beneficiary }">
          <NuxtLink
            :to="
              r.AppFile.path(beneficiary.familyFileId, {
                originPage: routeName,
                beneficiaryId: beneficiary.id
              })
            "
            class="fr-btn fr-btn--tertiary-no-outline result"
          >
            {{ formatBeneficiarySearchDisplayName(beneficiary) }}
          </NuxtLink>
        </template>
      </BeneficiarySearchbarInput>
    </div>

    <div class="toolbar-create">
      <NuxtLink
        :to="r.AppFileAdd.path()"
        class="fr-btn fr-btn--lg fr-btn--icon-left fr-icon-user-add-line add-beneficiary-btn"
        @click="onAccessBeneficiaryAdd"
      >
        Créer un dossier bénéficiaire
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { routes } from '~/utils/routes'

  import {
    AccessBeneficiaryAddEventAction,
    EventCategory
  } from '~/types/matomo'

  const route = useRoute()

  const r = routes.file
  type RouteName =
    | typeof routes.user.AppOverview.name
    | typeof routes.beneficiary.AppBeneficiaries.name
  const routeName = route.name as RouteName | undefined

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

  .result {
    width: 100%;
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
