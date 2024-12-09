<template>
  <PageContainer>
    <AtomLoader class="fr-mx-auto" />
    <h1 class="fr-h1">Redirection vers RDVSP en cours...</h1>
  </PageContainer>
</template>

<script setup lang="ts">
  import { routes } from '~/utils/routes'
  import { TRPCClientError } from '@trpc/client'

  useHead({ title: routes.rdvsp.AppRdvspAfterSignIn.title })

  const route = useRoute()
  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const action = route.query.action as string
  const id = route.query.id as string

  if (action === 'planAppointment') {
    const mutation = trpcClient.rdvsp[action].useMutation()

    useTrpcMutation({
      mutation: () => mutation.mutate({ beneficiaryId: id }),
      onSuccess,
      onFailure
    })
  }

  async function onSuccess(data: unknown) {
    switch (action) {
      case 'planAppointment': {
        await navigateTo(data as string, { external: true })
        break
      }
      default:
        break
    }
  }

  function onFailure(e: unknown) {
    if (e instanceof TRPCClientError) {
      switch (e.data.code) {
        case 'UNAUTHORIZED':
          snackbar.info("L'authentification sur RDVSP à échoué.")
          break
        case 'FORBIDDEN':
          snackbar.error(
            "Cette fonctionnalité n'est pas disponible. Veuillez vous rapprocher de votre responsable de structure."
          )
          break
        case 'BAD_REQUEST':
        default:
          snackbar.error("L'action a échoué.")
          break
      }
    } else {
      snackbar.error("L'action a échoué pour une raison inconnue.")
    }
  }

  definePageMeta({
    layout: 'empty'
  })
</script>
