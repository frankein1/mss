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
    :label-visible="true"
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
    class="filter-radio"
    :class="{ 'filter-radio--as-tag': filter.asTag }"
    :name="filter.name"
    :label="filter.label"
    :options="filter.options"
    :pictos="filter.pictos"
    :as-tag="filter.asTag"
    :no-label="filter.noLabel"
    :rich="filter.rich"
    @change-value="emit('changeFilter', $event)"
  />
</template>

<script lang="ts" setup>
  import { FilterType } from '~/utils/constants/filters'
  import type { FilterProp } from '~/types/filter'

  defineProps<{
    filter: FilterProp
    searchLabelVisible?: boolean
  }>()

  const emit = defineEmits<{
    changeFilter: [value: string | string[]]
  }>()
</script>

<style lang="scss">
  .filter-radio--as-tag {
    .fr-fieldset__element {
      padding-right: 0;
      padding-left: 0.25rem;
    }
  }
</style>
