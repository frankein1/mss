<template>
  <form
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
</template>
<script setup lang="ts">
  import { AdminLoginInput, adminLoginSchema } from '~/server/schema'

  definePageMeta({
    layout: 'landing'
  })

  const { handleSubmit } = useForm<AdminLoginInput>({
    validationSchema: toTypedSchema(adminLoginSchema)
  })

  const onSubmit = handleSubmit(async input => {
    await useFetch('/api/admin/login', {
      method: 'POST',
      body: input
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
