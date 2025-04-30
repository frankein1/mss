<template>
  <div class="fr-container--fluid">
    <DsfrSkipLinks
      class="fr-sr-only"
      :links="[
        { id: 'main-content', text: 'Aller au contenu principal' },
        { id: 'navigation', text: 'Aller au menu' },
        { id: 'topbar', text: 'Aller à la barre utilisateur' }
      ]"
    />
    <div class="fr-grid-row">
      <div class="fr-col-12 fr-col-md-2">
        <TheSidenav />
      </div>
      <div class="fr-col-12 fr-col-md-10 main-column">
        <PageTopBar />
        <main id="main-content">
          <slot></slot>
        </main>
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
