<template>
  <figure
    role="group"
    class="fr-content-media fr-content-media--sm"
  >
    <video
      class="fr-responsive-vid"
      controls
      href="#"
      poster="~/assets/img/video-presentation-preview.jpg"
      preload="none"
      width="100%"
    >
      <!-- Credit Adrien Di Pasquale - the to is a fix for a bad rule in DSFR -->
      <source
        src="~/assets/video/presentation.webm"
        type="video/webm"
      />
      <source
        src="~/assets/video/presentation.mp4"
        type="video/mp4"
      />
    </video>
    <figcaption class="fr-sr-only">
      Présentation des fonctionnalités de Mon Suivi Social
      <NuxtLink
        to="~/assets/video/presentation.webm"
        target="_blank"
        rel="noopener external"
        title="Vidéo de présentation des fonctionnalités de Mon Suivi Social - nouvelle fenêtre"
      >
        Vidéo de présentation des fonctionnalités de Mon Suivi Social
      </NuxtLink>
    </figcaption>
    <div class="fr-sr-only">
      <h2>Mon Suivi Social - Présentation</h2>
      <p>Libérez du temps pour l'accompagnement social.</p>
      <p>
        Un logiciel simple et gratuit pour centraliser le suivi des
        bénéficairies des structures de l'accompagnement social, porté par
        l'Agence Nationale de la cohésion des territoires.
      </p>
      <h3>Qu'est-ce que c'est ?</h3>
      <h4>Suivi complet des bénéficiaires</h4>
      <ul>
        <li>Répertoire des bénéficiaires</li>
        <li>Suivi des accompagnements</li>
        <li>Aides légales et facultatives</li>
        <li>Module de statistiques</li>
      </ul>
      <h4>Partage d'informations</h4>
      <ul>
        <li>Données centralisées et numériques</li>
        <li>Notifications entre agents</li>
        <li>Rappel de tâches</li>
        <li>Gestion des rendez-vous avec RDV-solidarité (à venir)</li>
      </ul>
      <h4>Données sécurisées</h4>
      <ul>
        <li>Conformité RGPD</li>
        <li>Accès configurable par profile</li>
        <li>Hébergement hautement sécurisé</li>
        <li>Accès aux données personnalisable</li>
      </ul>
      <h3>Comment ça marche ?</h3>
      <p>6 étapes simples pour un suivi complet</p>
      <ol>
        <li>
          Enregistrez votre structure. Créez un compte facilement et invitez vos
          agents.
        </li>
        <li>
          Créez vos bénéficiaires. De nombreux hamps peuvnet être complétés.
        </li>
        <li>
          Personnalisez vos types d'aides. Configurez les aides légales et vos
          aides facultatives.
        </li>
        <li>
          Centralisez vos bénéficiaires. Retrouvez toutes les fiches
          bénéficiaires en 1 clic.
        </li>
        <li>
          Consigez vos historiques. Pour chaque bénéficiaire, ajoutez toutes les
          étapes de son accompagnement.
        </li>
        <li>
          Disposez de vos statistiques. Les statistiques sont créés
          automatiquement et en temps réel.
        </li>
      </ol>
      <p>
        Contactez-nous :
        <NuxtLink :to="`mailto:${supportEmail}`">{{ supportEmail }}</NuxtLink>
      </p>
    </div>
  </figure>
</template>

<script setup lang="ts">
  const {
    public: {
      email: { from: supportEmail }
    }
  } = useRuntimeConfig()
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/module/media-query' as dsfr-media-query;

  .fr-content-media {
    margin: 0.5rem 0 !important;

    @include dsfr-media-query.respond-from('md') {
      margin: 2.5rem 0 !important;
    }
  }
</style>
