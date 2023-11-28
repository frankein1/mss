<template>
  <div class="landing-main-container fr-container fr-my-8w">
    <form
      v-if="!token"
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
  import { useAuthStore } from '~/store/auth'
  import { RoutePath, RouteTitle } from '~/utils/routing'

  useHead({
    title: RouteTitle.AuthAdmin()
  })

  definePageMeta({
    layout: 'landing'
  })
  const route = useRoute()
  const { token } = route.query

  const isSubmitting = ref(false)

  onMounted(async () => {
    if (token) {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify(`{ token: ${token} }`)
      })
      const user = await res.json()
      if (user) {
        useAuthStore().login(user)
        navigateTo(RoutePath.AdminStructures())
      }
    }
  })

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
          snackbar.success('Vous avez reçu un mail !')
        }
      },
      onResponseError() {
        snackbar.error("Le compte administrateur n'as pas été retrouvé.")
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
