<template>
  <form
    class="fr-container--fluid"
    @submit="onSubmit"
  >
    <VeeCheckbox
      class="fr-mt-2w"
      name="read"
      label="Je confirme avoir pris connaissance des conditions générales d'utilisation"
      required
    />
    <VeeCheckbox
      class="fr-mt-2w"
      name="accept"
      label="J'accepte les conditions générales d'utilisation"
      required
    />
    <ul
      class="fr-btns-group fr-btns-group--inline-lg fr-btns-group--icon-left fr-mt-2w"
    >
      <li>
        <NuxtLink
          :to="RoutePath.AuthLogout()"
          target="_self"
          class="fr-btn fr-btn--secondary fr-icon-logout-box-r-line"
        >
          Déconnexion
        </NuxtLink>
      </li>
      <li>
        <button
          class="fr-btn"
          type="submit"
        >
          Enregistrer
        </button>
      </li>
    </ul>
  </form>
</template>

<script lang="ts" setup>
  import { useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import { AcceptCGUInput, acceptCGUSchema } from '~/server/schema'
  import { useAuthStore } from '~/store/auth'
  import { RoutePath } from '~/utils/routing'

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()
  const auth = useAuthStore()

  const { handleSubmit } = useForm<AcceptCGUInput>({
    validationSchema: toTypedSchema(acceptCGUSchema)
  })

  const onSubmit = handleSubmit(() => {
    useTrpcMutation({
      mutation: () => trpcClient.user.acceptCGU.mutate({}),
      onSuccess: user => {
        auth.login(user)
        navigateTo(RoutePath.AppOverview())
      },
      onFailure: () => {
        snackbar.error("L'acceptation des CGU a échoué.")
      }
    })
  })
</script>
