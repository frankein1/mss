<template>
  <AtomFilters
    :filters="beneficiaryDocumentFilters"
    no-reset
    @filter="onFilter"
  />
</template>

<script lang="ts" setup>
  import { documentTypeKeys, documentTagKeys } from '~/client/options'
  import { FilterType } from '~/utils/constants/filters'
  import { withEmptyValue } from '~/utils/options'
  import type { BeneficiaryDocumentFilterInput } from '~/server/schema'
  import type { FilterProp } from '~/types/filter'
  import { BeneficiaryFileIdentification } from '~/types/beneficiary'
  import { formatBeneficiaryShortenedName } from '~/utils/beneficiary/formatBeneficiaryShortenedName'

  const props = defineProps<{
    familyFileIdentification?: BeneficiaryFileIdentification[]
  }>()

  const emit = defineEmits<{
    filter: [filters: BeneficiaryDocumentFilterInput]
  }>()

  const beneficiaryOptions = computed(() => {
    if (!props.familyFileIdentification) {
      return null
    }
    return props.familyFileIdentification.map(m => ({
      label: formatBeneficiaryShortenedName(m),
      value: m.id
    }))
  })

  const beneficiaryDocumentFilters = computed(() => {
    const filters: FilterProp[] = [
      {
        name: 'type',
        label: 'Type de document',
        options: withEmptyValue(documentTypeKeys.options, 'Tous'),
        type: FilterType.SelectOne,
        alwaysExpanded: true
      },
      {
        name: 'tags',
        label: 'Thème du document',
        options: withEmptyValue(documentTagKeys.options, 'Tous'),
        type: FilterType.SelectOne,
        alwaysExpanded: true
      }
    ]

    if (
      props.familyFileIdentification &&
      beneficiaryOptions.value &&
      props.familyFileIdentification.length > 1
    ) {
      filters.push({
        name: 'beneficiaryId',
        label: 'Bénéficiaire concerné :',
        options: withEmptyValue(beneficiaryOptions.value, 'Tous'),
        type: FilterType.Radio,
        asTag: true,
        alwaysExpanded: true
      })
    }

    return filters
  })

  function onFilter(filters: BeneficiaryDocumentFilterInput) {
    emit('filter', filters)
  }
</script>
