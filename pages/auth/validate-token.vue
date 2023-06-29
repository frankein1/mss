<template>
  <main class="fr-container fr-my-8w">
    <div class="fr-grid-row fr-my-5w">
      <div
        v-if="user"
        class="fr-col fr-col-lg-8 fr-col-offset-lg-2 text-center"
      >
        <h1 class="fr-text--regular">
          <span v-if="pending">Jeton en cours de vérification...</span>
          <span v-else-if="user">Bonjour {{ name }}!</span>
          <span v-else-if="errorMessage">{{ errorMessage }}</span>
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
    user: JwtUser
    error: string
  }

  const pending = ref(true)
  const errorMessage = ref<string>()
  const user = ref<JwtUser>()

  if (process.client) {
    const res = await $fetch<ValidateTokenOutput>('/api/auth/validate-token', {
      method: 'POST',
      body: JSON.stringify({ token })
    })
    if (res.error) {
      errorMessage.value = res.error
    }
    if (res.user) {
      user.value = res.user
      store.login(user.value)
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
