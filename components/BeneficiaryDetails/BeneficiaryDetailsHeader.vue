<template>
  <ul class="fr-btns-group fr-btns-group--inline-md header-btn-group">
    <li>
      <NuxtLink
        :to="`${Routes.BeneficiaryEdit(beneficiaryId)}`"
        class="fr-btn fr-btn--tertiary-no-outline fr-icon-pencil-line"
        title="Modifier"
        target="_self"
      >
        Modifier
      </NuxtLink>
    </li>
    <li>
      <NuxtLink
        :to="`${Routes.BeneficiaryPrint(beneficiaryId)}`"
        class="fr-btn fr-btn--tertiary-no-outline fr-icon-printer-line"
        title="Imprimer"
        target="_self"
      >
        Imprimer
      </NuxtLink>
    </li>
    <li>
      <button
        v-if="canDelete"
        class="fr-btn fr-btn--tertiary-no-outline fr-icon-delete-line btn-delete-action"
        title="Supprimer"
        data-fr-opened="false"
        aria-controls="global-modal"
        type="button"
        @click="$emit('onDelete')"
      >
        Supprimer
      </button>
    </li>
  </ul>
</template>

<script lang="ts" setup>
  import { Routes } from '~/utils/routing/routes'

  withDefaults(
    defineProps<{
      beneficiaryId: string
      canDelete: boolean
    }>(),
    {}
  )

  defineEmits<{
    (e: 'onDelete'): void
  }>()
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/src/core/index' as dsfr;

  .fr-btns-group {
    position: sticky;
    top: 2rem;

    .fr-btn {
      justify-content: flex-start;
    }
  }

  .header-btn-group.fr-btns-group {
    display: inline-flex;

    .fr-btn {
      margin-bottom: 0;
    }
  }
</style>
