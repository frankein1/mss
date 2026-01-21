<template>
  <NuxtLayout name="error">
    <h1>{{ pageTitle }}</h1>
    <p class="fr-text--sm fr-mb-3w">Erreur {{ error.statusCode }}</p>
    <p class="fr-text--lead fr-mb-3w">
      {{ intro }}
    </p>
    <p class="fr-text--sm fr-mb-5w">
      <template
        v-for="(line, index) in solutions"
        :key="line"
      >
        <template v-if="typeof line === 'object'">
          <NuxtLink
            v-if="line.type === 'url'"
            :to="line.content"
            external
            target="_blank"
            >{{ line.content }}</NuxtLink
          >
        </template>
        <template v-else>{{ line }}</template>
        <br v-if="index < solutions.length - 1" />
      </template>
    </p>
    <ul class="fr-btns-group fr-btns-group--inline-md">
      <li v-if="hasHomeLink">
        <NuxtLink
          class="fr-btn"
          :to="landingPageUrl"
          external
        >
          Retourner à l'accueil
        </NuxtLink>
      </li>
      <li v-if="hasSignoutLink">
        <NuxtLink
          class="fr-btn"
          :to="apiRoutes.proConnect.ApiLogoutProconnectOnly.path()"
          external
          >Réessayer une connexion</NuxtLink
        >
      </li>
      <li v-if="hasOverviewLink">
        <NuxtLink
          class="fr-btn"
          :to="routes.user.AppOverview.path()"
          external
          >Retourner au tableau de bord</NuxtLink
        >
      </li>
    </ul>
  </NuxtLayout>
</template>

<script setup lang="ts">
  import { apiRoutes, routes } from '~/utils/routes'
  import { APP_NAME } from '~/utils/constants'

  const {
    public: { mssEnvironment, landingPageUrl }
  } = useRuntimeConfig()

  const props = defineProps<{
    error: {
      url: string
      statusCode: number
      statusMessage: string
      message: string
      description: string
      data: any
    }
  }>()

  const isRdvspAuthError = computed(() =>
    props.error.message.match(/rdvsp-auth-callback/i)
  )

  const pageTitle = computed(() => {
    switch (props.error.statusCode) {
      case 404:
        return 'Page non trouvée'
      case 503:
        return 'Service indisponible'
      case 401:
        return manage401Error().pageTitle
      case 403:
        return manage403Error().pageTitle
      default:
        return 'Erreur inattendue'
    }
  })

  useHead({
    title: `Erreur ${props.error.statusCode} — ${pageTitle.value} — ${APP_NAME}`
  })

  const intro = computed(() => {
    switch (props.error.statusCode) {
      case 404:
        return 'La page que vous cherchez est introuvable. Veuillez nous excuser pour la gêne occasionnée.'
      case 401:
        return manage401Error().intro
      case 403:
        return manage403Error().intro
      default:
        return 'Désolé, le service rencontre un problème, nous travaillons pour le résoudre le plus rapidement possible.'
    }
  })

  const solutions = computed(() => {
    switch (props.error.statusCode) {
      case 404:
        return [
          "Si vous avez tapé l'adresse web dans le navigateur, vérifiez qu'elle est correcte. La page n'est peut-être plus disponible.",
          "Dans ce cas, pour continuer votre visite, vous pouvez consulter notre page d'accueil."
        ]
      case 503:
        return [
          "Merci de réessayer plus tard, vous serez en mesure de réutiliser le service très rapidement. Si vous avez besoin d'une aide immédiate, merci de nous contacter directement."
        ]
      case 401:
        return manage401Error().solutions
      case 403:
        return manage403Error().solutions
      default:
        return [
          "Essayez de rafraichir la page, sinon merci de réessayer plus tard. Si vous avez besoin d'une aide immédiate, merci de nous contacter directement."
        ]
    }
  })

  const hasHomeLink = computed(() => props.error.statusCode === 404)
  const hasSignoutLink = computed(
    () =>
      !isRdvspAuthError.value &&
      (props.error.statusCode === 403 || props.error.statusCode === 401)
  )
  const hasOverviewLink = computed(() => isRdvspAuthError.value)

  function manage401Error() {
    if (isRdvspAuthError.value) {
      return {
        pageTitle:
          "Échec d'authentification de l'intégration Rendez-Vous Service Public",
        intro:
          "Vos informations d'authentification sont invalides ou expirées.",
        solutions: [
          'Veuillez vous authentifier à nouveau.',
          "En cas d'échec répété, contactez-nous pour que nous puissions solutionner vos problèmes d'accès."
        ]
      }
    }
    if (props.error.message.match(/logout failure/i)) {
      return {
        pageTitle: 'Échec de déconnexion',
        intro:
          "Vos informations d'authentification sont expirées ou incorrectes.",
        solutions: [
          "En cas d'échec répété, contactez-nous pour que nous puissions solutionner vos problèmes d'accès."
        ]
      }
    }
    return {
      pageTitle: "L'authentification a échoué",
      intro: "Vos informations d'authentification sont invalides ou expirées.",
      solutions: [
        'Veuillez vous authentifier à nouveau.',
        "En cas d'échec répété, contactez-nous pour que nous puissions solutionner vos problèmes d'accès."
      ]
    }
  }

  function manage403Error() {
    if (isRdvspAuthError.value) {
      return {
        pageTitle: "Accès à l'intégration MSS - RDV SP impossible",
        intro:
          "Vous n'avez pas les droits suffisants pour utiliser l'intégration.",
        solutions: [
          "Si vous êtes le ou la responsable de votre structure, contactez-nous pour que nous puissions solutionner vos problèmes d'accès.",
          'Sinon, veuillez vous rapprocher de votre responsable de structure pour mettre en place votre accès.'
        ]
      }
    }
    if (props.error.message.match(/unknown user/i)) {
      return {
        pageTitle: 'Utilisateur inconnu',
        intro:
          "Aucun compte Mon Suivi Social n'est rattaché à votre compte ProConnect.",
        solutions: [
          'Vous avez accédé à Mon Suivi Social avec ProConnect mais votre compte ProConnect est inconnu de nos services.',
          "Si votre structure a un espace Mon Suivi Social, veuillez vous rapprocher de votre responsable de structure pour qu'un compte Mon Suivi Social rattaché à votre compte ProConnect vous soit créé.",
          'Si votre structure n\'a pas d\'espace Mon Suivi Social, vous trouverez toutes les informations nécessaires pour créer un espace sur notre service sur la page "Créer un espace".',
          "Sinon, contactez-nous pour que nous puissions solutionner vos problèmes d'accès."
        ]
      }
    }

    if (
      props.error.message.match(/deactivated user/i) ||
      props.error.message.match(/deactivated structure/i)
    ) {
      return {
        pageTitle: 'Accès interdit',
        intro: 'Votre accès à Mon Suivi Social a été désactivé.',
        solutions: [
          "Si vous êtes le ou la responsable de votre structure, contactez-nous pour que nous puissions solutionner vos problèmes d'accès.",
          'Sinon, veuillez vous rapprocher de votre responsable de structure pour rétablir votre accès.'
        ]
      }
    }

    if (props.error.message.match(/mfa necessary/i)) {
      const devInstructions = [
        "En démo et développement, l'instance de Proconnect Identité est :",
        {
          type: 'url',
          content: 'https://identite-sandbox.proconnect.gouv.fr/'
        }
      ]
      return {
        pageTitle: 'Accès interdit',
        intro:
          "L'authentification double facteur est nécessaire pour accéder à l'application.",
        solutions: [
          "Configurez votre second facteur à l'aide des instructions suivantes :",
          {
            type: 'url',
            content:
              'https://proconnect.crisp.help/fr/article/quest-ce-que-la-double-authentification-1m5mpmj/.'
          },
          ...(mssEnvironment !== 'production' ? devInstructions : [])
        ]
      }
    }

    return {
      pageTitle: 'Accès interdit',
      intro: "Vous n'avez pas les droits suffisants pour accéder à cette page.",
      solutions: [
        'Vérifiez que vous avez bien le rôle nécessaire pour accéder à la page souhaitée et que votre compte Proconnect est bien configuré.',
        "Si vous avez besoin d'une aide immédiate, merci de nous contacter directement."
      ]
    }
  }
</script>
