<template>
  <fieldset class="fr-accordion accordion-fieldset">
    <legend class="fr-accordion__title">
      <!-- The button type is forced to prevent accordion fieldset to submit the form it belongs to. -->
      <button
        class="fr-accordion__btn"
        aria-expanded="false"
        :aria-controls="ID"
        type="button"
      >
        {{ label }}
      </button>
    </legend>
    <div
      :id="ID"
      class="fr-collapse"
    >
      <slot></slot>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
  import { getRandomId } from '~/utils/random'

  const ID = getRandomId('accordion-fieldset-')

  defineProps<{
    label: string
  }>()
</script>

<style lang="scss" scoped>
  @use '~/assets/style/variables' as *;
  @use '@gouvfr/dsfr/src/core/index' as dsfr;

  .fr-accordion {
    border: 0;
    padding: 0;
    margin: 0;

    &::before {
      height: 3.25rem;
      top: -3.25rem;
    }
  }

  .fr-accordion__title {
    width: 100%;
    box-sizing: border-box;
    color: inherit;
    display: table;
    max-width: 100%;
    padding: 0;
    white-space: normal;
  }

  .fr-accordion__btn {
    @include dsfr.title-style(h5);

    &:not([aria-expanded='true']) {
      font-weight: normal;
    }

    &[aria-expanded='true'] {
      background-color: var(--background-alt-grey);
    }
  }
</style>

<style lang="scss">
  /* Allow to display custom select options within the accordion, as overflow is hidden */
  .accordion-fieldset.fr-accordion > .fr-collapse .fr-select-group {
    &.multi-select,
    &.searchable-select {
      .menu {
        max-height: 9.625rem;
      }
    }
  }
</style>
