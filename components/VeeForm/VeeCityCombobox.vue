<template>
  <ComboBox
    v-model="selectedCity"
    :label="label"
    :required="required"
    :disabled="disabled"
    :loading="loading"
    :options="cityOptions"
    :format-display-value="displayCityName"
    :error="error"
    @input="onSearch"
    @select="onSelectCity"
    @clear="setValue(null)"
  >
    <template #default="{ option }">
      {{ option.codePostal }} {{ option.nom }}
    </template>
  </ComboBox>
</template>

<script lang="ts" setup>
  import { useField } from 'vee-validate'
  import { useDebounceFn } from '@vueuse/core'
  import type {
    GeoApiGouvFrCommune,
    CityResult,
    GeoApiGouvFrQueryParams,
    CitySelected
  } from './types'
  import { SEARCH_DEFER_MS } from '~/utils/constants'

  const props = withDefaults(
    defineProps<{
      label: string
      name: string
      zipCode?: string
      required?: boolean
      disabled?: boolean
      requestLimit?: number
    }>(),
    { zipCode: '', required: false, disabled: false, requestLimit: 3 }
  )

  const emit = defineEmits<{
    citySelected: [city: CitySelected]
  }>()

  type CityOption = CityResult & { disabled?: boolean }

  const name = toRef(() => props.name)
  const {
    setValue,
    value: fieldValue,
    errorMessage: error
  } = useField<string | null>(name)

  function buildPlaceholderCity(nom: string): CityOption {
    return { nom, codePostal: '', codeRegion: '', codeDepartement: '' }
  }

  const selectedCity = ref<CityOption | null>(
    fieldValue.value ? buildPlaceholderCity(fieldValue.value) : null
  )
  const cityOptions = ref<CityOption[]>([])
  const loading = ref(false)

  // The field can be updated from outside this component (e.g. an address
  // combobox setting the city via setFieldValue). selectedCity/ComboBox's
  // displayedValue only change through onSearch/onSelectCity/@clear, so
  // without this, an external update never reaches the visible input.
  watch(fieldValue, newValue => {
    if (selectedCity.value?.nom === newValue) {
      return
    }
    selectedCity.value = newValue ? buildPlaceholderCity(newValue) : null
  })

  function displayCityName(city: CityOption) {
    return city.nom
  }

  // Keeps the field in sync with whatever the user typed, so a city
  // that isn't picked from the results list still gets saved as-is.
  function onSearch(search: string) {
    setValue(search)
    if (!search.trim()) {
      cityOptions.value = []
      return
    }
    debouncedFn(search.trim())
  }

  const debouncedFn = useDebounceFn(async (search: string) => {
    const params: GeoApiGouvFrQueryParams = {
      nom: search.toLocaleLowerCase(),
      limit: props.requestLimit
    }
    if (props.zipCode) {
      params.codePostal = props.zipCode
    }

    loading.value = true
    try {
      const res = await $fetch<GeoApiGouvFrCommune[]>(
        'https://geo.api.gouv.fr/communes',
        { params }
      )

      const cities: CityOption[] = []
      /**
       * Big cities oftenly have multiple zip code.
       * The BAN API always returns the full list of zip codes associated to the city, even if a zip code is provided in the request.
       * Here, we get rid of other associated zip codes.
       */
      res.forEach(({ nom, codesPostaux, codeRegion, codeDepartement }) => {
        codesPostaux.forEach(codePostal => {
          if (!props.zipCode || props.zipCode === codePostal) {
            cities.push({ nom, codePostal, codeRegion, codeDepartement })
          }
        })
      })
      cityOptions.value = cities
    } finally {
      loading.value = false
    }
  }, SEARCH_DEFER_MS)

  function onSelectCity(city: CityOption) {
    setValue(city.nom)
    emit('citySelected', {
      zipCode: city.codePostal,
      city: city.nom,
      codeRegion: city.codeRegion,
      codeDepartement: city.codeDepartement
    })
  }
</script>
