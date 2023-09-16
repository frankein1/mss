<template>
  <div>
    <AtomFilters
      :filters="beneficiaryDocumentFilters"
      always-expanded
      @filter="onFilter"
    />
  </div>
</template>

<script lang="ts" setup>
  import {
    documentTypeOptions,
    documentTagOptions
  } from '~/client/options/document'
  import { FilterType } from '~/utils/constants/filters'
  import { withEmptyValue } from '~/utils/options'
  import type { BeneficiaryDocumentFilterInput } from '~/server/schema'
  import type { FilterProp } from '~/types/filter'

  const emit = defineEmits<{
    filter: [filters: BeneficiaryDocumentFilterInput]
  }>()

  const beneficiaryDocumentFilters = computed<FilterProp[]>(() => [
    {
      name: 'type',
      label: 'Type de document',
      options: withEmptyValue(documentTypeOptions),
      type: FilterType.SelectOne
    },
    {
      name: 'tags',
      label: 'Thème du document',
      options: withEmptyValue(documentTagOptions),
      type: FilterType.SelectOne
    }
  ])

  function onFilter(filters: BeneficiaryDocumentFilterInput) {
    emit('filter', filters)
  }
</script>
