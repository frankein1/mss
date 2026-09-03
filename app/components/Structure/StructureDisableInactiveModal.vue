<template>
  <div class="fr-alert fr-alert--info fr-alert--sm fr-mb-4v">
    <p class="fr-text--bold">
      Structure <span class="text--uppercase">{{ structure.name }}</span>
      inactive&nbsp;: dernière activité le
      {{ formatDate(structure.lastAccess || structure.created) }},
      {{ structure.deactivationAlertEmail }}&nbsp;{{ alertEmailsLabel }}.
    </p>
    <p>
      Assurez-vous que vous souhaitez-bien désactiver cette structure, cette
      action est irréversible.
    </p>
  </div>

  <StructureDisableRecap :structure />

  <div class="fr-mt-8v">
    <ul
      class="fr-btns-group fr-btns-group--right fr-btns-group--inline-md fr-btns-group--icon-left"
    >
      <li>
        <button
          class="fr-btn fr-btn--secondary"
          title="Annuler"
          type="button"
          @click="cancel()"
        >
          Annuler
        </button>
      </li>
      <li>
        <button
          class="fr-btn fr-btn--icon-left fr-icon-delete-line btn-delete-action"
          title="Désactiver"
          type="button"
          @click="disable(structure)"
        >
          Désactiver
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import type { AdminStructureInfo } from './types'

  const props = defineProps<{
    structure: AdminStructureInfo
    disable: (structure: AdminStructureInfo) => void
    cancel: () => void
  }>()

  const alertEmailsLabel = computed(() =>
    props.structure.deactivationAlertEmail > 1
      ? 'e-mails de relance envoyés'
      : 'e-mail de relance envoyé'
  )
</script>
