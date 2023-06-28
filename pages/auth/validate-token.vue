<template>
  <main class="fr-container fr-my-8w">
    <div class="fr-grid-row fr-my-5w">
      <div
        v-if="user"
        class="fr-col fr-col-lg-8 fr-col-offset-lg-2 text-center"
      >
        <h1 class="fr-text--regular">Bonjour {{ name }}!</h1>
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

  const user = await $fetch<JwtUser>('/api/login/validate-token', {
    method: 'POST',
    body: JSON.stringify({ token })
  })

  onMounted(() => {
    if (user) {
      store.login(user)
      navigateTo(useHomePage())
    }
  })

  const name = computed(() => {
    return getUserDisplayName(user)
  })
</script>

<style lang="scss" scoped>
  .text-center {
    text-align: center;
  }
</style>
