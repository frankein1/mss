<template>
  <main class="fr-container fr-my-8w">
    <div class="fr-grid-row fr-my-5w">
      <div
        v-if="error"
        class="fr-col fr-col-lg-8 fr-col-offset-lg-2 text-center"
      >
        <h1 class="fr-text--regular">Authentification</h1>
        Votre jeton d'authentification <b>{{ token || '' }}</b> n'est pas
        valide. Merci de vous authentifier à nouveau
        {{ error.message }}
      </div>
      <div
        v-if="pending"
        class="fr-col fr-col-lg-8 fr-col-offset-lg-2 text-center"
      >
        <h1 class="fr-text--regular">Authentification</h1>
        Authentification en cours...
      </div>
      <div
        v-if="data"
        class="fr-col fr-col-lg-8 fr-col-offset-lg-2 text-center"
      >
        <h1 class="fr-text--regular">
          Bonjour {{ getUserDisplayName(data.user) }}!
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
  const { token } = route.query

  const { data, pending, error } = await useFetch('/api/login/validate-token', {
    headers: { 'Content-type': 'application/json' },
    method: 'POST',
    body: { token }
  })

  const typedData = ref(data.value?.user as unknown as JwtUser)

  onMounted(() => {
    if (typedData.value) {
      store.login(typedData.value)
      navigateTo(useHomePage())
    }
  })
</script>

<style lang="scss" scoped>
  .text-center {
    text-align: center;
  }
</style>
