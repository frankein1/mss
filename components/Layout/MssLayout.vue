<template>
  <slot name="skipLinks"></slot>
  <div class="layout">
    <div>
      <TheSidenav />
    </div>
    <div class="main-column">
      <PageTopBar />
      <main
        id="main-content"
        role="main"
        tabindex="-1"
      >
        <slot></slot>
      </main>
    </div>
  </div>
  <AtomSnackbar />
  <AtomModal />
  <OpenModalHack />
</template>

<style lang="scss" scoped>
  @use '~/assets/style/variables' as *;
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .main-column {
    background-color: var(--background-alt-grey);
    min-height: 100%;
  }

  .layout {
    display: flex;
    flex-flow: row wrap;
    width: 100%;
    margin: 0;
    padding: 0;

    > :first-child {
      min-width: 100%;
      width: 100%;
      flex: 0 0 100%;
    }

    > :nth-child(2) {
      width: 100%;
      flex: 0 0 100%;
    }

    @include dsfr-media-query.respond-from('md') {
      flex-flow: row nowrap;

      > :first-child {
        width: #{$navbar-width-md};
        min-width: #{$navbar-width-md};
        flex: 0;
      }

      > :nth-child(2) {
        $calc-w-md: calc(100% - #{$navbar-width-md});

        width: #{$calc-w-md};
        min-width: #{$calc-w-md};
        flex: 0;
      }
    }

    @include dsfr-media-query.respond-from('xl') {
      flex-flow: row nowrap;

      > :first-child {
        width: #{$navbar-width-wide};
        min-width: #{$navbar-width-wide};
        flex: 0;
      }

      > :nth-child(2) {
        $calc-w-lg: calc(100% - #{$navbar-width-wide});

        width: #{$calc-w-lg};
        min-width: #{$calc-w-lg};
        flex: 0;
      }
    }
  }
</style>
