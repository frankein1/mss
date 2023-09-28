<template>
  <div class="fr-container--fluid">
    <div class="fr-grid-row">
      <div class="fr-col-12">
        <PageTopBar />
        <slot></slot>
      </div>
    </div>
    <AtomSnackbar />
    <AtomModal />
  </div>
</template>

<style lang="scss" scoped>
  .main-column {
    background-color: var(--background-alt-grey);
    min-height: 100%;
  }
</style>
