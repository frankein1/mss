<template>
  <AtomDropdown
    :label="authStore.userName"
    :menus="MENUS"
    dropdown-btn-class="fr-btn--tertiary-no-outline"
    align-right
  />
</template>

<script lang="ts" setup>
  // import { usePermissionsStore } from '~/store/permissions'
  import { useAuthStore } from '~/store/auth'
  import { Routes } from '~/utils/routing/routes'
  import type { Menu } from '~/types/menu'

  // const permissionsStore = usePermissionsStore()
  const authStore = useAuthStore()

  const MENUS: Menu[] = [
    { label: 'Mon compte', to: Routes.Account, icon: 'fr-icon-user-line' }
  ]

  // if (permissionsStore.canAddUsers) {
  MENUS.push({
    label: 'Utilisateurs',
    to: Routes.Users,
    icon: 'fr-icon-team-line'
  })
  // }

  // if (permissionsStore.canEditOrganisation) {
  // MENUS.push({
  //   label: 'Structure',
  //   to: Routes.OrganisationEdit,
  //   icon: 'fr-icon-home-4-line'
  // })
  // }

  MENUS.push({
    label: 'Déconnexion',
    to: Routes.Logout,
    icon: 'fr-icon-logout-box-r-line'
  })
</script>
