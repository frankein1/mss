<template>
  <AtomDropdown
    label="Jeanne TESTEUSE"
    :menus="menus"
    class="topbar__menu"
    dropdown-btn-class="fr-btn--tertiary-no-outline"
  />
</template>
<script lang="ts" setup>
  import type { MenuItem } from '~~/types/menu'

  const menus = computed(() => {
    const menus: MenuItem[] = [
      {
        label: 'Configuration',
        to: '/',
        icon: 'fr-icon-settings-4-line'
      },
      {
        label: 'Déconnexion',
        href: '/',
        icon: 'fr-icon-logout-box-r-line'
      }
    ]

    return menus
  })
</script>
