<template>
  <div class="fr-grid-row fr-my-5w">
    <div class="fr-col fr-col-lg-8 fr-col-offset-lg-2 text-center">
      <h1 class="fr-text--regular">
        <span v-if="status === 'pending'"
          >{{ routes.auth.AuthValidateToken.title }}...</span
        >
        <span v-else-if="data?.user">Bonjour {{ name }} !</span>
        <span v-else-if="error">{{ error.message }}</span>
      </h1>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { RouteLocationRaw } from '#vue-router'
  import { AuthProvider } from '~/composables/useAuthProvider'
  import { JwtUser } from '~/types/user'
  import { routes } from '~/utils/routes'
  import { formatUserDisplayName } from '~/utils/user'
  import { AppContextPermissions } from '~/server/security'

  const route = useRoute()
  const auth = useAuth()
  const authState = useAuthState()

  const token = route.query.token as string
  const redirectUrl =
    (route.query.redirectUrl as string | undefined) || useHomePage()

  const { provider } = useAuthProvider()
  const trpcClient = useTrpcClient()

  type ValidateTokenResponse = {
    user: JwtUser
    permissions: AppContextPermissions
  }

  type ValidateTokenError = { statusCode: number; message: string }

  const { data, error, status } = await useFetch<
    ValidateTokenResponse,
    ValidateTokenError
  >('/api/auth/validate-token', {
    method: 'POST',
    body: JSON.stringify({ token }),
    async onResponse({ response: { _data } }) {
      if ('statusCode' in _data) {
        await handleError(_data as ValidateTokenError)
      } else {
        await handleLogin(_data as ValidateTokenResponse)
      }
    }
  })

  async function handleError(error: ValidateTokenError) {
    if (error.statusCode === 403) {
      await navigateTo(routes.error.ErrorDisabledAccount.path())
    } else if (error.statusCode === 401) {
      await navigateTo(routes.error.ErrorInvalidToken.path())
    }
  }

  async function handleLogin(data: ValidateTokenResponse) {
    provider.value = route.query.provider as AuthProvider
    auth.login(data)
    const redirect = await checkDpoStatus()
    await navigateTo(redirect)
  }

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
