<template>
  <NuxtLink :href="RoutePath.AppPartners()">
    <div class="partner-box">
      <AtomPictogram path="/pictograms/notification.svg" />
      <div class="partner-box__title fr-h6">Partenaires</div>
    </div>
  </NuxtLink>
</template>

<script lang="ts" setup>
  import { RoutePath } from '~/utils/routing'
</script>

<style lang="scss" scoped>
  .partner-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem;
    gap: 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid var(--border-default-grey);
    background-color: white;
  }

  .partner-box__title {
    color: var(--primary);
    margin-bottom: 0;
    text-decoration: underline;
  }
</style>
