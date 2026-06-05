<template>
  <ul class="fr-btns-group fr-btns-group--inline">
    <li v-if="permissions?.delete">
      <button
        class="fr-btn fr-btn--secondary fr-icon-delete-line btn-delete-action fr-mb-0"
        data-fr-opened="false"
        aria-controls="global-modal"
        type="button"
        title="Supprimer"
        @click="emit('delete')"
      >
        Supprimer
      </button>
    </li>
    <li>
      <NuxtLink
        :to="`${routes.beneficiary.AppBeneficiaryPrint.path(beneficiaryId)}`"
        class="fr-btn fr-btn--secondary fr-icon-printer-line fr-mb-0"
        title="Imprimer"
      >
        Imprimer
      </NuxtLink>
    </li>
    <li v-if="familyFile">
      <button
        class="fr-btn fr-btn--secondary fr-mb-0 fr-btn--icon-left fr-icon-user-unfollow-line edit-btn"
        data-fr-opened="false"
        aria-controls="global-modal"
        :aria-describedby="describedBy"
        type="button"
        title="Dissocier du dossier"
        :disabled="beneficiaryRelationship == null"
        @click="emit('split')"
      >
        Dissocier du dossier
      </button>
      <span
        v-if="beneficiaryRelationship == null"
        id="split-tooltip"
        class="fr-tooltip fr-placement"
        role="tooltip"
        >Vous ne pouvez pas dissocier le bénéficiaire principal du foyer</span
      >
    </li>
    <!-- Allows archiving before inactivity threshold -->
    <li v-if="application.archive.beneficiary">
      <button
        class="fr-btn fr-btn--secondary fr-btn--icon-left fr-mb-0 edit-btn"
        data-fr-opened="false"
        type="button"
        title="Archiver le bénéficiaire"
        @click="emit('archive')"
      >
        <i class="ri-folder-close-line"></i>
        Archiver le bénéficiaire
      </button>
    </li>
    <li>
      <NuxtLink
        :to="`${editRoute}`"
        class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-edit-line fr-mb-0 edit-btn"
      >
        Modifier
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import { routes } from '~/utils/routes'
  import type { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import type { FamilyFilePermissions } from '~/server/security'
  import type { RelativeRelationship } from '@prisma/client'

  const route = useRoute()
  const { application } = usePermissions()

  const props = defineProps<{
    beneficiaryId: string
    permissions: FamilyFilePermissions | undefined
    familyFile?: boolean
    beneficiaryRelationship?: RelativeRelationship | null
  }>()

  const emit = defineEmits<{ delete: []; split: []; archive: [] }>()

  const currentTab = computed(() => {
    const hash = route.hash.slice(1)
    return hash ? (hash as BeneficiaryTab) : undefined
  })

  const editRoute = computed(() =>
    routes.beneficiary.AppBeneficiaryEditInfo.path(
      props.beneficiaryId,
      currentTab.value ? { originTab: currentTab.value } : undefined
    )
  )

  const describedBy = computed(() =>
    props.beneficiaryRelationship == null ? 'split-tooltip' : ''
  )
</script>

<style lang="scss">
  // For DSFR override prupose
  .fr-btns-group:not(
      .fr-btns-group--sm,
      .fr-btns-group--lg,
      [class^='fr-btns-group--icon-'],
      [class*=' fr-btns-group--icon-']
    )
    .fr-btn[class*=' fr-icon-'].fr-btn--icon-left.fr-icon-edit-line.edit-btn {
    max-width: 100%;
    overflow: initial;
  }
</style>

<style lang="scss" scoped>
  .edit-btn {
    max-width: 100% !important;
    padding: 0.5rem 1rem !important;
  }

  .fr-btns-group--inline {
    row-gap: 0.75rem;

    .fr-btn {
      margin: 0 0.5rem 1rem;
    }
  }

  .ri-folder-close-line {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234550e5'%3E%3Cpath d='M3 3C2.44772 3 2 3.44772 2 4V20C2 20.5523 2.44772 21 3 21H13V19H4V5H9.58579L11.5858 7H20V12H22V6C22 5.44772 21.5523 5 21 5H12.4142L10.4142 3H3ZM20.4143 17.9999L22.5356 20.1212L21.1214 21.5354L19.0001 19.4141L16.8788 21.5354L15.4646 20.1212L17.5859 17.9999L15.4646 15.8786L16.8788 14.4644L19.0001 16.5857L21.1214 14.4644L22.5356 15.8786L20.4143 17.9999Z'%3E%3C/path%3E%3C/svg%3E");
  }
</style>
