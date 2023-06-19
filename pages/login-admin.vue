<template>
  <form
    class="fr-container--fluid"
    @submit="onSubmit"
  >
    <div class="fr-grid-row fr-grid-row--gutters form-grid">
      <VeeInput
        name="email"
        label="email"
        required
      />
    </div>
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
    const { user } = await useTrpcClient().admin.login.mutate(input)
    if (user) {
      navigateTo('/admin/structures')
    }
  })
</script>
