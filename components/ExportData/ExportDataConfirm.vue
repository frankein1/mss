<template>
  <div v-if="isSubmitting">Loading...</div>
  <div v-else-if="error">{{ error.message }}</div>
  <div v-else>
    <p>Ne fermez pas cette fenêtre.</p>

    <p>
      Vous êtes sur le point d'exporter des données personnelles des
      bénéficiaires.
      <strong>
        Nous attirons votre attention sur les données sensibles du fichier que
        vous téléchargez.
      </strong>
    </p>

    <p>Toutes les pages seront exportées avec les filtres actuels.</p>

    <form
      ref="form"
      novalidate
      @submit.prevent="onSubmit"
    >
      <VeeInput
        name="code"
        required
        label="Veuillez entrer le code reçu par email valable 10 minutes pour valider
      l'export de données"
      />

      <div class="export-btn-container">
        <button
          class="fr-btn"
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
  import { VALIDATION_CODE_LENGTH } from '~/server/utils/constants'

  const props = defineProps<{ export: (code: string) => void }>()

  const trpcClient = useTrpcClient()

  const isSubmitting = ref(false)
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
          .string()
          .length(
            VALIDATION_CODE_LENGTH,
            'Le champ doit contenir 8 caractères.'
          )
      })
    )
  })

  const onSubmit = handleSubmit(async ({ code }) => {
    props.export(code)
  })
</script>

<style scoped>
  .export-btn-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
</style>
