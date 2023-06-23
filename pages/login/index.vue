<template>
  <main class="fr-container">
    <h1 class="login-title fr-h2 fr-mb-5w">Se connecter à ma structure</h1>

    <div class="inclusion-connect-section">
      <!-- NOTE: It is compulsory to use <a> tag here instead of the <NuxtLink> component to prevent Nuxt to consider the API endpoint as a page route -->
      <a
        class="inclusion-connect-btn"
        title="S'identifier avec InclusionConnect"
        :href="signinUrl"
      >
        <span>
          Se connecter avec
          <strong>InclusionConnect</strong>
        </span>
      </a>

      <NuxtLink
        class="fr-link--sm"
        to="https://plateforme-inclusion.notion.site/Un-compte-unique-pour-mes-services-num-riques-ded9135197654da590f5dde41d8bb68b"
        target="_blank"
        title="Qu'est-ce qu'Inclusion Connect ? - nouvelle fenêtre"
      >
        En savoir plus
      </NuxtLink>
    </div>

    <div class="fr-grid-row fr-grid-row--center fr-mt-6w">
      <div class="fr-col-12 fr-col-lg-6">
        <AtomAlert
          :alert-type="AlertType.Info"
          message="Si vous avez des difficultés pour vous authentifier, <a href='mailto:monsuivisocial@anct.gouv.fr'>contactez-nous</a>."
        />
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
  import { AlertType } from '~/utils/constants/alert'

  const SIGNIN_PATH = '/api/keycloak/signin'

  definePageMeta({
    layout: 'landing'
  })

  const route = useRoute()

  const signinUrl = computed(() => {
    const { redirectUrl } = route.query
    if (!redirectUrl) {
      return SIGNIN_PATH
    }
    const params = new URLSearchParams({ redirectUrl: redirectUrl as string })
    return `${SIGNIN_PATH}?${params}`
  })
</script>

<style lang="scss" scoped>
  @use '~/assets/style/variables' as *;

  .login-title {
    text-align: center;
    color: $primary;
  }

  .inclusion-connect-section {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .inclusion-connect-btn {
    background: none;
    display: inline-flex;
    align-items: center;
    height: 3.625rem;
    text-align: center;
    padding: 0.5rem 1rem 0.5rem 3.875rem;
    border-radius: 50rem;
    user-select: none;
    transition: background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out;
    color: #fff;
    border: 0.25rem solid var(--background-active-blue-france);
    background-color: var(--background-active-blue-france);
    background-image: url('../../assets/img/logo-inclusion-connect-bg.svg');
    background-repeat: no-repeat;
    margin-bottom: 0.5rem;

    strong {
      display: block;
    }

    &:hover,
    &:active,
    &:focus {
      border-color: var(--background-active-blue-france-active);
      background-color: var(--background-active-blue-france-active);
    }

    &:focus {
      outline-offset: 2px;
      outline: #0a76f6 2px solid;
    }

    &:focus:not(:focus-visible) {
      outline: 0;
    }
  }
</style>
