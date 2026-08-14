<template>
  <form
    ref="form"
    novalidate
    @submit.prevent="onSubmit"
  >
    <h3>Combobox - Ville (Vee City Combobox)</h3>

    <h4>Champ libre</h4>
    <div id="vee-city-combobox-free">
      <VeeCityCombobox
        label="Ville"
        name="free"
        @city-selected="onCitySelected('free', $event)"
      />
    </div>

    <h4>Champ requis</h4>
    <div id="vee-city-combobox-required">
      <VeeCityCombobox
        label="Ville"
        name="required"
        required
        @city-selected="onCitySelected('required', $event)"
      />
    </div>

    <h4>Champ désactivé</h4>
    <div id="vee-city-combobox-disabled">
      <VeeCityCombobox
        label="Ville"
        name="disabled"
        disabled
      />
    </div>

    <h4>Filtré par code postal</h4>
    <div id="vee-city-combobox-zipcode">
      <VeeCityCombobox
        label="Ville (zipcode is 75001)"
        name="zipCode"
        zip-code="75001"
        @city-selected="onCitySelected('zipCode', $event)"
      />
    </div>

    <button
      class="fr-btn fr-mt-2w"
      type="submit"
    >
      Valider
    </button>
  </form>

  <div>Valeurs sélectionnées : {{ selected }}</div>
</template>

<script setup lang="ts">
  import { z } from 'zod'
  import VeeCityCombobox from './VeeCityCombobox.vue'
  import type { CitySelected } from './types'

  const form = useTemplateRef('form')

  const schema = z.object({
    free: z.string().nullish(),
    required: z.string(),
    disabled: z.string().nullish(),
    zipCode: z.string().nullish()
  })

  const { handleSubmit } = useForm<z.infer<typeof schema>>({
    validationSchema: toTypedSchema(schema)
  })

  const onSubmit = handleSubmit(() => {})

  const selected = ref<Record<string, CitySelected>>({})

  function onCitySelected(name: string, city: CitySelected) {
    selected.value[name] = city
  }
</script>
