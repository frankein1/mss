<template>
  <div>
    <form
      v-if="!token"
      class="login-form"
      @submit="onSubmit"
    >
      <VeeInput
        name="email"
        label="email"
        required
      />
      <button
        class="fr-btn submit-btn"
        type="submit"
      >
        Sign-in
      </button>
    </form>
  </div>
</template>
<script setup lang="ts">
  import { AdminLoginInput, adminLoginSchema } from '~/server/schema'
  import { useAuthStore } from '~/store/auth'
  import { RoutePath } from '~/utils/routing'

  definePageMeta({
    layout: 'landing'
  })
  const route = useRoute()
  const { token } = route.query

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
    await useFetch('/api/login/magic-email', {
      method: 'POST',
      body: input,
      onResponse({ response }) {
        if (response._data.success) {
          snackbar.success('Vous avez reçu un mail!')
        }
      }
    })
  })
</script>

<style lang="scss" scope>
  .login-form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
