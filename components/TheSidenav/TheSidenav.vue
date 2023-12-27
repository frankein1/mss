<template>
  <nav
    class="fr-sidemenu fr-sidemenu--sticky-full-height fr-p-0"
    role="navigation"
    aria-labelledby="sidemenu-title"
  >
    <div class="fr-sidemenu__inner fr-p-0">
      <button
        class="fr-sidemenu__btn"
        hidden
        aria-controls="fr-sidemenu-wrapper"
        aria-expanded="false"
      >
        Menu
      </button>
      <div
        id="fr-sidemenu-wrapper"
        class="fr-collapse"
      >
        <div class="fr-sidemenu__title">
          <NuxtLink
            :to="homePage"
            title="Retour au tableau de bord"
          >
            <img
              id="sidemenu-title"
              src="~/assets/img/logo-white.svg"
              class="fr-responsive-img fr-px-1w fr-pt-md-7w fr-px-md-3w"
              alt="Mon Suivi Social"
              title="Mon Suivi Social"
            />
          </NuxtLink>
        </div>
        <ul class="fr-sidemenu__list">
          <NuxtLink
            v-for="menuItem in menuItems"
            v-slot="{ href, navigate, isActive }"
            :key="menuItem.to"
            custom
            :to="menuItem.to"
          >
            <li
              class="fr-sidemenu__item"
              :class="{ 'fr-sidemenu__item--active': isActive }"
            >
              <a
                :href="href"
                class="fr-sidemenu__link"
                :aria-current="isActive ? 'page' : undefined"
                @click="navigate"
              >
                <span
                  class="fr-mr-1v"
                  :class="[menuItem.icon]"
                  aria-hidden="true"
                ></span>
                {{ menuItem.label }}
              </a>
            </li>
          </NuxtLink>
          <li v-if="!authState.isAdmin()">
            <NuxtLink
              class="fr-btn btn-primary-on-primary fr-mt-3w fr-mx-1w fr-icon-user-add-line fr-btn--icon-left"
              :to="RoutePath.AppBeneficiariesAdd()"
            >
              Créer un·e bénéficiaire
            </NuxtLink>
          </li>
        </ul>
        <ul class="fr-footer__bottom-list">
          <li class="fr-footer__bottom-item">
            <NuxtLink
              class="fr-footer__bottom-link"
              :to="RoutePath.DeclarationAccessibilite()"
            >
              Accessibilité: non conforme
            </NuxtLink>
          </li>
          <li
            v-if="version"
            class="fr-footer__bottom-item"
          >
            <NuxtLink
              class="fr-footer__bottom-link"
              :to="sourceCode"
              target="_blank"
              rel="noopener external"
              title="Code source de la version - nouvelle fenêtre"
            >
              Version {{ version }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
  import { canViewStats } from '~/server/security'
  import { RoutePath } from '~/utils/routing'

  const homePage = useHomePage()
  const authState = useAuthState()

  const { version, sourceCode } = useClientVersion()

  const menuItems = computed(() => {
    const items = []
    if (authState.isAdmin()) {
      items.push({
        to: RoutePath.AdminOverview(),
        label: 'Tableau de bord',
        icon: 'fr-icon-home-4-line'
      })
      items.push({
        to: RoutePath.AdminStructures(),
        label: 'Structures',
        icon: 'fr-icon-home-4-line'
      })
      items.push({
        to: RoutePath.AdminUsers(),
        label: 'Utilisateurs',
        icon: 'fr-icon-user-line'
      })
      items.push({
        to: RoutePath.AdminEmails(),
        label: 'Emails',
        icon: 'fr-icon-mail-line'
      })
    } else {
      items.push({
        to: RoutePath.AppOverview(),
        label: 'Tableau de bord',
        icon: 'fr-icon-home-4-line'
      })
      items.push({
        to: RoutePath.AppBeneficiaries(),
        label: 'Bénéficiaires',
        icon: 'fr-icon-user-line'
      })
      items.push({
        to: RoutePath.AppHistory(),
        label: 'Accompagnements',
        icon: 'fr-icon-inbox-archive-line'
      })
      if (useSecurityRule().can(canViewStats)) {
        items.push({
          to: RoutePath.AppStats(),
          label: 'Statistiques',
          icon: 'fr-icon-pie-chart-2-line'
        })
      }
    }

    return items
  })
</script>

<style lang="scss" scoped>
  @use '~/assets/style/variables' as *;

  $link-highlight-color: #7a7edf;

  .fr-sidemenu {
    background-color: $primary;
  }

  .fr-sidemenu__inner {
    box-shadow: none;
  }

  .fr-sidemenu__link {
    color: #fff;
  }

  @media (hover: hover) and (pointer: fine) {
    .fr-sidemenu__link[href]:hover {
      background-color: $link-highlight-color;
    }

    .fr-sidemenu__link[href]:active {
      background-color: #7a7ddfd1;
    }
  }

  .fr-sidemenu__link[aria-current] {
    background-color: $link-highlight-color;
  }

  .fr-sidemenu__link[aria-current]::before {
    background-color: #fff;
    opacity: 0.4;
    top: 0;
    bottom: 0;
  }

  .fr-sidemenu__link::before {
    margin-right: 8px;
  }

  .fr-responsive-img {
    max-width: 250px;
  }

  .fr-footer__bottom-link {
    --underline-img: linear-gradient(0deg, currentcolor, currentcolor);

    color: #fff;
  }

  .fr-footer__bottom-list {
    text-align: center;
    margin-top: auto;
  }

  .fr-footer__bottom-item {
    display: inline-block;
  }

  .fr-footer__bottom-item::before {
    display: none;
  }

  .fr-collapse {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>
