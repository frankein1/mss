<template>
  <button
    class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline"
    :class="{ enabled: sort != null }"
    @click="onToggle"
  >
    {{ label }}
  </button>
</template>

<script lang="ts" setup>
  import { SortOrder } from '~/types/table'

  const emit = defineEmits<{
    (e: 'sort', sort: SortOrder | null): void
  }>()

  const sort = ref<SortOrder | null>(null)

  const label = computed(() =>
    sort.value == null || sort.value === SortOrder.Asc ? 'A..Z' : 'Z..A'
  )

  function onToggle() {
    if (sort.value == null || sort.value === SortOrder.Desc) {
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
