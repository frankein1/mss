<template>
  <div class="fr-container fr-pb-5w">
    <AtomLoader class="fr-mx-auto" />
    <h1 class="fr-h1">Redirection vers RDVSP en cours...</h1>
  </div>
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
    useTrpcMutation({
      mutation: () =>
        trpcClient.rdvsp.planAppointment.mutate({ beneficiaryId: id }),
      onSuccess: url => {
        window.location.href = url
      },
      onFailure
    })
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
