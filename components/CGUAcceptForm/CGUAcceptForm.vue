<template>
  <form
    class="fr-container--fluid"
    novalidate
    @submit.prevent="onSubmit"
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
          :to="apiRoutes.proConnect.ApiLogout.path()"
          external
          class="fr-btn fr-btn--secondary fr-icon-logout-box-r-line"
        >
          Déconnexion
        </NuxtLink>
      </li>
      <li>
        <button
          class="fr-btn"
          type="submit"
          :disabled="isSubmitting"
          :data-submitting="isSubmitting"
        >
          Enregistrer
        </button>
      </li>
    </ul>
  </form>
</template>

<script lang="ts" setup>
  import { toTypedSchema } from '@vee-validate/zod'
  import { routes, apiRoutes } from '~/utils/routes'
  import type { AcceptCGUInput } from '~/server/schema'
  import { acceptCGUSchema } from '~/server/schema'

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()
  const { getSession } = useAuth()

  const { handleSubmit } = useForm<AcceptCGUInput>({
    validationSchema: toTypedSchema(acceptCGUSchema)
  })

  const isSubmitting = ref(false)

  const onSubmit = handleSubmit(async () => {
    isSubmitting.value = true
    try {
      await trpcClient.user.acceptCGU.mutate()
      await getSession()
      await navigateTo(routes.user.AppOverview.path())
    } catch {
      snackbar.error("L'acceptation des CGU a échoué.")
    }
    isSubmitting.value = false
  })
</script>
