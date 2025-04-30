<template>
  <div
    class="page-container"
    :class="route.name ? [route.name + '-style'] : []"
  >
    <DsfrSkipLinks
      class="fr-sr-only"
      :links="[
        { id: 'main-content', text: 'Aller au contenu principal' },
        { id: 'header', text: `Aller à l'entête` },
        { id: 'footer', text: `Aller au pied de page` }
      ]"
    />
    <TheLandingHeader />
    <main id="main-content">
      <slot />
    </main>
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
    background-image: url('~/assets/img/home-oval.svg');
  }

  .register-style {
    background-image: url('~/assets/img/register-oval.svg');
  }

  .page-container {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    background-repeat: no-repeat;
    background-position: top right;
    background-size: 50%, 100%;
  }
</style>
