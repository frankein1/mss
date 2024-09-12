<template>
  <ProConnectButton v-if="isProConnect" />
  <InclusionConnectButton v-else />
</template>

<script setup lang="ts">
  const {
    public: { ssoIssuer }
  } = useRuntimeConfig()

  const isProConnect = isProConnectActive(ssoIssuer)
</script>
