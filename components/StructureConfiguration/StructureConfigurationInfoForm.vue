<template>
  <form
    ref="form"
    novalidate
    @submit.prevent="onSubmit"
  >
    <fieldset
      class="fr-fieldset fr-grid-row fr-grid-row--gutters"
      aria-labelledby="structure-information-legend"
    >
      <div class="fr-col-12">
        <VeeInput
          name="name"
          :label="structureFieldLabels.name"
          required
        />
      </div>

      <div class="fr-col-12">
        <VeeAddressInput
          name="address"
          :label="structureFieldLabels.address"
          :zip-code="zipCode"
          required
          @address-selected="onAddressSelected"
        />
      </div>

      <div class="fr-col-4">
        <VeeInput
          name="zipcode"
          :label="structureFieldLabels.zipcode"
          required
          @change-value="zipCode = $event"
        />
      </div>
      <div class="fr-col-8">
        <VeeCityInput
          name="city"
          :label="structureFieldLabels.city"
          :zip-code="zipCode"
          required
          @city-selected="onCitySelected"
        />
      </div>

      <div class="fr-col-12">
        <VeeInput
          name="phone"
          :label="structureFieldLabels.phone"
          type="tel"
          required
        />
      </div>

      <div class="fr-col-12">
        <VeeInput
          name="email"
          :label="structureFieldLabels.email"
          required
        />
      </div>
    </fieldset>

    <ul
      class="fr-btns-group fr-btns-group--inline-md fr-btns-group--right fr-mt-3w"
    >
      <li>
        <button
          class="fr-btn fr-btn--secondary"
          type="button"
          @click="modal.close"
        >
          Annuler
        </button>
      </li>
      <li>
        <button
          class="fr-btn"
          type="submit"
        >
          Valider
        </button>
      </li>
    </ul>
  </form>
</template>

<script lang="ts" setup>
  import { structureFieldLabels } from '~/client/labels'
  import type { StructureConfigurationInfo } from '~/components/StructureConfiguration/types'

  import type {
    CitySelected,
    AddressSelected
  } from '~/components/VeeForm/types'
  import {
    EditCurrentUserStructureInfoInput,
    editCurrentUserStructureInfoSchema
  } from '~/server/schema'

  const props = defineProps<{ structure: StructureConfigurationInfo }>()

  const emit = defineEmits<{
    updateStructureInfo: [values: EditCurrentUserStructureInfoInput]
  }>()

  const modal = useModal()

  /** Setup vee validate */
  const form = ref<HTMLFormElement | null>(null)

  const { handleSubmit, setFieldValue } =
    useForm<EditCurrentUserStructureInfoInput>({
      validationSchema: toTypedSchema(editCurrentUserStructureInfoSchema),
      initialValues: {
        // structureId: props.structure.id,
        name: props.structure.name,
        zipcode: props.structure.zipcode,
        city: props.structure.city,
        address: props.structure.address,
        phone: props.structure.phone,
        email: props.structure.email
      }
    })

  const { onSubmit, caughtErrors } = useCatchFormErrors(handleSubmit, values =>
    emit('updateStructureInfo', values)
  )

  useDisplayFormErrors(form, caughtErrors, {})

  /** Manage address */
  const zipCode = ref(props.structure?.zipcode)
  const city = ref(props.structure?.city)

  function onCitySelected(citySelected: CitySelected) {
    updateZipCodeAndCity(citySelected.zipCode, citySelected.city)
  }

  function onAddressSelected(address: AddressSelected) {
    updateZipCodeAndCity(address.zipCode, address.city)
  }

  function updateZipCodeAndCity(_zipCode: string, _city: string) {
    zipCode.value = _zipCode
    city.value = _city
    setFieldValue('zipcode', _zipCode)
    setFieldValue('city', _city)
  }
</script>
