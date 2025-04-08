<template>
  <div class="topbar__container">
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
  import { routes } from '~/utils/routes'

  const { isAuthenticated, getUserName } = useAuthState()

  const { application } = usePermissions()

  const menus = computed(() => {
    const menus = []

    if (application.value.module.users) {
      menus.push({
        label: 'Utilisateurs',
        to: routes.structure.AppUsers.path(),
        icon: 'fr-icon-team-line'
      })
    }
    menus.push({
      label: 'Structure',
      to: routes.structure.AppStructure.path(),
      icon: 'fr-icon-home-4-line'
    })
    if (isAuthenticated()) {
      menus.push({
        label: 'Déconnexion',
        to: routes.auth.AuthLogout.path(),
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

  .topbar__menu {
    padding-right: 4em;
  }
</style>
