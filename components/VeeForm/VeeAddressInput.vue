<template>
  <VeeAutocomplete
    :label="label"
    :name="name"
    :search-fn="searchAddressesFn"
    :value="selectedValue"
    :required="required"
    :hint="hint"
    @result-selected="onSelectAddress"
  />
</template>

<script lang="ts" setup>
  import type {
    BanFeature,
    BanQueryParams,
    BanResponse,
    AddressSelected
  } from './types'
  import type { Options } from '~/utils/options'
  import { SEARCH_NUMBER_CHARACTERS } from '~/utils/constants'

  const props = withDefaults(
    defineProps<{
      name: string
      label: string
      required?: boolean
      zipCode?: string | null
      hint?: string
    }>(),
    { required: false, zipCode: '', hint: '' }
  )

  const emit = defineEmits<{
    addressSelected: [address: AddressSelected]
  }>()

  const addresses = ref<BanFeature[]>([])
  const selectedValue = ref<string | undefined>(undefined)

  async function searchAddressesFn(search: string): Promise<Options> {
    selectedValue.value = search
    if (search.length < SEARCH_NUMBER_CHARACTERS) {
      return []
    }

    const params: BanQueryParams = {
      q: search.toLocaleLowerCase(),
      limit: 3
    }
    if (props.zipCode) {
      params.postcode = props.zipCode
    }

    const geocodageApiUrl = 'https://data.geopf.fr/geocodage/search/'
    const res = await $fetch<BanResponse>(geocodageApiUrl, { params })

    addresses.value = res.features
    return addresses.value.map(
      ({ properties: { id, name, postcode, city } }) => ({
        value: id,
        label: `${name}, ${postcode} ${city}`
      })
    )
  }

  function onSelectAddress(addressId: string) {
    const feature = addresses.value.find(a => a.properties.id === addressId)
    if (!feature) {
      selectedValue.value = undefined
      return
    }
    const address = feature.properties
    selectedValue.value = address.name
    const addressParts = address.context.split(',')
    const region = addressParts[2]?.trim() || ''
    const departement = addressParts[1]?.trim() || ''
    emit('addressSelected', {
      zipCode: address.postcode,
      city: address.city,
      region,
      departement,
      coordinates: feature.geometry.coordinates
    })
  }
</script>
