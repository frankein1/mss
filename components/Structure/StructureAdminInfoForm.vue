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
        <VeeSelect
          name="type"
          :label="structureFieldLabels.type"
          :options="withEmptyValue(structureTypeKeys.options)"
          required
        />
      </div>
      <div class="fr-col-12">
        <VeeInput
          name="inhabitantsNumber"
          :label="structureFieldLabels.inhabitantsNumber"
          required
        />
      </div>

      <div class="fr-col-12">
        <VeeInput
          name="inseeCode"
          :label="structureFieldLabels.inseeCode"
          required
        />
      </div>

      <div class="fr-col-12">
        <VeeInput
          name="siret"
          :label="structureFieldLabels.siret"
          required
        />
      </div>
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
          @address-selected="onAddressSelected"
        />
      </div>

      <div class="fr-col-4">
        <VeeInput
          name="zipcode"
          :label="structureFieldLabels.zipcode"
          required
        />
      </div>
      <div class="fr-col-8">
        <VeeInput
          name="city"
          :label="structureFieldLabels.city"
          required
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
          type="email"
        />
      </div>

      <div class="fr-col-12 fr-mt-1w">
        <h3
          class="fr-mb-0 fr-text--lg"
          :style="{ color: '#3a3a3a' }"
        >
          Personne référente à la protection des données (DPO)&nbsp;:
        </h3>
      </div>

      <div class="fr-col-12">
        <VeeInput
          name="dpoFirstName"
          :label="structureFieldLabels.dpoFirstName"
          required
        />
      </div>

      <div class="fr-col-12">
        <VeeInput
          name="dpoLastName"
          :label="structureFieldLabels.dpoLastName"
          required
        />
      </div>

      <div class="fr-col-12">
        <VeeInput
          name="dpoEmail"
          :label="structureFieldLabels.dpoEmail"
          required
          type="email"
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
  import { structureTypeKeys } from '~/client/options'
  import { structureFieldLabels } from '~/client/labels'
  import type { StructureInfo } from '~/components/Structure/types'
  import { CreateStructureInput, createStructureSchema } from '~/server/schema'

  const props = defineProps<{
    structure?: StructureInfo
    validate: (values: CreateStructureInput) => void
  }>()

  const modal = useModal()

  const form = ref<HTMLFormElement | null>(null)

  const { handleSubmit, setFieldValue } = useForm<CreateStructureInput>({
    validationSchema: toTypedSchema(createStructureSchema),
    initialValues: {
      type: props.structure?.type,
      siret: props.structure?.siret,
      inhabitantsNumber: props.structure?.inhabitantsNumber,
      inseeCode: props.structure?.inseeCode,
      name: props.structure?.name,
      zipcode: props.structure?.zipcode,
      city: props.structure?.city,
      address: props.structure?.address,
      phone: props.structure?.phone,
      email: props.structure?.email,
      dpoEmail: props.structure?.dpoEmail || undefined,
      dpoFirstName: props.structure?.dpoFirstName || undefined,
      dpoLastName: props.structure?.dpoLastName || undefined
    }
  })

  const { onSubmit } = useCatchFormErrors(handleSubmit, values =>
    props.validate(values)
  )

  const { onAddressSelected } = useAddressFields({
    setCityValue: (value: string) => setFieldValue('city', value),
    setZipcodeValue: (value: string) => setFieldValue('zipcode', value)
  })
</script>
