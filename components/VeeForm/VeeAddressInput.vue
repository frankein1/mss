<template>
  <VeeAutocomplete
    :label="label"
    :name="name"
    :search-fn="searchAddressesFn"
    :value="selectedValue"
    :required="required"
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

  const props = withDefaults(
    defineProps<{
      name: string
      label: string
      required?: boolean
      zipCode?: string | null
    }>(),
    { required: false, zipCode: '' }
  )

  const emit = defineEmits<{
    (e: 'addressSelected', address: AddressSelected): void
  }>()

  const addresses = ref<BanAddress[]>([])
  const selectedValue = ref<string | undefined>(undefined)

  async function searchAddressesFn(search: string): Promise<Options> {
    selectedValue.value = search
    if (search.length < 3) {
      return new Map()
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
    return new Map(
      addresses.value.map(({ id, name, postcode, city }) => [
        id,
        `${name}, ${postcode} ${city}`
      ])
    )
  }

  function onSelectAddress(addressId: string) {
    const address = addresses.value.find(a => a.id === addressId)
    if (!address) {
      selectedValue.value = undefined
      return
    }
    selectedValue.value = address.name
    const region = address.context.split(',')[2].trim()
    emit('addressSelected', {
      zipCode: address.postcode,
      city: address.city,
      region
    })
  }
</script>
