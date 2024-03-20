<template>
  <!-- <VeeSearchInput
        name="filter"
        label="Rechercher"
        @on-input="onSearch"
      /> -->

  <div class="sss-add__items">
    <VeeCheckbox
      v-for="(item, index) in filteredSubjects"
      :key="index"
      class="fr-mb-2w"
      :label="item.name"
      :name="`selected[${index}].active`"
      :disabled="!item.inactive"
    />
  </div>
</template>

<script lang="ts" setup>
  import type { SocialSupportSubjects } from './types'
  import { formatSearchPattern } from '~/utils'

  const props = defineProps<{
    subjects: SocialSupportSubjects
  }>()

  const filter = ref('')

  // function onSearch(pattern: string) {
  //   filter.value = formatSearchPattern(pattern)
  // }

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
