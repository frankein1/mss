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
        <VeeInput
          name="address"
          :label="structureFieldLabels.address"
          required
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
  import type { StructureInfo } from '~/components/Structure/types'
  import {
    EditStructureInfoInput,
    editStructureInfoSchema
  } from '~/server/schema'

  const props = defineProps<{
    structure: StructureInfo
    validate: (values: EditStructureInfoInput) => void
  }>()

  const modal = useModal()

  const form = ref<HTMLFormElement | null>(null)

  const { handleSubmit } = useForm<EditStructureInfoInput>({
    validationSchema: toTypedSchema(editStructureInfoSchema),
    initialValues: {
      name: props.structure.name,
      zipcode: props.structure.zipcode,
      city: props.structure.city,
      address: props.structure.address,
      phone: props.structure.phone,
      email: props.structure.email
    }
  })

  const { onSubmit } = useCatchFormErrors(handleSubmit, values =>
    props.validate(values)
  )
</script>
