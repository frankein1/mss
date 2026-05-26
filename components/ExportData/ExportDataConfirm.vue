<template>
  <div v-if="isSubmitting">Loading...</div>
  <div v-else-if="error">{{ error.message }}</div>
  <div v-else>
    <p v-if="hasFilters">
      Toutes les pages de résultats seront exportées avec les filtres actuels.
    </p>
    <AtomAlert
      class="fr-mb-2w"
      :alert-type="AlertType.Warning"
      message="Vous êtes sur le point d'exporter des données personnelles des bénéficiaires."
    >
      <template #detailedMessage>
        Nous attirons votre attention sur les données sensibles du fichier que
        vous téléchargez.
      </template>
    </AtomAlert>

    <p class="fr-mb-2v">
      Entrez le code reçu par email valable 10 minutes pour valider l'export de
      données.
    </p>

    <p class="fr-mb-2w">Veuillez ne pas fermer la modale.</p>

    <form
      ref="form"
      novalidate
      @submit.prevent="onSubmit"
    >
      <VeeInput
        name="code"
        required
        :disabled="isExporting"
        label="Code de validation"
      />

      <div
        v-if="isExporting"
        class="export-loading"
      >
        <AtomLoader :diameter="32" />
        <p class="fr-mt-1w fr-text--sm">
          Export en cours... Le téléchargement peut prendre plusieurs secondes
          avant de démarrer
        </p>
      </div>

      <div class="export-btn-container">
        <button
          class="fr-btn"
          :disabled="isExporting"
          @click="onSubmit"
        >
          Exporter
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
  import { z } from 'zod'
  import { AlertType } from '~/utils/constants/alert'
  import { VALIDATION_CODE_LENGTH } from '~/server/utils/constants'

  const props = defineProps<{
    hasFilters?: boolean
    export: (code: string) => Promise<void>
  }>()

  const trpcClient = useTrpcClient()

  const isSubmitting = ref(false)
  const isExporting = ref(false)
  const error = ref<Error | null>(null)

  useTrpcMutation({
    isSubmitting,
    mutation: () => trpcClient.user.authorizeExport.mutate(),
    onFailure: () => {
      error.value = new Error(
        "La génération du code d'autorisation a échoué. Si vous avez effectué beaucoup d'appels à l'export, veuillez attendre une ou deux minutes."
      )
    }
  })

  const { handleSubmit } = useForm<{ code: string }>({
    validationSchema: toTypedSchema(
      z.object({
        code: z
          .string({ required_error: requiredErrorMessage })
          .length(
            VALIDATION_CODE_LENGTH,
            'Le champ doit contenir 8 caractères.'
          )
      })
    )
  })

  const onSubmit = handleSubmit(async ({ code }) => {
    isExporting.value = true
    try {
      await props.export(code)
    } finally {
      isExporting.value = false
    }
  })
</script>

<style scoped>
  .export-btn-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .export-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1rem;
  }
</style>
