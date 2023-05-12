<template>
  <VeeAutocomplete
    :label="label"
    :name="name"
    :search-fn="searchRegionsFn"
    :value="selectedValue"
    :required="required"
    @result-selected="onSelectRegion"
  />
</template>

<script setup lang="ts">
  import type { GeoApiGouvFrRegion } from './types'
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
    (e: 'regionSelected', region: string): void
  }>()

  const regions = ref<GeoApiGouvFrRegion[]>([])
  const selectedValue = ref<string | undefined>(undefined)

  async function searchRegionsFn(search: string): Promise<Options> {
    if (search.length < 3) return new Map()

    const params = new URLSearchParams({
      nom: search,
      limit: '3'
    })

    const res = await $fetch<GeoApiGouvFrRegion[]>(
      `https://geo.api.gouv.fr/regions?${params}`
    )

    regions.value = res
    return toOptions(res, 'code', 'nom')
  }

  function onSelectRegion(code: string) {
    const region = regions.value.find(a => a.code === code)
    if (!region) return
    selectedValue.value = region.nom
    emit('regionSelected', region.nom)
  }
</script>
