<template>
  <section class="fr-accordion big-accordion feature-section">
    <h3 class="fr-accordion__title">
      <button
        type="button"
        class="fr-accordion__btn big-accordion__btn"
        aria-expanded="true"
        aria-controls="accordion-dispositifs"
      >
        Dispositifs proposés par votre structure
      </button>
    </h3>
    <div
      id="accordion-dispositifs"
      class="fr-collapse fr-collapse--expanded"
    >
      <SupportProgramNames />
    </div>
  </section>
  <section class="fr-accordion big-accordion feature-section fr-mt-4v">
    <h3 class="fr-accordion__title">
      <button
        type="button"
        class="fr-accordion__btn big-accordion__btn"
        aria-expanded="true"
        aria-controls="accordion-objets-accompagnement"
      >
        Objets d’accompagnements proposés par votre structure
      </button>
    </h3>
    <div
      id="accordion-objets-accompagnement"
      class="fr-collapse fr-collapse--expanded"
    >
      <SocialSupportSubjects
        v-if="socialSupportSubjects"
        :subjects="socialSupportSubjects"
        :edit-path="routes.structure.AppStructureSubjects.path()"
        @refresh="emit('refresh')"
      />
    </div>
  </section>
</template>

<script lang="ts" setup>
  import type { SocialSupportSubjects as SocialSupportSubjectsData } from './types'
  import { routes } from '~/utils/routes'

  defineProps<{
    socialSupportSubjects?: SocialSupportSubjectsData
  }>()

  const emit = defineEmits<{ refresh: [] }>()
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .big-accordion {
    --default-padding: 1.5rem;

    .big-accordion__btn {
      padding: var(--default-padding);
      font-size: 1.25rem;
      font-weight: 700;

      &[aria-expanded='true'] {
        background: none;
        border-bottom: 1px solid var(--border-default-grey);
      }
    }

    .fr-collapse--expanded {
      padding: var(--default-padding);
    }

    @include dsfr-media-query.respond-from('md') {
      // FROM MD breakpoint
      --default-padding: 2.5rem;

      .big-accordion__btn {
        font-size: 1.5rem;
      }

      .fr-collapse--expanded {
        padding: var(--default-padding);
      }
    }
  }
</style>
