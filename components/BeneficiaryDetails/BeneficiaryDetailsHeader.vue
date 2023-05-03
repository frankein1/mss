<template>
  <ul class="fr-btns-group fr-btns-group--inline-md header-btn-group">
    <li>
      <NuxtLink
        :to="`${Routes.Beneficiaries}/${beneficiaryId}/edit`"
        class="fr-btn fr-btn--tertiary-no-outline fr-icon-pencil-line"
        title="Modifier"
        target="_self"
      >
        Modifier
      </NuxtLink>
    </li>
    <li>
      <NuxtLink
        :to="`${Routes.Beneficiaries}/${beneficiaryId}/print`"
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
