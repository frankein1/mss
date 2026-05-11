<template>
  <VeeInput
    v-if="filter.type === FilterType.Date"
    :name="filter.name"
    :class="filter.name"
    :label="filter.label"
    :hint="filter.hint"
    type="date"
    :disabled="filter.disabled"
    @change-value="emit('changeFilter', $event)"
  />
  <VeeSearchInput
    v-else-if="filter.type === FilterType.Search"
    :name="filter.name"
    :class="filter.name"
    :label="filter.label"
    :hint="filter.hint"
    :label-visible="true"
    :placeholder="filter.placeholder"
    :disabled="filter.disabled"
    @change-value="emit('changeFilter', $event)"
  />
  <MultiSelect
    v-else-if="filter.type === FilterType.SelectMultiple"
    class="multi-select-filters fr-select-group"
    :name="filter.name"
    :class="filter.name"
    :label="filter.label"
    :hint="filter.hint"
    :options="filter.options"
    :placeholder="filter.placeholder"
    :disabled="filter.disabled"
    @change-value="emit('changeFilter', $event)"
  />
  <VeeSelect
    v-else-if="filter.type === FilterType.SelectOne"
    :name="filter.name"
    :class="filter.name"
    :label="filter.label"
    :hint="filter.hint"
    :options="filter.options"
    :disabled="filter.disabled"
    @change-value="emit('changeFilter', $event)"
  />
  <VeeRadioButtons
    v-else-if="filter.type === FilterType.Radio"
    :class="[
      'filter-radio',
      filter.name,
      { 'filter-radio--as-tag': filter.asTag }
    ]"
    :name="filter.name"
    :label="filter.label"
    :hint="filter.hint"
    :options="filter.options"
    :pictos="filter.pictos"
    :as-tag="filter.asTag"
    :no-label="filter.noLabel"
    :rich="filter.rich"
    :disabled="filter.disabled"
    @change-value="emit('changeFilter', $event)"
  />
  <VeeInput
    v-else-if="filter.type === FilterType.Number"
    type="number"
    :name="filter.name"
    :class="filter.name"
    :label="filter.label"
    :hint="filter.hint"
    :disabled="filter.disabled"
    @change-value="emit('changeFilter', $event)"
  />
  <VeeSelect
    v-else
    style="display: none"
    :name="filter.name"
    :class="filter.name"
    :label="filter.label"
    :hint="filter.hint"
    :options="filter.options"
    :disabled="filter.disabled"
    @change-value="emit('changeFilter', $event)"
  ></VeeSelect>
</template>

<script lang="ts" setup>
  import { FilterType } from '~/utils/constants/filters'
  import type { FilterProp } from '~/types/filter'

  defineProps<{ filter: FilterProp }>()

  const emit = defineEmits<{
    changeFilter: [value: string | string[]]
  }>()
</script>

<style lang="scss">
  .filter-radio {
    align-items: flex-start;
  }

  .filter-radio--as-tag {
    .fr-fieldset__element {
      padding-right: 0;
      padding-left: 0.25rem;
    }
  }
</style>
