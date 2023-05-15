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
  const ASC_SORT = 'asc'
  const DSC_SORT = 'desc'

  const emit = defineEmits(['sort'])

  const sort = ref<null | string>(null)

  const label = computed(() =>
    sort.value == null || sort.value === ASC_SORT ? 'A..Z' : 'Z..A'
  )

  function onToggle() {
    if (sort.value == null || sort.value === DSC_SORT) {
      sort.value = ASC_SORT
    } else {
      sort.value = DSC_SORT
    }
    emit('sort', sort.value)
  }
</script>

<style scoped>
  .fr-btn:not(.enabled) {
    color: var(--text-disabled-grey);
  }
</style>
