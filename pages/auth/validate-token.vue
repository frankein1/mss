<template>
  <main class="landing-main-container fr-container fr-my-8w">
    <div class="fr-grid-row fr-my-5w">
      <div class="fr-col fr-col-lg-8 fr-col-offset-lg-2 text-center">
        <h1 class="fr-text--regular">
          <span v-if="pending">{{ RouteTitle.AuthValidateToken() }}...</span>
          <span v-else-if="user">Bonjour {{ name }} !</span>
          <span v-else-if="errorMessage">{{ errorMessage }}</span>
        </h1>
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
  import { useAuthStore } from '~/store/auth'
  import { JwtUser } from '~/types/user'
  import { RouteTitle } from '~/utils/routing'
  import { formatUserDisplayName } from '~/utils/user'

  useHead({
    title: RouteTitle.AuthValidateToken()
  })

  definePageMeta({
    layout: 'landing'
  })
  const route = useRoute()
  const store = useAuthStore()
  const token = route.query.token as string
  const redirectUrl =
    (route.query.redirectUrl as string | undefined) || useHomePage()

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
    pending.value = false
    if (res.error) {
      errorMessage.value = res.error
    }
    if (res.user) {
      user.value = res.user
      store.login(user.value)
      navigateTo(redirectUrl)
    }
  }

  const name = computed(() => {
    return user.value ? formatUserDisplayName(user.value) : ''
  })
</script>

<style lang="scss" scoped>
  .text-center {
    text-align: center;
  }
</style>
