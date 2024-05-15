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
    BanAddress,
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

  const addresses = ref<BanAddress[]>([])
  const selectedValue = ref<string | undefined>(undefined)

  async function searchAddressesFn(search: string): Promise<Options> {
    selectedValue.value = search
    if (search.length < SEARCH_NUMBER_CHARACTERS) {
      return []
    }

    const params: BanQueryParams = {
      q: search,
      limit: 3
    }
    if (props.zipCode) {
      params.postcode = props.zipCode
    }

    const res = await $fetch<BanResponse>(
      'https://api-adresse.data.gouv.fr/search/',
      { params }
    )

    addresses.value = res.features.map(({ properties }) => properties)
    return addresses.value.map(({ id, name, postcode, city }) => ({
      value: id,
      label: `${name}, ${postcode} ${city}`
    }))
  }

  function onSelectAddress(addressId: string) {
    const address = addresses.value.find(a => a.id === addressId)
    if (!address) {
      selectedValue.value = undefined
      return
    }
    selectedValue.value = address.name
    const addressParts = address.context.split(',')
    const region = addressParts.length > 2 ? addressParts[2].trim() : ''
    const departement = addressParts.length > 1 ? addressParts[1].trim() : ''
    emit('addressSelected', {
      zipCode: address.postcode,
      city: address.city,
      region,
      departement
    })
  }
</script>
