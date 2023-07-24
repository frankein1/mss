<template>
  <button
    class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline"
    :class="{ enabled: innerSort != undefined }"
    :title="title"
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
      numeric?: boolean
    }>(),
    { sort: undefined, numeric: false }
  )

  const emit = defineEmits<{
    (e: 'update:sort', sort: SortOrder | undefined): void
  }>()

  const innerSort = ref<SortOrder | undefined>(props.sort)

  const label = computed(() => {
    const isAscending =
      innerSort.value === undefined || innerSort.value === SortOrder.Asc

    if (props.numeric) {
      return isAscending ? '1..9' : '9..1'
    }
    return isAscending ? 'A..Z' : 'Z..A'
  })

  const title = computed(() => {
    const toDescending = innerSort.value === SortOrder.Asc

    if (props.numeric) {
      return toDescending
        ? 'Trier par ordre décroissant (de 9 à 1)'
        : 'Trier par ordre croissant (de 1 à 9)'
    }

    return toDescending
      ? 'Trier par ordre antialphabétique (de Z à A)'
      : 'Trier par ordre alphabétique (de A à Z)'
  })

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
