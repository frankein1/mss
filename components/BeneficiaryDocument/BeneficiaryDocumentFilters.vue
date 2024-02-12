<template>
  <AtomFilters
    :filters="beneficiaryDocumentFilters"
    no-reset
    @filter="onFilter"
  />
</template>

<script lang="ts" setup>
  import { documentTypeOptions, documentTagOptions } from '~/client/options'
  import { FilterType } from '~/utils/constants/filters'
  import { withEmptyValue } from '~/utils/options'
  import type { BeneficiaryDocumentFilterInput } from '~/server/schema'
  import type { FilterProp } from '~/types/filter'

  const emit = defineEmits<{
    filter: [filters: BeneficiaryDocumentFilterInput]
  }>()

  const beneficiaryDocumentFilters: FilterProp[] = [
    {
      name: 'type',
      label: 'Type de document',
      options: withEmptyValue(documentTypeOptions, 'Tous'),
      type: FilterType.SelectOne,
      alwaysExpanded: true
    },
    {
      name: 'tags',
      label: 'Thème du document',
      options: withEmptyValue(documentTagOptions, 'Tous'),
      type: FilterType.SelectOne,
      alwaysExpanded: true
    }
  ]

  function onFilter(filters: BeneficiaryDocumentFilterInput) {
    emit('filter', filters)
  }
</script>
