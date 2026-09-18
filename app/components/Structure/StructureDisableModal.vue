<template>
  <div
    class="fr-alert fr-alert--sm fr-mb-4v"
    :class="inactive ? 'fr-alert--info' : 'fr-alert--warning'"
  >
    <p class="fr-text--bold">
      Structure <span class="text--uppercase">{{ structure.name }}</span>
      {{ inactive ? 'inactive' : 'active' }}&nbsp;: dernière activité le
      {{
        formatDateToLocalTimezone(structure.lastAccess || structure.created)
      }}, {{ structure.deactivationAlertEmail }}&nbsp;{{ alertEmailsLabel }}.
    </p>
    <p>
      Assurez-vous que vous souhaitez-bien désactiver cette structure, cette
      action est irréversible.
    </p>
  </div>

  <AtomStepper
    :steps
    :current-step
  />

  <template v-if="currentStep === 1">
    <StructureDisableRecap :structure />

    <hr />
    <p>
      Vous allez recevoir un code de confirmation unique sur votre adresse email
      <span class="fr-text--bold">{{ user?.email }}</span
      >. Ne fermez pas cette fenêtre.
    </p>
  </template>

  <template v-else>
    <StructureDisableRecap :structure />

    <div class="fr-notice fr-notice--info fr-mb-4v">
      <div class="fr-container">
        <div class="fr-notice__body">
          <p>
            <span class="fr-notice__title">
              Un code de confirmation a été envoyé à l'adresse
              {{ user?.email }}
            </span>
          </p>
        </div>
      </div>
    </div>

    <form
      novalidate
      @submit.prevent="onSubmitCode"
    >
      <p class="fr-mb-2v">
        Entrez le code reçu par email, valable 10 minutes, pour confirmer la
        désactivation de <strong>{{ structure.name }}</strong
        >.
      </p>
      <VeeInput
        name="code"
        label="Code de validation (obligatoire)"
      />
    </form>

    <p class="fr-text--sm fr-mt-4v fr-mb-0">
      La désactivation peut prendre quelques secondes, merci de ne pas fermer
      cette fenêtre.
    </p>
  </template>

  <div class="fr-mt-8v">
    <ul
      class="fr-btns-group fr-btns-group--right fr-btns-group--inline-md fr-btns-group--icon-left"
    >
      <li>
        <button
          class="fr-btn fr-btn--secondary"
          title="Annuler"
          type="button"
          @click="cancel()"
        >
          Annuler
        </button>
      </li>
      <li v-if="currentStep === 1">
        <button
          class="fr-btn"
          title="Recevoir le code"
          type="button"
          @click="onRequestCode"
        >
          Recevoir le code
        </button>
      </li>
      <li v-else>
        <button
          class="fr-btn fr-btn--icon-left btn-delete-action"
          :class="{
            'fr-icon-delete-line': !isDisabling,
            'btn-loading': isDisabling
          }"
          title="Désactiver la structure"
          type="button"
          :disabled="isDisabling"
          @click="onSubmitCode"
        >
          Désactiver la structure
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import { z } from 'zod'
  import type { AdminStructureInfo } from './types'
  import { validationCodeConstraint } from '~~/server/schema'
  import { hasCompletedDeactivationWarnings } from '~/utils/structure'

  const authState = useAuthState()

  const props = defineProps<{
    structure: AdminStructureInfo
    requestCode: (structure: AdminStructureInfo) => Promise<boolean>
    disable: (structure: AdminStructureInfo, code: string) => Promise<void>
    cancel: () => void
  }>()

  const user = computed(() => authState.user.value)

  /** Only changes the wording: a code is required in both cases */
  const inactive = computed(() =>
    hasCompletedDeactivationWarnings(props.structure)
  )

  const alertEmailsLabel = computed(() =>
    props.structure.deactivationAlertEmail > 1
      ? 'e-mails de relance envoyés'
      : 'e-mail de relance envoyé'
  )

  // Steps
  const currentStep = ref(1)
  const steps = [
    'Recevoir un code de confirmation',
    'Valider le code de confirmation'
  ]

  async function onRequestCode() {
    if (await props.requestCode(props.structure)) {
      currentStep.value = 2
    }
  }

  const { handleSubmit } = useForm<{ code: string }>({
    validationSchema: toTypedSchema(
      z.object({ code: validationCodeConstraint })
    )
  })

  const isDisabling = ref(false)

  const onSubmitCode = handleSubmit(async ({ code }) => {
    // The disabled attribute only applies on the next DOM update, and the form
    // can also be submitted with the Enter key
    if (isDisabling.value) {
      return
    }
    isDisabling.value = true
    try {
      await props.disable(props.structure, code)
    } finally {
      isDisabling.value = false
    }
  })
</script>
