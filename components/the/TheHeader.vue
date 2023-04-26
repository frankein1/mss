<template>
  <div class="fr-grid-row fr-grid-row--gutters">
    <div
      class="fr-col-12 header-col"
      :class="{ 'with-backlink': backLink }"
    >
      <NuxtLink
        v-if="backLink"
        :to="backLink"
        class="fr-link fr-icon-arrow-left-line fr-link--icon-left backlink"
        target="_self"
      >
        Retour
      </NuxtLink>
      <div ckass="title">
        <h1 class="fr-h3 fr-mb-0">
          {{ title }}
          <slot name="title-extension"></slot>
        </h1>
        <slot name="subtitle"></slot>
      </div>
      <NuxtLink
        class="fr-link help-link"
        to="https://mon-suivi-social.gitbook.io/mon-suivi-social/"
        target="_blank"
      >
        Aide
      </NuxtLink>
      <TheUserMenu class="user-menu" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  withDefaults(
    defineProps<{
      title: string
      backLink?: string
    }>(),
    { backLink: '' }
  )
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/module/media-query' as dsfr-media-query;

  .header-col {
    display: grid;
    grid-template-areas: 'help' 'user-menu' 'title';
    row-gap: 0.5rem;
    column-gap: 0.5rem;

    &.with-backlink {
      grid-template-areas: 'backlink help' 'user-menu user-menu' 'title title';
    }

    @include dsfr-media-query.respond-from('lg') {
      grid-template-areas: 'title help user-menu';
      row-gap: 0.75rem;
      column-gap: 0.75rem;
      grid-template-columns: auto max-content max-content;

      &.with-backlink {
        grid-template-areas: 'backlink backlink backlink' 'title help user-menu';
      }
    }
  }

  .backlink {
    grid-area: backlink;
    width: fit-content;
  }

  .title {
    grid-area: title;
  }

  .help-link {
    grid-area: help;
    width: fit-content;
    height: fit-content;
    justify-self: end;

    @include dsfr-media-query.respond-from('lg') {
      margin-top: 0.5rem; // Align with dropdown button
    }
  }

  .user-menu {
    grid-area: user-menu;
  }
</style>
