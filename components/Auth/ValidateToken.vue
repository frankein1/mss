<template>
  <div class="fr-grid-row fr-my-5w">
    <div class="fr-col fr-col-lg-8 fr-col-offset-lg-2 text-center">
      <h1 class="fr-text--regular">
        <span v-if="pending">{{ RouteTitle.AuthValidateToken() }}...</span>
        <span v-else-if="data">Bonjour {{ name }} !</span>
        <span v-else-if="error">{{ error }}</span>
      </h1>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { useAuthStore } from '~/store/auth'
  import { JwtUser } from '~/types/user'
  import { RouteTitle } from '~/utils/routing'
  import { formatUserDisplayName } from '~/utils/user'

  const route = useRoute()
  const store = useAuthStore()
  const token = route.query.token as string
  const redirectUrl =
    (route.query.redirectUrl as string | undefined) || useHomePage()

  type ValidateTokenOutput = {
    user: JwtUser
  }

  const { data, error, pending } = await useFetch<ValidateTokenOutput>(
    '/api/auth/validate-token',
    {
      method: 'POST',
      body: JSON.stringify({ token }),
      onResponse({ response }) {
        const { _data: data } = response
        if (data) {
          store.login(data.user)
          navigateTo(redirectUrl)
        }
      }
    }
  )

  const name = computed(() => {
    return data.value ? formatUserDisplayName(data.value.user) : ''
  })
</script>

<style lang="scss" scoped>
  .text-center {
    text-align: center;
  }
</style>
