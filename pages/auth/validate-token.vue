<template>
  <main class="fr-container fr-my-8w">
    <div class="fr-grid-row fr-my-5w">
      <div class="fr-col fr-col-lg-8 fr-col-offset-lg-2 text-center">
        <h1 class="fr-text--regular">
          <span v-if="pending"> Authentification en cours... </span>
          <span v-else-if="user"> Bonjour {{ name }}! </span>
          <span v-else-if="errorMessage"> {{ errorMessage }}! </span>
        </h1>
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
  import { useAuthStore } from '~/store/auth'
  import { JwtUser } from '~/types/user'

  definePageMeta({
    layout: 'landing'
  })
  const route = useRoute()
  const store = useAuthStore()
  const token = route.query.token as string

  type ValidateTokenOutput = {
    error?: string
    user?: JwtUser
  }

  const user = ref<JwtUser>()
  const pending = ref<boolean>(true)
  const errorMessage = ref<string>()

  if (process.client) {
    const res = await $fetch<ValidateTokenOutput>('/api/auth/validate-token', {
      method: 'POST',
      body: JSON.stringify({ token })
    })
    if (res.error) {
      pending.value = false
      errorMessage.value = res.error
    } else if (res.user) {
      pending.value = false
      user.value = res.user
      store.login(res.user)
      navigateTo(useHomePage())
    }
  }

  const name = computed(() => {
    return user.value ? getUserDisplayName(user.value) : ''
  })
</script>

<style lang="scss" scoped>
  .text-center {
    text-align: center;
  }
</style>
