<template>
  <form
    ref="form"
    novalidate
    @submit.prevent="onSubmit"
  >
    <div class="fr-grid-row fr-grid-row--gutters">
      <p class="fr-col-12">
        Si des revenus ont été renseignés dans le module Budget, ils seront
        supprimés.
      </p>

      <div class="fr-col-12">
        <DsfrButtonGroup
          equisized
          inline-layout-when="always"
          align="right"
        >
          <li>
            <DsfrButton
              label="Annuler"
              type="button"
              secondary
              @click="modal.close"
            ></DsfrButton>
          </li>
          <li>
            <DsfrButton
              label="Supprimer"
              class="btn-delete-action"
            ></DsfrButton>
          </li>
        </DsfrButtonGroup>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
  import { DsfrButton } from '@gouvminint/vue-dsfr'

  const modal = useModal()

  const props = defineProps<{
    delete: () => void
  }>()

  function onSubmit() {
    props.delete()
  }
</script>
