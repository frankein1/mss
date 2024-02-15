<template>
  <VeeInput
    v-if="filter.type === FilterType.Date"
    :name="filter.name"
    :label="filter.label"
    type="date"
    @change-value="emit('changeFilter', $event)"
  />
  <VeeSearchInput
    v-else-if="filter.type === FilterType.Search"
    :name="filter.name"
    :label="filter.label"
    :placeholder="filter.placeholder"
    @change-value="emit('changeFilter', $event)"
  />
  <VeeMultiSelect
    v-else-if="filter.type === FilterType.SelectMultiple"
    class="multi-select-filters"
    :name="filter.name"
    :label="filter.label"
    :options="filter.options"
    :placeholder="filter.label"
    dropdown
    @change-value="emit('changeFilter', $event)"
  />
  <VeeSelect
    v-else-if="filter.type === FilterType.SelectOne"
    :name="filter.name"
    :label="filter.label"
    :options="filter.options"
    @change-value="emit('changeFilter', $event)"
  />
  <VeeRadioButtons
    v-else
    class="radio"
    :name="filter.name"
    :label="filter.label"
    :options="filter.options"
    :pictos="filter.pictos"
    :as-tag="filter.asTag"
    :no-label="filter.noLabel"
    @change-value="emit('changeFilter', $event)"
  />
</template>

<script lang="ts" setup>
  import { FilterType } from '~/utils/constants/filters'
  import type { FilterProp } from '~/types/filter'

  defineProps<{
    filter: FilterProp
  }>()

  const emit = defineEmits<{
    changeFilter: [value: string | string[]]
  }>()
</script>
