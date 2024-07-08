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
  import { RouteLocationRaw } from '#vue-router'
  import { JwtUser } from '~/types/user'
  import { RouteTitle } from '~/utils/routing'
  import { formatUserDisplayName } from '~/utils/user'

  const route = useRoute()
  const auth = useAuth()
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
      onResponse({ response }) {
        const { _data: data } = response
        if (data) {
          auth.login(data)
          checkDpoStatus().then(res => {
            console.log(res)
            const redirectionParams: RouteLocationRaw = {
              path: redirectUrl,
              query: res.shouldFillDPO
                ? {
                    shouldFillDPO: 'true',
                    compulsory: res.compulsory ? 'true' : 'false'
                  }
                : undefined
            }

            navigateTo(redirectionParams)
          })
        }
      }
    }
  )

  const checkDpoStatus = async () => {
    const structureDPOStatus =
      await trpcClient.structure.getStructureDPOStatus.query()
    return structureDPOStatus
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
