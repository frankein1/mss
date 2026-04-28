<template>
  <AtomCallout>
    <div class="sss__note">
      <div>
        <p class="fr-callout__text fr-mb-2v">
          Les dispositifs et axes d’intervention
          <strong>sont à l’échelle du bénéficiaire</strong>&nbsp;: ils
          catégorisent son parcours dans la durée. Les objets d’accompagnement
          <strong>sont à l’échelle des suivis</strong> (entretiens et demandes
          d’aide)&nbsp;: ils reflètent les sujets abordés lors des entretiens et
          les actions menées, que la personne soit engagée dans un dispositif ou
          non. Vous pourrez lier les objets d'accompagnement à un dispositif ou
          axe d'intervention.
        </p>
        <p class="fr-callout__text fr-mb-2v">
          <strong
            >Ces intitulés doivent refléter l'activité de votre structure&nbsp;:
            ils permettent d'alimenter vos statistiques et de facilement
            retrouver vos dossiers.</strong
          >
        </p>
        <p class="fr-callout__text fr-mb-2v fr-text-xs">
          <em>Exemples de dispositifs et axes d'intervention&nbsp;:</em>
          portage de repas, santé, RSA, PRE, soutien à la scolarité.
        </p>
        <p class="fr-callout__text fr-text-xs">
          <em>Exemples d’objets d’accompagnement&nbsp;:</em> soutien
          administratif, aide médicale d’État, dossier MDPH, aide aux devoirs,
          accès aux droits.
        </p>
      </div>

      <img
        src="/pictograms/inclusion.svg"
        class="img fr-hidden fr-unhidden-sm"
        alt=""
      />
    </div>
  </AtomCallout>
</template>

<style scoped lang="scss">
  .sss__note {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .img {
    max-height: 100px;
    height: auto;
  }
</style>
