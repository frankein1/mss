<template>
  <header
    role="banner"
    class="fr-header"
  >
    <div class="fr-header__body">
      <div class="fr-container">
        <div class="fr-header__body-row">
          <div class="fr-header__brand fr-enlarge-link">
            <div class="fr-header__brand-top">
              <div class="fr-header__logo">
                <NuxtLink
                  :to="routes.landing.Index.path()"
                  title="Accueil - Mon Suivi Social"
                >
                  <p class="fr-logo">
                    République
                    <br />Française
                  </p>
                </NuxtLink>
              </div>
              <div class="fr-header__operator">
                <img
                  src="~/assets/img/logo.svg"
                  class="fr-responsive-img"
                  alt="Mon Suivi Social"
                />
              </div>
              <div class="fr-header__navbar">
                <button
                  id="fr-btn-menu-mobile"
                  class="fr-btn--menu fr-btn"
                  data-fr-opened="false"
                  aria-controls="modal-menu-mobile"
                  aria-haspopup="menu"
                  title="Menu"
                >
                  Menu
                </button>
              </div>
            </div>
            <div class="fr-header__service">
              <p class="fr-header__service-title">
                <span class="fr-badge fr-badge--sm fr-badge--green-emeraude">
                  BETA
                </span>
              </p>
            </div>
          </div>
          <div class="fr-header__tools">
            <div class="fr-header__tools-links">
              <ul class="fr-btns-group">
                <li>
                  <NuxtLink
                    class="fr-btn register-btn fr-icon-add-line"
                    :to="routes.landing.Register.path()"
                  >
                    Créer un espace
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink
                    class="fr-btn fr-btn--tertiary fr-icon-lock-line"
                    :to="routes.auth.AuthLogin.path()"
                  >
                    Se connecter à son espace
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      id="modal-menu-mobile"
      class="fr-header__menu fr-modal"
      aria-labelledby="fr-btn-menu-mobile"
    >
      <div class="fr-container">
        <button
          class="fr-btn--close fr-btn"
          aria-controls="modal-menu-mobile"
        >
          Fermer
        </button>
        <div class="fr-header__menu-links"></div>
      </div>
    </div>
  </header>
</template>

<script setup>
  import { routes } from '~/utils/routes'
</script>

<style lang="scss" scoped>
  @use '~/assets/style/variables' as *;
  @use '@gouvfr/dsfr/module/media-query' as dsfr-media-query;

  .fr-header {
    background-color: transparent;
    filter: none;
  }

  .fr-header__operator .fr-responsive-img {
    width: 10rem;

    @include dsfr-media-query.respond-from('sm') {
      width: 14rem;
    }
  }

  .fr-header__tools-links .fr-btn.register-btn {
    --hover-tint: var(--primary-hover);
    --active-tint: var(--primary-active);

    color: var(--text-inverted-grey);
    box-shadow: inset 0 0 0 1px var(--text-inverted-grey);

    &:not(:hover) {
      background-color: var(--primary);
    }
  }

  .fr-btn--tertiary {
    background-color: var(--background-default-grey);
  }
</style>
