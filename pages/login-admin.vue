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
  import { RoutePath } from '~/utils/routing'

  definePageMeta({
    layout: 'landing'
  })

  const { handleSubmit } = useForm<AdminLoginInput>({
    validationSchema: toTypedSchema(adminLoginSchema)
  })

  const onSubmit = handleSubmit(async input => {
    const { user } = await useTrpcClient().admin.login.mutate(input)
    if (user) {
      navigateTo(RoutePath.AdminStructures())
    }
  })
</script>

<style lang="scss" scope>
  .login-form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
