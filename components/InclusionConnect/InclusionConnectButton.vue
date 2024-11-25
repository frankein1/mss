<template>
  <div>
    <NuxtLink
      class="inclusion-connect-btn"
      title="S'identifier avec InclusionConnect"
      :href="signinUrl"
      external
    >
      <span>
        Se connecter avec
        <strong>InclusionConnect</strong>
      </span>
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
  const SIGNIN_PATH = '/api/keycloak/signin'

  const route = useRoute()

  const signinUrl = computed(() => {
    const { redirectUrl } = route.query
    if (!redirectUrl) {
      return SIGNIN_PATH
    }
    const params = new URLSearchParams({ redirectUrl: redirectUrl as string })
    return `${SIGNIN_PATH}?${params}`
  })
</script>

<style lang="scss" scoped>
  @use '~/assets/style/variables' as *;

  .inclusion-connect-section {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .inclusion-connect-btn {
    background: none;
    display: inline-flex;
    align-items: center;
    height: 3.625rem;
    text-align: center;
    padding: 0.5rem 1rem 0.5rem 3.875rem;
    border-radius: 50rem;
    user-select: none;
    transition:
      background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out;
    color: #fff;
    border: 0.25rem solid var(--background-active-blue-france);
    background-color: var(--background-active-blue-france);
    background-image: url('../../assets/img/logo-inclusion-connect-bg.svg');
    background-repeat: no-repeat;
    margin-bottom: 0.5rem;

    strong {
      display: block;
    }

    &:hover,
    &:active,
    &:focus {
      border-color: var(--background-active-blue-france-active);
      background-color: var(--background-active-blue-france-active);
    }

    &:focus {
      outline-offset: 2px;
      outline: #0a76f6 2px solid;
    }

    &:focus:not(:focus-visible) {
      outline: 0;
    }
  }
</style>
