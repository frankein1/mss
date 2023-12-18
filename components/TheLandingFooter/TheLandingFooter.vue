<template>
  <footer
    id="footer"
    class="fr-footer"
    role="contentinfo"
  >
    <div class="fr-container">
      <div class="fr-footer__body fr-footer__body--operator">
        <div class="fr-footer__brand fr-enlarge-link">
          <NuxtLink
            class="fr-footer__brand-link"
            to="https://agence-cohesion-territoires.gouv.fr/"
            title="Site Web de l'Agence Nationale de la Cohésion des Territoires"
            target="_blank"
          >
            <img
              class="fr-footer__logo"
              src="~/assets/img/logo-anct.svg"
              alt="Logo de l'Agence Nationale de la Cohésion des Territoires"
            />
          </NuxtLink>
        </div>
        <div class="fr-footer__content">
          <ul class="fr-footer__content-list">
            <li class="fr-footer__content-item">
              <NuxtLink
                class="fr-footer__content-link"
                to="https://legifrance.gouv.fr"
                target="_blank"
              >
                legifrance.gouv.fr
              </NuxtLink>
            </li>
            <li class="fr-footer__content-item">
              <NuxtLink
                class="fr-footer__content-link"
                to="https://gouvernement.fr"
                target="_blank"
              >
                gouvernement.fr
              </NuxtLink>
            </li>
            <li class="fr-footer__content-item">
              <NuxtLink
                class="fr-footer__content-link"
                to="https://service-public.fr"
                target="_blank"
              >
                service-public.fr
              </NuxtLink>
            </li>
            <li class="fr-footer__content-item">
              <NuxtLink
                class="fr-footer__content-link"
                to="https://data.gouv.fr"
                target="_blank"
              >
                data.gouv.fr
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
      <div class="fr-footer__bottom">
        <ul class="fr-footer__bottom-list">
          <li class="fr-footer__bottom-item">
            <NuxtLink
              class="fr-footer__bottom-link"
              to="https://stock.adobe.com/fr/"
              target="_blank"
            >
              Crédits photos : Adobe Stock
            </NuxtLink>
          </li>
          <li class="fr-footer__bottom-item">
            <NuxtLink
              class="fr-footer__bottom-link"
              :to="RoutePath.DeclarationAccessibilite()"
              target="_self"
            >
              Accessibilité: non conforme
            </NuxtLink>
          </li>
          <li class="fr-footer__bottom-item">
            <NuxtLink
              class="fr-footer__bottom-link"
              :to="RoutePath.MentionsLegales()"
              target="_self"
              >Mentions légales</NuxtLink
            >
          </li>
          <li class="fr-footer__bottom-item">
            <NuxtLink
              class="fr-footer__bottom-link"
              :to="sourceCode"
              target="_blank"
            >
              Version {{ clientVersion }}
            </NuxtLink>
          </li>
          <!-- TODO: Set compulsory footer links -->
          <!-- <li class="fr-footer__bottom-item">
                    <NuxtLink class="fr-footer__bottom-link" to="#">Données personnelles</NuxtLink>
                </li>
                <li class="fr-footer__bottom-item">
                    <NuxtLink class="fr-footer__bottom-link" to="#">Gestion des cookies</NuxtLink>
                </li> -->
        </ul>
        <div class="fr-footer__bottom-copy">
          <p>
            Sauf mention explicite de propriété intellectuelle détenue par des
            tiers, les contenus de ce site sont proposés sous
            <NuxtLink
              to="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
              target="_blank"
            >
              licence etalab-2.0
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
  import { RoutePath } from '~/utils/routing'
  const {
    public: { clientVersion }
  } = useRuntimeConfig()

  const sourceCode = computed(
    () =>
      `https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/tree/v${clientVersion}?ref_type=tags`
  )
</script>

<style scoped>
  .fr-footer {
    background-color: #fff;
    box-shadow: none;
  }

  .fr-footer__logo {
    max-width: 200px;
  }

  .fr-footer__brand-link[target='_blank']::after {
    content: none;
  }
</style>
