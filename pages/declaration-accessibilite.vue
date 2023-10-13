<template>
  <div class="landing-main-container fr-container fr-my-8w">
    <h1>{{ RouteTitle.DeclarationAccessibilite() }}</h1>
    <p>Établie le <span>17 mai 2022</span>.</p>
    <p>
      <span>Agence National de la Cohésion des Territoires</span> s'engage à
      rendre son service accessible, conformément à l'article 47 de la loi n°
      2005-102 du 11 février 2005.
    </p>
    <p>
      Cette déclaration d'accessibilité s'applique à
      <strong>Mon Suivi Social</strong
      ><span>
        (<span>https://monsuivisocial.incubateur.anct.gouv.fr/</span>)</span
      >.
    </p>
    <h2>État de conformité</h2>
    <p>
      <strong>Mon Suivi Social</strong> est
      <strong><span data-printfilter="lowercase">non conforme</span></strong>
      avec le
      <abbr title="Référentiel général d'amélioration de l'accessibilité"
        >RGAA</abbr
      >. <span>Le site n'a encore pas été audité.</span>
    </p>
    <h2>Amélioration et contact</h2>
    <p>
      Si vous n'arrivez pas à accéder à un contenu ou à un service, vous pouvez
      contacter le responsable de <span>Mon Suivi Social</span> pour être
      orienté vers une alternative accessible ou obtenir le contenu sous une
      autre forme.
    </p>
    <ul>
      <li>
        E-mail&nbsp;:
        <NuxtLink to="mailto:monsuivisocial@anct.gouv.fr">
          monsuivisocial@anct.gouv.fr
        </NuxtLink>
      </li>
    </ul>
    <h2>Voie de recours</h2>
    <p>
      Cette procédure est à utiliser dans le cas suivant&nbsp;: vous avez
      signalé au responsable du site internet un défaut d'accessibilité qui vous
      empêche d'accéder à un contenu ou à un des services du portail et vous
      n'avez pas obtenu de réponse satisfaisante.
    </p>
    <p>Vous pouvez&nbsp;:</p>
    <ul>
      <li>
        Écrire un message au
        <NuxtLink
          to="https://formulaire.defenseurdesdroits.fr/"
          target="_blank"
          >Défenseur des droits</NuxtLink
        >
      </li>
      <li>
        Contacter
        <NuxtLink
          to="https://www.defenseurdesdroits.fr/saisir/delegues"
          target="_blank"
          >le délégué du Défenseur des droits dans votre région</NuxtLink
        >
      </li>
      <li>
        Envoyer un courrier par la poste (gratuit, ne pas mettre de
        timbre)&nbsp;:<br />
        Défenseur des droits<br />
        Libre réponse 71120 75342 Paris CEDEX 07
      </li>
    </ul>
    <hr />
    <p>
      Cette déclaration d'accessibilité a été créé le
      <span>17 mai 2022</span> grâce au
      <NuxtLink
        to="https://betagouv.github.io/a11y-generateur-declaration/#create"
        target="_blank"
        >Générateur de Déclaration d'Accessibilité de BetaGouv</NuxtLink
      >.
    </p>
  </div>
</template>

<script setup>
  import { RouteTitle } from '~/utils/routing'

  useHead({
    title: RouteTitle.DeclarationAccessibilite()
  })

  definePageMeta({
    layout: 'landing'
  })
</script>
