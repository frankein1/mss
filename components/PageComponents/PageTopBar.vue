<template>
  <div class="topbar__container">
    <NuxtLink
      class="fr-link topbar__help"
      to="https://mon-suivi-social.gitbook.io/mon-suivi-social/"
      target="_blank"
      rel="noopener external"
      titre="Aide - nouvelle fenêtre"
      >Aide</NuxtLink
    >
    <AtomDropdown
      :label="getUserName()"
      :menus="menus"
      class="topbar__menu"
      dropdown-btn-class="fr-btn--tertiary-no-outline"
    />
    <client-only>
      <DisconnectHandler />
    </client-only>
  </div>
</template>

<script lang="ts" setup>
  import { canEditStructure, canListUsers } from '~/server/security'
  import { RoutePath } from '~/utils/routing'

  const { isAuthenticated, getUserName } = useAuthState()

  const { can } = useSecurityRule()

  const menus = computed(() => {
    const menus = []

    menus.push({
      label: 'Mon compte',
      to: RoutePath.AppAccount(),
      icon: 'fr-icon-user-line'
    })
    if (can(canListUsers)) {
      menus.push({
        label: 'Utilisateurs',
        to: RoutePath.AppUsers(),
        icon: 'fr-icon-team-line'
      })
    }
    if (can(canEditStructure)) {
      menus.push({
        label: 'Structure',
        to: RoutePath.AppStructureEdit(),
        icon: 'fr-icon-home-4-line'
      })
    }
    if (isAuthenticated()) {
      menus.push({
        label: 'Déconnexion',
        to: RoutePath.AuthLogout(),
        icon: 'fr-icon-logout-box-r-line'
      })
    }

    return menus
  })
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
