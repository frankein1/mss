<template>
  <div class="fr-alert fr-alert--warning fr-alert--sm fr-mb-4v">
    <p class="fr-text--bold">
      Structure <span class="text--uppercase">{{ structure.name }}</span>
      active&nbsp;: dernière activité le
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
        required
        label="Code de validation"
      />
    </form>
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
          class="fr-btn fr-btn--icon-left fr-icon-delete-line btn-delete-action"
          title="Désactiver la structure"
          type="button"
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
  import { VALIDATION_CODE_LENGTH } from '~~/server/utils/constants'

  const authState = useAuthState()

  const props = defineProps<{
    structure: AdminStructureInfo
    requestCode: (structure: AdminStructureInfo) => Promise<boolean>
    disable: (structure: AdminStructureInfo, code: string) => void
    cancel: () => void
  }>()

  const user = computed(() => authState.user.value)

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
      z.object({
        code: z
          .string({ required_error: requiredErrorMessage })
          .length(
            VALIDATION_CODE_LENGTH,
            `Le champ doit contenir ${VALIDATION_CODE_LENGTH} caractères.`
          )
      })
    )
  })

  const onSubmitCode = handleSubmit(({ code }) => {
    props.disable(props.structure, code)
  })
</script>
