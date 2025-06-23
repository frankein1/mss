<template>
  <NuxtLayout name="landing">
    <div class="fr-container">
      <div
        class="fr-my-7w fr-mt-md-12w fr-mb-md-10w fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-grid-row--center"
      >
        <div class="fr-py-0 fr-col-12 fr-col-md-6">
          <slot></slot>
        </div>
        <div
          class="fr-col-12 fr-col-md-3 fr-col-offset-md-1 fr-px-6w fr-px-md-0 fr-py-0"
        >
          <img
            class="fr-responsive-img"
            src="/pictograms/technical-error.svg"
            alt=""
          />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
  .error__col {
    text-align: center;
  }
</style>
