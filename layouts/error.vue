<template>
  <NuxtLayout name="landing">
    <main
      id="content"
      role="main"
    >
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="fr-responsive-img fr-artwork"
              aria-hidden="true"
              width="160"
              height="200"
              viewBox="0 0 160 200"
            >
              <use
                class="fr-artwork-motif"
                href="~/assets/img/ovoid.svg#artwork-motif"
              ></use>
              <use
                class="fr-artwork-background"
                href="~/assets/img/ovoid.svg#artwork-background"
              ></use>
              <g transform="translate(40, 60)">
                <use
                  class="fr-artwork-decorative"
                  href="/pictograms/technical-error.svg#artwork-decorative"
                ></use>
                <use
                  class="fr-artwork-minor"
                  href="/pictograms/technical-error.svg#artwork-minor"
                ></use>
                <use
                  class="fr-artwork-major"
                  href="/pictograms/technical-error.svg#artwork-major"
                ></use>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </main>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
  .error__col {
    text-align: center;
  }
</style>
