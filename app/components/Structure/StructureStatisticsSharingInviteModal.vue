<template>
  <form
    novalidate
    @submit.prevent="onSubmit"
  >
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <p class="fr-text--sm text--muted fr-mb-0">
          La personne invitée pourra consulter les statistiques agrégées de
          votre structure. Elle n'aura accès à aucune donnée nominative, ni à
          aucun dossier.
        </p>
      </div>

      <div class="fr-col-12 fr-col-md-6">
        <VeeInput
          name="firstName"
          label="Prénom"
          required
        />
      </div>

      <div class="fr-col-12 fr-col-md-6">
        <VeeInput
          name="lastName"
          label="Nom"
          required
        />
      </div>

      <div class="fr-col-12">
        <VeeInput
          name="email"
          label="Adresse électronique professionnelle"
          hint="C'est l'adresse avec laquelle la personne se connectera via ProConnect."
          required
        />
      </div>

      <div
        v-if="errorMessage"
        class="fr-col-12"
      >
        <AtomAlert
          :alert-type="AlertType.Error"
          :message="errorMessage"
          :closeable="false"
        />
      </div>

      <div class="fr-col-12">
        <ul
          class="fr-btns-group fr-btns-group--inline-md fr-btns-group--right fr-mt-2w"
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
              :disabled="isSubmitting"
            >
              Autoriser
            </button>
          </li>
        </ul>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
  import type { InviteDecisionMakerInput } from '~~/server/schema'
  import { inviteDecisionMakerSchema } from '~~/server/schema'
  import { AlertType } from '~/utils/constants/alert'

  const modal = useModal()

  const props = defineProps<{
    isSubmitting: boolean
    errorMessage?: string
    submit: (values: InviteDecisionMakerInput) => void
  }>()

  const { handleSubmit } = useForm<InviteDecisionMakerInput>({
    validationSchema: toTypedSchema(inviteDecisionMakerSchema)
  })

  const onSubmit = handleSubmit(values => props.submit(values))
</script>
