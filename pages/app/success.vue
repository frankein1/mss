<script lang="ts" setup>
  import { useAuthStore } from '~/store/auth'

  const { userName } = useAuthStore()
</script>

<template>
  <div>
    <div>{{ userName }}</div>
    <a href="/api/keycloak/logout">LOGOUT</a>
  </div>
</template>
