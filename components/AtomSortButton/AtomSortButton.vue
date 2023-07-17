<template>
  <button
    class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline"
    :class="{ enabled: innerSort != undefined }"
    @click="onToggle"
  >
    {{ label }}
  </button>
</template>

<script lang="ts" setup>
  import { SortOrder } from '~/types/table'

  const props = withDefaults(
    defineProps<{
      sort?: SortOrder
    }>(),
    { sort: undefined }
  )

  const emit = defineEmits<{
    (e: 'update:sort', sort: SortOrder | undefined): void
  }>()

  const innerSort = ref<SortOrder | undefined>(props.sort)

  const label = computed(() =>
    innerSort.value === undefined || innerSort.value === SortOrder.Asc
      ? 'A..Z'
      : 'Z..A'
  )

  watch(
    () => props.sort,
    sort => {
      innerSort.value = sort
    }
  )

  function onToggle() {
    if (innerSort.value === undefined || innerSort.value === SortOrder.Desc) {
      innerSort.value = SortOrder.Asc
    } else {
      innerSort.value = SortOrder.Desc
    }
    emit('update:sort', innerSort.value)
  }
</script>

<style scoped>
  .fr-btn:not(.enabled) {
    color: var(--text-disabled-grey);
  }
</style>
