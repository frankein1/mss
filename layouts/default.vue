<template>
  <div class="fr-container--fluid">
    <div class="fr-grid-row">
      <div class="fr-col-12 fr-col-md-2">
        <TheSidenav />
      </div>
      <div class="fr-col-12 fr-col-md-10 main-column">
        <PageTopBar />
        <slot />
      </div>
    </div>
    <AtomSnackbar />
    <AtomModal />
  </div>
</template>

<style lang="scss" scoped>
  @use '~/assets/style/variables' as *;

  .main-column {
    background-color: var(--background-alt-grey);
    min-height: 100%;
  }
</style>
