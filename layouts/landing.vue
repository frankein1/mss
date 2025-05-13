<template>
  <div
    class="page-container"
    :class="route.name ? [route.name + '-style'] : []"
  >
    <DsfrSkipLinks
      :links="[
        { id: 'main-content', text: 'Contenu' },
        { id: 'header', text: `Entête` },
        { id: 'footer', text: `Pied de page` }
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
