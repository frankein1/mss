<template>
  <div class="fr-col-12 header">
    <div class="header-title">
      <slot name="icon"></slot>
      <slot name="header"></slot>
      <div class="color--primary">
        <slot name="title"></slot>
      </div>
    </div>
    <AtomDropdown
      v-if="menus.length > 0"
      label="Exporter les statistiques"
      icon="fr-icon-download-fill"
      :menus="menus"
      class="stats-dropdown"
      dropdown-btn-class="fr-btn--tertiary-no-outline"
      align-right
    />
  </div>
</template>
<script lang="ts" setup>
  import type { Menu } from '~/types/menu'

  defineProps<{
    menus: Menu[]
  }>()
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .header-title {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .color--primary {
      color: var(--primary);
    }

    .stats-dropdown {
      margin-left: 0;
    }
  }

  @include dsfr-media-query.respond-from('lg') {
    .header {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .stats-dropdown {
      margin-left: auto;
    }
  }
</style>
