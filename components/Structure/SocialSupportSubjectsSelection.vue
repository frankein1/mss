<template>
  <section class="feature-section fr-accordion">
    <h3 class="fr-accordion__title">
      <button
        class="fr-accordion__btn fr-h4"
        aria-expanded="false"
        aria-controls="accordion-selection"
      >
        Sélectionner parmi une suggestion d’objets
      </button>
    </h3>
    <div
      id="accordion-selection"
      class="fr-collapse"
    >
      <VeeSearchInput
        name="filter"
        label="Rechercher"
        @on-input="onSearch"
      />

      <div class="sss-add__items">
        <SocialSupportSubjectAddItem
          v-for="(item, index) in filteredSubjects"
          :key="index"
          :label="item.name"
          :name="`selected[${index}].active`"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
  import type { SocialSupportSubjects } from './types'
  import { formatSearchPattern } from '~/utils'

  const props = defineProps<{
    subjects: SocialSupportSubjects
  }>()

  const filter = ref('')

  function onSearch(pattern: string) {
    filter.value = formatSearchPattern(pattern)
  }

  const filteredSubjects = computed(() => {
    const res = !filter.value.length
      ? props.subjects
      : props.subjects.filter(sub =>
          formatSearchPattern(sub.name).match(filter.value)
        )
    return res
  })
</script>

<style scoped lang="scss">
  @use '@gouvfr/dsfr/module/media-query' as dsfr-media-query;

  .sss-add__items {
    padding: 1rem 0;

    @include dsfr-media-query.respond-from('lg') {
      columns: 2;
      column-gap: 3rem;
    }
  }
</style>
