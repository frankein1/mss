<template>
  <div class="feature-section bg-color-white structure-configuration-sss">
    <h2 class="fr-h4 structure-configuration-sss__title">
      Objets d’accompagnements proposés par votre structure
    </h2>

    <AtomCallout variant="tonal">
      <div class="structure-configuration-sss__note">
        <p class="fr-callout__text">
          Les aides légales et facultatives sélectionnées ci-dessous
          correspondent aux
          <strong>
            objets des instructions de dossiers et des synthèses d’entretiens </strong
          >, visibles par tous les membres de votre structure.
          <strong>Ces intitulés alimenteront vos statistiques</strong> et vous
          permettront de facilement retrouver vos dossiers.
        </p>

        <div>IMAGE</div>
      </div>
    </AtomCallout>

    <StructureConfigurationSocialSupportSubjectsEmpty
      v-if="subjects.length === 0"
    />
    <div
      v-else
      class="structure-configuration-sss__items"
    >
      <StructureConfigurationSocialSupportSubjectsItem
        v-for="(item, index) in subjects"
        :id="item.id"
        :key="index"
        :label="item.name"
        :can-edit="canEdit"
        @edit="() => {}"
        @remove="() => {}"
      />
    </div>

    <div class="fr-grid-row fr-grid-row--right">
      <NuxtLink
        class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-add-line"
        :to="RoutePath.AppStructureEdit()"
      >
        Ajouter un accompagnement
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { StructureConfigurationSocialSupportSubjects } from './types'
  import { RoutePath } from '~/utils/routing'

  defineProps<{
    subjects: StructureConfigurationSocialSupportSubjects
    canEdit: boolean
  }>()
</script>

<style scoped lang="scss">
  @use '@gouvfr/dsfr/module/media-query' as dsfr-media-query;

  .structure-configuration-sss > *:not(:last-of-type) {
    margin-bottom: 1.5rem;
  }

  .structure-configuration-sss__title {
    color: var(--primary);
  }

  .structure-configuration-sss__note {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .structure-configuration-sss__items {
    @include dsfr-media-query.respond-from('lg') {
      columns: 2;
      column-gap: 3rem;
    }
  }
</style>
