<template>
  <NuxtLink
    :href="routes.structure.AppPartners.path()"
    class="partner-box__link"
  >
    <div class="feature-section partner-box">
      <AtomPictogram path="/pictograms/annuaire.svg" />
      <div class="partner-box__title fr-h6">Partenaires</div>
    </div>
  </NuxtLink>
</template>

<script lang="ts" setup>
  import { routes } from '~/routes'
</script>

<style lang="scss" scoped>
  .partner-box__link {
    --text-decoration: none;
    --underline-img: none;

    display: block;
  }

  .partner-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .partner-box__title {
    color: var(--primary);
    margin-bottom: 0;
    text-decoration: underline;
  }
</style>
