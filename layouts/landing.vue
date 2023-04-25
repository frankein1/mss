<template>
  <div
    class="page-container"
    :class="route.name + '-style'"
  >
    <TheLandingHeader />
    <slot class="landing-main-container fr-my-8w" />
    <TheLandingFooter />
    <AtomSnackbar />
  </div>
</template>

<script setup>
  const route = useRoute()
</script>

<style scoped lang="scss">
  @use '~/assets/style/variables' as *;

  .index-style {
    --home-oval: url('~/assets/img/home-oval.svg');

    background-image: var(--home-oval);
    background-image: var(--home-oval), $home-gradient;
  }

  .register-style {
    --register-oval: url('~/assets/img/register-oval.svg');

    background-image: var(--register-oval);
    background-image: var(--register-oval), $home-gradient;
  }

  .page-container {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    background-repeat: no-repeat;
    background-position: top right;
    background-size: 50%, 100%;
  }

  .landing-main-container {
    flex: 1 1 auto;
  }
</style>
