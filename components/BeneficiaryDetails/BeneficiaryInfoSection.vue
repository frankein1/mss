<template>
  <div
    class="feature-section fr-mt-1w"
    :class="{ 'fr-accordion': title }"
  >
    <div
      v-if="title"
      class="fr-accordion__title"
    >
      <button
        class="fr-accordion__btn fr-h4"
        aria-expanded="true"
        :aria-controls="infoSectionId"
      >
        {{ title }}
      </button>
    </div>
    <div
      :id="title ? infoSectionId : undefined"
      :class="{ 'fr-collapse': title }"
    >
      <div>
        <slot></slot>
        <ul
          v-if="editLink"
          class="fr-btns-group fr-btns-group--inline fr-btns-group--right"
        >
          <li>
            <NuxtLink
              :to="`${editLink}`"
              class="fr-btn fr-btn--secondary"
              title="Modifier"
              target="_self"
            >
              Modifier
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { getRandomId } from '~/utils/random'

  defineProps<{
    title?: string
    editLink?: string
  }>()

  const infoSectionId = computed(() => getRandomId('beneficiary-info-section-'))
</script>

<style scoped lang="scss">
  .fr-accordion::before {
    content: none;
  }

  .fr-accordion.feature-section {
    padding: 0;
  }

  .fr-accordion__btn {
    color: var(--text-title-blue-france);
    padding: 1.5rem 2rem;
    border-radius: 0.5rem;

    &::after {
      --icon-size: 1.5rem;
    }

    &[aria-expanded='true'] {
      background-color: initial;
      border-bottom: 1px solid var(--border-default-grey);
      border-radius: 0.5rem 0.5rem 0 0;
    }
  }

  .fr-accordion .fr-collapse > * {
    padding: 1rem;
  }

  .fr-accordion .fr-collapse--expanded {
    padding-bottom: 1rem;
    padding-top: 1rem;
  }

  .fr-btns-group.fr-btns-group--inline .fr-btn {
    margin-bottom: 0;
  }
</style>
