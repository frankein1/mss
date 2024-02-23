import {
  AddressSelected,
  CitySelected,
  GeoApiGouvFrRegion,
  GeoApiGouvFrDepartment
} from '~/components/VeeForm/types'

type SetValue = (value: string) => void

export function useAddressFields({
  setCityValue,
  setZipcodeValue,
  setRegionValue,
  setDepartmentValue
}: {
  setCityValue: SetValue
  setZipcodeValue: SetValue
  setRegionValue?: SetValue
  setDepartmentValue?: SetValue
}) {
  function onCitySelected(citySelected: CitySelected) {
    updateAddressInformation(citySelected)
  }

  function onAddressSelected(address: AddressSelected) {
    updateAddressInformation(address)
  }

  async function updateAddressInformation(
    selection: CitySelected | AddressSelected
  ) {
    if (setRegionValue) {
      if ('codeRegion' in selection && selection.codeRegion) {
        setRegionValue(await codeRegionToRegionName(selection.codeRegion))
      }
      if ('region' in selection && selection.region) {
        setRegionValue(selection.region)
      }
    }

    if (setDepartmentValue) {
      if ('codeDepartement' in selection && selection.codeDepartement) {
        setDepartmentValue(
          await codeDepartementToDepartmentName(selection.codeDepartement)
        )
      }
      if ('departement' in selection && selection.departement) {
        setDepartmentValue(selection.departement)
      }
    }

    setZipcodeValue(selection.zipCode)
    setCityValue(selection.city)
  }

  async function codeRegionToRegionName(codeRegion: string) {
    const { nom } = await $fetch<GeoApiGouvFrRegion>(
      `https://geo.api.gouv.fr/regions/${codeRegion}`
    )

    return nom
  }

  async function codeDepartementToDepartmentName(codeDepartement: string) {
    const { nom } = await $fetch<GeoApiGouvFrDepartment>(
      `https://geo.api.gouv.fr/departements/${codeDepartement}`
    )

    return nom
  }

  return { onCitySelected, onAddressSelected }
}
