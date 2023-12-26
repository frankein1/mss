<template>
  <div class="beneficiary-toolbar">
    <BeneficiarySearchbarInput
      class="beneficiary-search fr-mr-2w"
      label="Rechercher un·e bénéficiaire"
      name="beneficiary-search"
      :search-fn="searchBeneficiaries"
    >
      <template #result="{ result: beneficiary }">
        <NuxtLink
          :to="
            RoutePath.AppBeneficiary(beneficiary.id, { originPage: routeName })
          "
          target="_self"
          class="fr-btn fr-btn--tertiary-no-outline result"
        >
          {{ formatBeneficiarySearchDisplayName(beneficiary) }}
        </NuxtLink>
      </template>
    </BeneficiarySearchbarInput>
    <NuxtLink
      :to="RoutePath.AppBeneficiariesAdd()"
      class="fr-btn fr-btn--lg fr-btn--icon-left fr-icon-user-add-line add-beneficiary-btn"
      target="_self"
      @click="onAccessBeneficiaryAdd"
    >
      Ajouter un·e bénéficiaire
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
  import { Route, RoutePath } from '~/utils/routing'
  import {
    AccessBeneficiaryAddEventAction,
    EventCategory
  } from '~/types/matomo'

  const route = useRoute()
  const routeName = route.name as
    | Route.AppOverview
    | Route.AppBeneficiaries
    | undefined

  async function searchBeneficiaries(query: string) {
    const beneficiaries = await useTrpcClient().beneficiary.search.query({
      query
    })
    return beneficiaries
  }

  function onAccessBeneficiaryAdd() {
    const { matomo } = useMatomo()
    matomo.trackEvent(
      EventCategory.AccessBeneficiaryAdd,
      AccessBeneficiaryAddEventAction.FromOverview
    )
  }
</script>

<style scoped>
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
</style>
