<template>
  <div class="beneficiary-toolbar">
    <AtomSearchbar
      class="beneficiary-search fr-mr-2w"
      label="Rechercher un·e bénéficiaire"
      name="beneficiary-search"
      :search-fn="searchBeneficiariesFn"
    >
      <template #result="{ result: beneficiary }">
        <NuxtLink
          :to="`${Routes.Beneficiaries}/${beneficiary.id}`"
          target="_self"
          class="fr-btn fr-btn--tertiary-no-outline"
        >
          {{ beneficiaryToSearchResult(beneficiary) }}
        </NuxtLink>
      </template>
    </AtomSearchbar>
    <NuxtLink
      :to="Routes.BeneficiariesAdd"
      class="fr-btn fr-btn--lg fr-btn--icon-left fr-icon-user-add-line add-beneficiary-btn"
      target="_self"
    >
      Ajouter un·e bénéficaire
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
  import { beneficiaryToSearchResult } from '~~/utils/beneficiary'
  import { Routes } from '~/utils/routing/routes'

  async function searchBeneficiariesFn(query: string) {
    const { beneficiaries } = await useTrpcClient().beneficiary.search.query({
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
</style>
