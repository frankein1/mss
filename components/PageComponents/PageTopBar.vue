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
  import { canEditStructure, canListUsers } from '~/server/security'
  import { useAuthStore } from '~/store/auth'
  import { RoutePath } from '~/utils/routing'
  import { formatUserDisplayName } from '~/utils/user'

  const authStore = useAuthStore()

  const user = computed(() =>
    authStore.isAuthenticated ? authStore.getAuthUser : null
  )
  const userName = computed(() =>
    user.value ? formatUserDisplayName(user.value) : ''
  )

  const menus = computed(() => {
    const menus = []

    menus.push({
      label: 'Mon compte',
      to: RoutePath.AppAccount(),
      icon: 'fr-icon-user-line'
    })
    if (user.value && canListUsers(user.value)) {
      menus.push({
        label: 'Utilisateurs',
        to: RoutePath.AppUsers(),
        icon: 'fr-icon-team-line'
      })
    }

    if (user.value && canEditStructure(user.value)) {
      menus.push({
        label: 'Structure',
        to: RoutePath.AppStructureEdit(),
        icon: 'fr-icon-home-4-line'
      })
    }
    if (user) {
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
