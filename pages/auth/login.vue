<template>
  <main class="landing-main-container fr-container fr-my-8w">
    <h1 class="login-title fr-h2 fr-mb-5w">{{ RouteTitle.AuthLogin() }}</h1>
    <InclusionConnectButton />
  </main>
</template>

<script lang="ts" setup>
  import { RouteTitle } from '~/utils/routing'

  useHead({
    title: RouteTitle.AuthLogin()
  })

  definePageMeta({
    layout: 'landing',
    middleware: 'skip-auth'
  })
</script>

<style lang="scss" scoped>
  @use '~/assets/style/variables' as *;

  .login-title {
    text-align: center;
    color: $primary;
  }
</style>
