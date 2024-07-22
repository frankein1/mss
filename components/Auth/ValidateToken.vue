<template>
  <div class="fr-grid-row fr-my-5w">
    <div class="fr-col fr-col-lg-8 fr-col-offset-lg-2 text-center">
      <h1 class="fr-text--regular">
        <span v-if="pending">{{ routes.auth.AuthValidateToken.title }}...</span>
        <span v-else-if="data">Bonjour {{ name }} !</span>
        <span v-else-if="error">{{ error }}</span>
      </h1>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { RouteLocationRaw } from '#vue-router'
  import { JwtUser } from '~/types/user'
  import { routes } from '~/utils/routes'
  import { formatUserDisplayName } from '~/utils/user'

  const route = useRoute()
  const auth = useAuth()
  const authState = useAuthState()

  const token = route.query.token as string
  const redirectUrl =
    (route.query.redirectUrl as string | undefined) || useHomePage()

  type ValidateTokenOutput = {
    user: JwtUser
  }
  const trpcClient = useTrpcClient()

  const { data, error, pending } = await useFetch<ValidateTokenOutput>(
    '/api/auth/validate-token',
    {
      method: 'POST',
      body: JSON.stringify({ token }),
      async onResponse({ response }) {
        const { _data: data } = response
        if (data) {
          auth.login(data)
          const redirect = await checkDpoStatus()
          navigateTo(redirect)
        }
      }
    }
  )

  async function checkDpoStatus(): Promise<RouteLocationRaw> {
    if (authState.user.value?.role === 'Administrator') {
      return { path: redirectUrl }
    }

    const status = await trpcClient.structure.getStructureDPOStatus.query()

    return {
      path: redirectUrl,
      query: status.shouldFillDPO
        ? {
            shouldFillDPO: 'true',
            compulsory: status.compulsory ? 'true' : 'false'
          }
        : undefined
    }
  }

  const name = computed(() => {
    return data.value ? formatUserDisplayName(data.value.user) : ''
  })
</script>

<style lang="scss" scoped>
  .text-center {
    text-align: center;
  }
</style>
