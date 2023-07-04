<template>
  <NuxtLayout name="landing">
    <main class="fr-container fr-my-8w">
      <div class="fr-grid-row fr-my-5w">
        <div class="fr-col fr-col-lg-8 fr-col-offset-lg-2 error__col">
          <slot />
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
