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
        class="fr-btn fr-btn--secondary fr-mb-0"
        data-fr-opened="false"
        aria-controls="global-modal"
        type="button"
        title="Dissocier du dossier"
        @click="emit('split')"
      >
        <img
          class="fr-mr-1w"
          src="~/assets/icons/retirer.svg"
          alt="Dissocier"
        />
        Dissocier du dossier
      </button>
    </li>
    <li v-if="archivePermission">
      <button
        class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-folder-2-line fr-mb-0 edit-btn"
        data-fr-opened="false"
        type="button"
        title="Archiver le bénéficiaire"
        @click="emit('archive')"
      >
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
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { FamilyFilePermissions } from '~/server/security'

  const route = useRoute()
  const trpcClient = useTrpcClient()

  const props = defineProps<{
    beneficiaryId: string
    permissions: FamilyFilePermissions | undefined
    familyFile?: boolean
  }>()

  const { data: archivePermissionData } =
    await trpcClient.beneficiary.getBeneficiaryArchivePermission.useQuery({
      id: props.beneficiaryId
    })
  const archivePermission = computed(
    () => archivePermissionData?.value?.archive
  )

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
  }
</style>
