<template>
  <main class="landing-main-container fr-container fr-my-8w">
    <h1 class="login-title fr-h2 fr-mb-5w">
      {{ routes.auth.AuthLogin.title }}
    </h1>
    <InclusionConnectButton />
  </main>
</template>

<script lang="ts" setup>
  import { routes } from '~/utils/routes'

  useHead({
    title: routes.auth.AuthLogin.title
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
