<template>
  <button
    class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline"
    :class="{ enabled: sort != undefined }"
    @click="onToggle"
  >
    {{ label }}
  </button>
</template>

<script lang="ts" setup>
  import { SortOrder } from '~/types/table'

  const emit = defineEmits<{
    (e: 'sort', sort: SortOrder | undefined): void
  }>()

  const sort = ref<SortOrder | undefined>(undefined)

  const label = computed(() =>
    sort.value === undefined || sort.value === SortOrder.Asc ? 'A..Z' : 'Z..A'
  )

  function onToggle() {
    if (sort.value === undefined || sort.value === SortOrder.Desc) {
      sort.value = SortOrder.Asc
    } else {
      sort.value = SortOrder.Desc
    }
    emit('sort', sort.value)
  }
</script>

<style scoped>
  .fr-btn:not(.enabled) {
    color: var(--text-disabled-grey);
  }
</style>
