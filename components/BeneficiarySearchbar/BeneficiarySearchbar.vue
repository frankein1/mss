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
          :to="r.AppBeneficiary.path(beneficiary.id, { originPage: routeName })"
          class="fr-btn fr-btn--tertiary-no-outline result"
        >
          {{ formatBeneficiarySearchDisplayName(beneficiary) }}
        </NuxtLink>
      </template>
    </BeneficiarySearchbarInput>
    <NuxtLink
      :to="r.AppBeneficiariesAdd.path()"
      class="fr-btn fr-btn--lg fr-btn--icon-left fr-icon-user-add-line add-beneficiary-btn"
      @click="onAccessBeneficiaryAdd"
    >
      Ajouter un dossier
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
  import { routes } from '~/utils/routes'

  import {
    AccessBeneficiaryAddEventAction,
    EventCategory
  } from '~/types/matomo'

  const route = useRoute()

  const r = routes.beneficiary
  type RouteName =
    | typeof routes.user.AppOverview.name
    | typeof r.AppBeneficiaries.name
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
