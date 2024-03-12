<template>
  <div class="fr-container fr-p-5w bg-color-white structureinfoheader">
    <div class="fr-h4 structureinfoheader__subtitle">
      Informations sur votre structure
    </div>

    <div class="structureinfoheader__content">
      <div>
        <span class="structureinfoheader__content__label fr-mr-1w">
          {{ structureFieldLabels.name }} :
        </span>
        <span>{{ structure.name }}</span>
      </div>

      <div>
        <span class="structureinfoheader__content__label fr-mr-1w">
          {{ structureFieldLabels.address }} :
        </span>
        <span>{{ structure.address }}</span>
      </div>

      <div>
        <span class="structureinfoheader__content__label fr-mr-1w">
          {{ structureFieldLabels.zipcode }} :
        </span>
        <span>{{ structure.zipcode }}</span>
      </div>

      <div>
        <span class="structureinfoheader__content__label fr-mr-1w">
          {{ structureFieldLabels.city }} :
        </span>
        <span>{{ structure.city }}</span>
      </div>

      <div>
        <span class="structureinfoheader__content__label fr-mr-1w">
          {{ structureFieldLabels.phone }} :
        </span>
        <span>{{ structure.phone }}</span>
      </div>

      <div>
        <span class="structureinfoheader__content__label fr-mr-1w">
          {{ structureFieldLabels.email }} :
        </span>
        <span>{{ structure.email }}</span>
      </div>
    </div>

    <div class="fr-grid-row fr-grid-row--right">
      <div>
        <NuxtLink
          :to="`${RoutePath.AppStructureEdit()}`"
          class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-edit-line"
        >
          Modifier
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { RoutePath } from '~/utils/routing'
  import { structureFieldLabels } from '~/client/labels/structure.labels'
  import { StructureConfigurationOutput } from '~/components/StructureConfiguration/types'

  defineProps<{
    structure: StructureConfigurationOutput
  }>()
</script>

<style scoped>
  .structureinfoheader {
    border-radius: 0.5rem;
    border: 1px solid var(--border-default-grey);
    background-color: var(--background-default-grey);
  }

  .structureinfoheader > div:not(:last-of-type) {
    margin-bottom: 1.5rem;
  }

  .structureinfoheader__subtitle {
    color: var(--primary);
  }

  .structureinfoheader__content > div:not(:last-of-type) {
    margin-bottom: 0.5rem;
  }

  .structureinfoheader__content__label {
    font-weight: 700;
    margin-right:;
  }
</style>
