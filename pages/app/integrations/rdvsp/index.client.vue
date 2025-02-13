<template>
  <div class="fr-container fr-pb-5w">
    <img
      src="~/assets/img/redirection-rdvsp.svg"
      class="fr-responsive-img"
      alt=""
    />
    <h1 class="fr-h1 fr-text--xl">
      Redirection en cours vers RDV Service Public
    </h1>
    <AtomLoader
      class="fr-mx-auto fr-mt-5w"
      :diameter="70"
    />
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

<style scoped>
  .fr-container {
    padding: 1rem 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    > .fr-responsive-img {
      margin-bottom: 1.5rem;
      max-width: 35rem;
    }

    > h1 {
      color: var(--primary);
      font-weight: var(--bold);
      max-width: 35rem;
      text-align: center;
    }
  }
</style>
