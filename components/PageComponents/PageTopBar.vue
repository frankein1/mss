<template>
  <div class="topbar__container">
    <NuxtLink
      class="fr-link topbar__help"
      to="https://mon-suivi-social.gitbook.io/mon-suivi-social/"
      target="_blank"
    >
      Aide
    </NuxtLink>
    <AtomDropdown
      :label="userName"
      :menus="menus"
      class="topbar__menu"
      dropdown-btn-class="fr-btn--tertiary-no-outline"
    />
  </div>
</template>

<script lang="ts" setup>
  import { canEditStructure, canCreateUser } from '~/server/security/rules'
  import { useAuthStore } from '~/store/auth'
  import { Menu } from '~/types/menu'
  import { Routes } from '~/utils/routing/routes'

  const authStore = useAuthStore()
  const userName = authStore.userName
  const user = authStore.getAuthUser
  const structureId = user?.structureId

  const menus: Menu[] = []

  if (user && structureId) {
    menus.push({
      label: 'Mon compte',
      to: Routes.Account(),
      icon: 'fr-icon-user-line'
    })
    if (canCreateUser(user, { structureId })) {
      menus.push({
        label: 'Utilisateurs',
        to: Routes.Users(),
        icon: 'fr-icon-team-line'
      })
    }

    if (canEditStructure(user, { structureId })) {
      menus.push({
        label: 'Structure',
        to: Routes.StructureEdit(),
        icon: 'fr-icon-home-4-line'
      })
    }

    menus.push({
      label: 'Déconnexion',
      href: Routes.Logout(),
      icon: 'fr-icon-logout-box-r-line'
    })
  }
</script>

<style lang="scss" scoped>
  .topbar__container {
    background-color: #fff;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .topbar__help {
    margin-right: 2em;
  }

  .topbar__menu {
    padding-right: 4em;
  }
</style>
