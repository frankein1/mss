<template>
  <!-- Title + Export buttons -->
  <div class="fr-col-12 header">
    <div class="header-title">
      <slot name="icon"></slot>
      <h3 class="stats-main-title fr-mb-0 fr-ml-1w">
        <slot name="title"></slot>
      </h3>
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
  import { Menu } from '~/types/menu'

  defineProps<{
    menus: Menu[]
  }>()
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/module/media-query' as dsfr-media-query;

  .header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .header-title {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    h3 {
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
