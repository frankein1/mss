<template>
  <VeeAutocomplete
    :label="label"
    :name="name"
    :search-fn="searchDepartmentsFn"
    :value="selectedValue"
    :required="required"
    @result-selected="onSelectDepartment"
  />
</template>

<script setup lang="ts">
  import type { GeoApiGouvFrDepartment } from './types'
  import type { Options } from '~/utils/options'

  withDefaults(
    defineProps<{
      label: string
      name: string
      required?: boolean
    }>(),
    { required: false }
  )

  const emit = defineEmits<{
    departmentSelected: [department: string]
  }>()

  const departments = ref<GeoApiGouvFrDepartment[]>([])
  const selectedValue = ref<string | undefined>(undefined)

  async function searchDepartmentsFn(search: string): Promise<Options> {
    if (search.length < 3) {
      return new Map()
    }

    const params = new URLSearchParams({
      nom: search,
      limit: '3'
    })

    const res = await $fetch<GeoApiGouvFrDepartment[]>(
      `https://geo.api.gouv.fr/departements?${params}`
    )

    departments.value = res
    return toOptions(res, 'code', 'nom')
  }

  function onSelectDepartment(code: string) {
    const department = departments.value.find(a => a.code === code)
    if (!department) {
      return
    }
    selectedValue.value = department.nom
    emit('departmentSelected', department.nom)
  }
</script>
