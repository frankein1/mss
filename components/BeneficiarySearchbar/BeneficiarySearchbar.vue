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
          :to="RoutePath.Beneficiary(beneficiary.id, { originPage: routeName })"
          target="_self"
          class="fr-btn fr-btn--tertiary-no-outline result"
        >
          {{ getBeneficiarySearchDisplayName(beneficiary) }}
        </NuxtLink>
      </template>
    </BeneficiarySearchbarInput>
    <NuxtLink
      :to="RoutePath.BeneficiariesAdd()"
      class="fr-btn fr-btn--lg fr-btn--icon-left fr-icon-user-add-line add-beneficiary-btn"
      target="_self"
    >
      Ajouter un·e bénéficaire
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
  import { Route, RoutePath } from '~/utils/routing'

  const route = useRoute()
  const routeName = route.name as
    | Route.Overview
    | Route.Beneficiaries
    | undefined

  async function searchBeneficiaries(query: string) {
    const beneficiaries = await useTrpcClient().beneficiary.search.query({
      query
    })
    return beneficiaries
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
