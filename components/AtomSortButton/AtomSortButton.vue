<template>
  <div class="btn-container">
    <span>{{ column }}</span>
    <button
      class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline btn-order"
      :title="title"
      @click="onToggle"
    >
      <span
        class="fr-icon-arrow-up-s-line"
        :class="{ 'arrow-enabled': isAscending && innerSort != undefined }"
        aria-hidden="true"
      ></span>
      <span
        class="fr-icon-arrow-down-s-line"
        :class="{ 'arrow-enabled': !isAscending && innerSort != undefined }"
        aria-hidden="true"
      ></span>
    </button>
  </div>
</template>

<script lang="ts" setup>
  import { SortOrder } from '~/types/table'

  const props = withDefaults(
    defineProps<{
      column: string
      sort?: SortOrder
      numeric?: boolean
    }>(),
    { sort: undefined, numeric: false }
  )

  const emit = defineEmits<{
    'update:sort': [sort: SortOrder | undefined]
  }>()

  const innerSort = ref<SortOrder | undefined>(props.sort)

  const isAscending = computed(
    () => innerSort.value === undefined || innerSort.value === SortOrder.Asc
  )

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

<style lang="scss" scoped>
  .btn-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .btn-order {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text-disabled-grey);
    line-height: 1;
    padding: 0.25rem;

    span::before {
      --icon-size: 1rem;
    }
  }

  .arrow-enabled::before {
    background-color: var(--blue-france-sun-113-625);
  }
</style>
