<template>
  <form
    ref="form"
    novalidate
    @submit.prevent
  >
    <h3>Champ de saisie - Vee Input</h3>

    <h4>Champ libre avec suggestion</h4>
    <div id="vee-input-free">
      <VeeInput
        label="Champ libre"
        name="free"
        hint="Suggestion du champ"
      />
    </div>

    <h4>Champ désactivé</h4>
    <div id="vee-input-deactivated">
      <VeeInput
        label="Champ libre"
        name="deactivated"
        disabled
      />
    </div>

    <h4>Champ libre requis</h4>
    <div id="vee-input-free-required">
      <VeeInput
        label="Champ libre"
        name="required"
        required
      />
    </div>

    <h4>Champ numérique avec placeholder</h4>
    <div id="vee-input-numeric-placeholder">
      <VeeInput
        label="Champ numérique"
        name="numeric"
        placeholder="Un placeholder en général à éviter pour des raisons d'accessibilité"
      />
    </div>

    <h4>Date</h4>
    <div id="vee-input-date">
      <VeeInput
        label="Date de naissance"
        name="date"
        type="date"
      />

      <span>{{ date }}</span>
    </div>

    <h4>Téléphone</h4>
    <div id="vee-input-phone">
      <VeeInput
        label="Téléphone"
        name="phone"
        type="tel"
      />
    </div>

    <h4>Email</h4>
    <div id="vee-input-email">
      <VeeInput
        label="Courriel"
        name="email"
        type="email"
      />
    </div>

    <h4>Numéro sécurité sociale</h4>
    <div id="vee-input-ssn">
      <VeeInput
        label="Numéro"
        name="ssn"
        type="social-security-number"
      />
    </div>

    <h4>Siret</h4>
    <div id="vee-input-siret">
      <VeeInput
        label="SIRET"
        name="siret"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
  import { z } from 'zod'
  import VeeInput from './VeeInput.vue'
  import {
    stringOrEmpty,
    emailOrEmpty,
    socialSecurityNumberConstraint,
    phoneConstraint,
    siretConstraint,
    dateOrEmpty
  } from '~/server/schema/helpers.schema'

  const form = ref<HTMLFormElement | null>(null)
  const schema = z.object({
    free: z.string(),
    required: z.string(),
    numeric: z.number(),
    date: dateOrEmpty,
    phone: stringOrEmpty(phoneConstraint),
    email: emailOrEmpty(),
    ssn: stringOrEmpty(socialSecurityNumberConstraint),
    siret: siretConstraint
  })

  const { values } = useForm<z.infer<typeof schema>>({
    validationSchema: toTypedSchema(schema)
  })

  const date = computed(() => values.date)
</script>
