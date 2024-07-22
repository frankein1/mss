<template>
  <div class="landing-main-container fr-container fr-my-8w">
    <h1>{{ routes.landing.MentionsLegales.title }}</h1>
    <h2>Éditeur de la Plateforme</h2>
    <p>
      La Plateforme Mon Suivi Social est éditée par l'Incubateur des Territoires
      situé :
    </p>
    <address class="fr-mb-3v">
      20, avenue de Ségur<br />
      TSA 10717<br />
      75 334 Paris Cedex 07<br />
      <NuxtLink to="mailto:contactincubateur@anct.gouv.fr">
        contactincubateur@anct.gouv.fr
      </NuxtLink>
    </address>
    <h2>Directeur de la publication</h2>
    <p>Stanislas Bourron, Directeur général de l'ANCT.</p>
    <h2>Hébergement de la Plateforme</h2>
    <p>Ce site est hébergé en propre par SCALEWAY SAS</p>
    <address class="fr-mb-3v">
      8 rue de la ville l'évêque<br />
      75 008 PARIS<br />
      Email :
      <NuxtLink
        to="https://www.scaleway.com/fr/contact/"
        target="_blank"
        rel="noopener external"
        title="Contact de Scaleway - nouvelle fenêtre"
        >https://www.scaleway.com/fr/contact/</NuxtLink
      ><br />
      Téléphone :
      <NuxtLink to="tel:+33(0)184130000">+33 (0)1 84 13 00 00</NuxtLink>
    </address>
    <h2>Accessibilité</h2>
    <p>
      La conformité aux normes d'accessibilité numérique est un objectif
      ultérieur mais nous tâchons de rendre ce site accessible à toutes et à
      tous.
    </p>
    <h3>Signaler un dysfonctionnement</h3>
    <p>
      Si vous rencontrez un défaut d'accessibilité vous empêchant d'accéder à un
      contenu ou une fonctionnalité du site, merci de nous en faire part.<br />
      Si vous n'obtenez pas de réponse rapide de notre part, vous êtes en droit
      de faire parvenir vos doléances ou une demande de saisine au Défenseur des
      droits.
    </p>
    <h3>En savoir plus</h3>
    <p>
      Pour en savoir plus sur la politique d'accessibilité numérique de l'État :
      <NuxtLink
        to="http://references.modernisation.gouv.fr/accessibilite-numerique"
        target="_blank"
        rel="noopener external"
        title="Politique d'accessibilité numérique de l'État - nouvelle fenêtre"
        >http://references.modernisation.gouv.fr/accessibilite-numerique</NuxtLink
      >
    </p>
    <h2>Sécurité</h2>
    <p>
      Le site est protégé par un certificat électronique, matérialisé pour la
      grande majorité des navigateurs par un cadenas. Cette protection participe
      à la confidentialité des échanges. En aucun cas les services associés à la
      plateforme ne seront à l'origine d'envoi de courriels pour demander la
      saisie d'informations personnelles.
    </p>
  </div>
</template>

<script setup>
  import { routes } from '~/utils/routes'

  useHead({
    title: routes.landing.MentionsLegales.title
  })

  definePageMeta({
    layout: 'landing'
  })
</script>
