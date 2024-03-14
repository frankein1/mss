<template>
  <div :class="`fr-callout fr-callout--${variant}`">
    <div>
      <h3
        v-if="title"
        class="fr-callout__title fr-text--lg"
      >
        {{ title }}
      </h3>

      <slot></slot>
    </div>

    <button
      v-if="button"
      :class="[
        'fr-btn',
        button.className,
        button.icon ? `fr-btn--icon-left ${button.icon}` : undefined
      ]"
      @click="button.onClick"
    >
      {{ button.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      title?: string
      button?: {
        label: string
        className?: string
        icon?: string
        onClick: () => void
      }
      variant?: 'tonal' | 'plain'
    }>(),
    { title: undefined, button: undefined, variant: 'plain' }
  )
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/module/media-query' as dsfr-media-query;

  .fr-callout {
    display: flex;
    flex-direction: column;

    @include dsfr-media-query.respond-from('lg') {
      padding: 1.5rem 2.5rem 1.5rem 2rem;
      flex-direction: row;
      align-items: center;
    }

    &--tonal {
      background-color: var(--background-alt-blue-france);
    }

    &--plain {
      background-color: #fff;
    }

    .fr-btn {
      margin: 0 0 0 1.5rem;
      height: fit-content;
    }
  }
</style>
