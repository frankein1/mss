<template>
  <ul class="fr-btns-group fr-btns-group--inline-md header-btn-group">
    <li>
      <NuxtLink
        :to="`${RoutePath.BeneficiaryEdit(beneficiaryId)}`"
        class="fr-btn fr-btn--tertiary-no-outline fr-icon-pencil-line"
        target="_self"
      >
        Modifier
      </NuxtLink>
    </li>
    <li>
      <NuxtLink
        :to="`${RoutePath.BeneficiaryPrint(beneficiaryId)}`"
        class="fr-btn fr-btn--tertiary-no-outline fr-icon-printer-line"
        target="_self"
      >
        Imprimer
      </NuxtLink>
    </li>
    <li>
      <button
        v-if="canDelete"
        class="fr-btn fr-btn--tertiary-no-outline fr-icon-delete-line btn-delete-action"
        data-fr-opened="false"
        aria-controls="global-modal"
        type="button"
        @click="onDelete"
      >
        Supprimer
      </button>
    </li>
  </ul>
</template>

<script lang="ts" setup>
  import { RoutePath } from '~/utils/routing'
  import BeneficiaryDeleteForm from '~/components/BeneficiaryDeleteForm/BeneficiaryDeleteForm.vue'

  const props = withDefaults(
    defineProps<{
      beneficiaryId: string
      canDelete: boolean
    }>(),
    {}
  )

  const emit = defineEmits<{
    (e: 'deleted'): void
  }>()

  function onDelete() {
    useModal().open(
      'Supprimer la fiche bénéficiaire',
      BeneficiaryDeleteForm,
      { beneficiaryId: props.beneficiaryId },
      { deleted: () => emit('deleted') }
    )
  }
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
