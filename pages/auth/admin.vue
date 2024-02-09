<template>
  <div class="landing-main-container fr-container fr-my-8w">
    <form
      v-if="!token"
      ref="form"
      novalidate
      class="login-form"
      @submit.prevent="onSubmit"
    >
      <VeeInput
        name="email"
        label="email"
        required
      />
      <button
        class="fr-btn submit-btn"
        type="submit"
        :is-submitting="isSubmitting"
      >
        Sign-in
      </button>
    </form>
  </div>
</template>
<script setup lang="ts">
  import { AdminLoginInput, adminLoginSchema } from '~/server/schema'
  import { RouteTitle } from '~/utils/routing'

  useHead({
    title: RouteTitle.AuthAdmin()
  })

  definePageMeta({
    layout: 'landing'
  })
  const route = useRoute()
  const { token } = route.query

  const isSubmitting = ref(false)
  const form = ref<HTMLFormElement | null>(null)

  const snackbar = useSnackbar()

  const { handleSubmit } = useForm<AdminLoginInput>({
    validationSchema: toTypedSchema(adminLoginSchema)
  })

  const onSubmit = handleSubmit(async input => {
    isSubmitting.value = true
    await useFetch('/api/auth/magic-email', {
      method: 'POST',
      body: input,
      onResponse({ response }) {
        if (response._data.success) {
          snackbar.success(
            "Vous avez reçu le lien d'authentification dans votre boîte mail !"
          )
        }
      },
      onResponseError() {
        snackbar.error("Le compte administrateur n'a pas été retrouvé.", () => {
          form.value?.querySelector('input')?.focus()
        })
      }
    })
    isSubmitting.value = false
  })
</script>

<style lang="scss" scope>
  .login-form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
