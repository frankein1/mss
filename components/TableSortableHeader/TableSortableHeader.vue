<template>
  <th scope="col">
    <div class="header-container">
      {{ label }}
      <button
        class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline btn-order"
        :title="title"
        @click="onToggle"
      >
        <span
          class="fr-icon-arrow-up-s-line"
          :class="{ 'arrow-enabled': isAscending }"
          aria-hidden="true"
        ></span>
        <span
          class="fr-icon-arrow-down-s-line"
          :class="{ 'arrow-enabled': isDescending }"
          aria-hidden="true"
        ></span>
      </button>
    </div>
  </th>
</template>

<script lang="ts" setup>
  import { SortOrder } from '~/types/table'

  const props = withDefaults(
    defineProps<{
      label: string
      sort: SortOrder | undefined
      numeric?: boolean
    }>(),
    { numeric: false }
  )

  const emit = defineEmits<{
    'update:sort': [sort: SortOrder]
  }>()

  const innerSort = ref<SortOrder | undefined>(props.sort)

  const isAscending = computed(() => innerSort.value === SortOrder.Asc)
  const isDescending = computed(() => innerSort.value === SortOrder.Desc)

  const title = computed(() => {
    if (props.numeric) {
      return isDescending.value
        ? 'Trier par ordre décroissant (de 9 à 1)'
        : 'Trier par ordre croissant (de 1 à 9)'
    }

    return isDescending.value
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
    if (!innerSort.value || isDescending.value) {
      innerSort.value = SortOrder.Asc
    } else {
      innerSort.value = SortOrder.Desc
    }
    emit('update:sort', innerSort.value)
  }
</script>

<style lang="scss" scoped>
  .header-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .btn-order {
    flex-direction: column;
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
