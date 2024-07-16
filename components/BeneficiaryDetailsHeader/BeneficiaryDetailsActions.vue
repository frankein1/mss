<template>
  <ul class="fr-btns-group fr-btns-group--inline">
    <li v-if="permissions?.delete">
      <button
        class="fr-btn fr-btn--secondary fr-icon-delete-line btn-delete-action"
        data-fr-opened="false"
        aria-controls="global-modal"
        type="button"
        @click="onDelete"
      >
        Supprimer
      </button>
    </li>
    <li>
      <NuxtLink
        :to="`${routes.beneficiary.AppBeneficiaryPrint.path(beneficiaryId)}`"
        class="fr-btn fr-btn--secondary fr-icon-printer-line"
      >
        Imprimer
      </NuxtLink>
    </li>
    <li>
      <NuxtLink
        :to="`${editRoute}`"
        class="fr-btn fr-btn--icon-left fr-icon-edit-line edit-btn"
      >
        Modifier les informations
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import { routes } from '~/routes'
  import BeneficiaryDeleteForm from '~/components/BeneficiaryDeleteForm/BeneficiaryDeleteForm.vue'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { FamilyFilePermissions } from '~/server/security'

  const route = useRoute()

  const props = defineProps<{
    beneficiaryId: string
    permissions: FamilyFilePermissions | undefined
  }>()

  const emit = defineEmits<{ toggleDelete: []; deleted: [] }>()

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

  function onDelete() {
    emit('toggleDelete')
    useModal().open(BeneficiaryDeleteForm, {
      title: 'Supprimer la fiche bénéficiaire',
      beneficiaryId: props.beneficiaryId,
      cancel: () => emit('toggleDelete'),
      deleted: () => {
        emit('deleted')
      }
    })
  }
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
    padding: 0.5rem 1rem;
  }
</style>
