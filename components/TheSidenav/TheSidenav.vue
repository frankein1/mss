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
        <div class="fr-sidemenu__title fr-py-1w fr-px-2w">
          <NuxtLink
            :to="homePage"
            title="Tableau de bord - Mon Suivi Social"
          >
            <img
              id="sidemenu-title"
              src="~/assets/img/logo-white.svg"
              class="fr-responsive-img"
              alt="Mon Suivi Social"
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
                  class="fr-mr-1w"
                  :class="[menuItem.icon]"
                  aria-hidden="true"
                ></span>
                {{ menuItem.label }}
              </a>
            </li>
          </NuxtLink>
          <li
            v-if="!authState.isAdmin()"
            class="fr-mt-3w fr-mr-1w"
          >
            <NuxtLink
              class="fr-btn btn-primary-on-primary fr-icon-user-add-line fr-btn--icon-left"
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
              :to="
                authState.isStructureManager()
                  ? RoutePath.CGUManager({ readonly: true })
                  : RoutePath.CGUUser({ readonly: true })
              "
            >
              CGU
            </NuxtLink>
          </li>
          <li class="fr-footer__bottom-item">
            <NuxtLink
              class="fr-footer__bottom-link"
              :to="RoutePath.PolitiqueConfidentialite()"
            >
              Politique de confidentialité
            </NuxtLink>
          </li>
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
  import { RoutePath } from '~/utils/routing'

  const homePage = useHomePage()
  const authState = useAuthState()

  const { version, sourceCode } = useClientVersion()
  const { application } = usePermissions()

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
      items.push({
        to: RoutePath.AdminIntegrations(),
        label: 'Integrations',
        icon: 'fr-icon-discuss-line'
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
        icon: 'fr-icon-folder-2-line'
      })
      if (application.value.module.stats) {
        items.push({
          to: RoutePath.AppStats(),
          label: 'Statistiques',
          icon: 'fr-icon-line-chart-line'
        })
      }
    }

    return items
  })
</script>

<style lang="scss" scoped>
  @use '~/assets/style/variables' as *;

  .fr-sidemenu {
    background-color: $primary;
  }

  .fr-sidemenu__inner {
    box-shadow: none;
  }

  .fr-sidemenu__list {
    margin-left: 0.5rem;
  }

  .fr-sidemenu__link {
    color: #fff;
    font-weight: $font-weight-normal;
    word-break: break-word;
    padding: 0.75rem;
  }

  @media (hover: hover) and (pointer: fine) {
    .fr-sidemenu__link[href]:hover {
      background-color: inherit;
      font-weight: $font-weight-bold;
    }

    .fr-sidemenu__link[href]:active {
      font-weight: $font-weight-bold;
    }
  }

  .fr-sidemenu__link[aria-current] {
    color: #fff;
    font-weight: $font-weight-bold;
  }

  .fr-sidemenu__link[aria-current]::before {
    background-color: #fff;
    top: 0;
    bottom: 0;
    margin: 0.75rem 0;
  }

  .fr-sidemenu__link::before {
    margin-right: 0.5rem;
  }

  .fr-responsive-img {
    max-height: 3.5rem;
  }

  .fr-footer__bottom-link {
    --underline-img: linear-gradient(0deg, currentcolor, currentcolor);

    color: #fff;
  }

  .fr-footer__bottom-list {
    text-align: center;
    margin-top: auto;
    margin-bottom: 1rem;
  }

  .fr-footer__bottom-item {
    display: inherit;
    margin: 0.5rem 0 0;
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
