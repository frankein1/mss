<template>
  <AtomAutocomplete
    :label="label"
    :name="name"
    :search-fn="searchCitiesFn"
    :value="selectedValue"
    :required="required"
    @result-selected="onSelectCity"
  />
</template>

<script lang="ts" setup>
  import type {
    GeoApiGouvFrCommune,
    CityResult,
    GeoApiGouvFrQueryParams,
    CitySelected
  } from './types'

  const props = withDefaults(
    defineProps<{
      label: string
      name: string
      value?: string
      zipCode?: string
      required?: boolean
    }>(),
    { value: '', zipCode: '', required: false }
  )

  const emit = defineEmits<{
    (e: 'citySelected', city: CitySelected): void
  }>()

  const cities = ref<CityResult[]>([])
  const selectedValue = ref(props.value)

  watch(
    () => props.value,
    value => {
      selectedValue.value = value
    }
  )

  async function searchCitiesFn(search: string) {
    if (search.length < 3) return new Map()

    const params: GeoApiGouvFrQueryParams = {
      nom: search,
      limit: 3
    }
    if (props.zipCode) params.codePostal = props.zipCode

    const res = await $fetch<GeoApiGouvFrCommune[]>(
      'https://geo.api.gouv.fr/communes',
      { params }
    )

    cities.value = []

    /**
     * Big cities oftenly have multiple zip code.
     * The BAN API always returns the full list of zip codes associated to the city, even if a zip code is provided in the request.
     * Here, we get rid of other associated zip codes.
     */
    res.forEach(({ nom, codesPostaux, codeRegion }) => {
      codesPostaux.forEach(codePostal => {
        if (!props.zipCode || props.zipCode === codePostal) {
          cities.value.push({ nom, codePostal, codeRegion })
        }
      })
    })

    return new Map(
      cities.value.map(({ nom, codePostal }) => [
        codePostal,
        `${codePostal} ${nom}`
      ])
    )
  }

  function onSelectCity(codePostal: string) {
    const city = cities.value.find(a => a.codePostal === codePostal)
    if (!city) return
    selectedValue.value = city.nom
    emit('citySelected', {
      zipCode: city.codePostal,
      city: city.nom,
      codeRegion: city.codeRegion
    })
  }
</script>
