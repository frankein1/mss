<template>
  <div class="fr-grid-row fr-grid-row--middle">
    <AtomSelect
      class="fr-col-2"
      label="Résultats par page"
      name="results_per_page"
      :options="REQUEST_LIMIT_OPTIONS"
      :value="String(limit)"
      @change-value="changeLimit"
    />
    <nav
      role="navigation"
      class="fr-pagination"
      aria-label="Pagination"
    >
      <ul class="fr-pagination__list">
        <li>
          <button
            class="fr-pagination__link fr-pagination__link--first"
            :disabled="page === 1"
            :aria-disabled="page === 1"
            @click="onChangePage(1)"
          >
            Première page
          </button>
        </li>
        <li>
          <button
            class="fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label"
            :disabled="page === 1"
            :aria-disabled="page === 1"
            @click="onChangePage(page - 1)"
          >
            Page précédente
          </button>
        </li>
        <li
          v-for="pageNumber in totalPages <= 6 ? totalPages : 3"
          :key="`page-number-${pageNumber}`"
        >
          <button
            class="fr-pagination__link"
            :class="{ 'fr-hidden fr-unhidden-lg': pageNumber > 1 }"
            :aria-current="pageNumber === page ? 'page' : undefined"
            :title="`Page ${pageNumber}`"
            @click="onChangePage(pageNumber)"
          >
            {{ pageNumber }}
          </button>
        </li>
        <li v-if="totalPages > 6">
          <a class="fr-pagination__link"> … </a>
        </li>
        <li v-if="totalPages > 6 && page > 3 && page <= totalPages - 3">
          <button
            class="fr-pagination__link fr-hidden fr-unhidden-lg"
            aria-current="true"
            :title="`Page ${page}`"
          >
            {{ page }}
          </button>
        </li>
        <li v-if="totalPages > 6 && page > 3 && page <= totalPages - 3">
          <a class="fr-pagination__link fr-hidden fr-unhidden-lg"> … </a>
        </li>
        <li
          v-for="pageOffset in totalPages <= 6 ? 0 : 3"
          :key="`page-offset-${pageOffset}`"
        >
          <button
            class="fr-pagination__link"
            :class="{
              'fr-hidden fr-unhidden-lg':
                totalPages - 3 + pageOffset < totalPages
            }"
            :aria-current="
              totalPages - 3 + pageOffset === page ? 'page' : undefined
            "
            :title="`Page ${totalPages - 3 + pageOffset}`"
            @click="onChangePage(totalPages - 3 + pageOffset)"
          >
            {{ totalPages - 3 + pageOffset }}
          </button>
        </li>
        <li>
          <button
            class="fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label"
            :disabled="page === totalPages"
            :aria-disabled="page === totalPages"
            @click="onChangePage(page + 1)"
          >
            Page suivante
          </button>
        </li>
        <li>
          <button
            class="fr-pagination__link fr-pagination__link--last"
            :disabled="page === totalPages"
            :aria-disabled="page === totalPages"
            @click="onChangePage(totalPages)"
          >
            Dernière page
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts" setup>
  import {
    REQUEST_LIMIT_OPTIONS,
    REQUEST_LIMIT_DEFAULT
  } from '~/utils/constants'

  defineProps<{
    page: number
    totalPages: number
  }>()

  const emit = defineEmits(['changePage'])

  const limit = ref(REQUEST_LIMIT_DEFAULT)

  function changeLimit(limitValue: string) {
    limit.value = Number(limitValue)
    emit('changePage', { pageNumber: 1, limitValue: limit.value })
  }

  function onChangePage(pageNumber: number) {
    emit('changePage', {
      pageNumber,
      limitValue: limit.value
    })
  }
</script>

<style scoped>
  .fr-pagination__list {
    justify-content: center;
  }

  .fr-grid-row {
    justify-content: space-between;
  }
</style>
