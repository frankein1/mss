<template>
  <form
    ref="form"
    novalidate
    @submit.prevent="onSubmit"
  >
    <h3>Combobox - Adresse (Vee Address Combobox)</h3>

    <h4>Champ libre</h4>
    <div id="vee-address-combobox-free">
      <VeeAddressCombobox
        label="Adresse"
        name="free"
        hint="Rechercher par adresse complète (numéro, voie, ville, code postal)"
        @address-selected="onAddressSelected('free', $event)"
      />
    </div>

    <h4>Champ requis</h4>
    <div id="vee-address-combobox-required">
      <VeeAddressCombobox
        label="Adresse"
        name="required"
        required
        @address-selected="onAddressSelected('required', $event)"
      />
    </div>

    <h4>Filtré par code postal</h4>
    <div id="vee-address-combobox-zipcode">
      <VeeAddressCombobox
        label="Adresse (filtré sur 75001)"
        name="zipCode"
        zip-code="75001"
        @address-selected="onAddressSelected('zipCode', $event)"
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
  import VeeAddressCombobox from './VeeAddressCombobox.vue'
  import type { AddressSelected } from './types'

  const form = useTemplateRef('form')

  const schema = z.object({
    free: z.string().nullish(),
    required: z.string(),
    zipCode: z.string().nullish()
  })

  const { handleSubmit } = useForm<z.infer<typeof schema>>({
    validationSchema: toTypedSchema(schema)
  })

  const onSubmit = handleSubmit(() => {})

  const selected = ref<Record<string, AddressSelected>>({})

  function onAddressSelected(name: string, address: AddressSelected) {
    selected.value[name] = address
  }
</script>
