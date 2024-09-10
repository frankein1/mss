<template>
  <form @submit.prevent="split">
    <p>
      Ses informations, ses documents, ses revenus ainsi que ses suivis seront
      retirer du dossier actuel et formeront un nouveau dossier indépendant.
    </p>

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
          label="Confirmer"
          type="submit"
          :submitting="isSubmitting"
          :readonly="isSubmitting"
        ></DsfrButton>
      </li>
    </DsfrButtonGroup>
  </form>
</template>

<script setup lang="ts">
  defineProps<{ isSubmitting: boolean; split: () => void }>()

  const modal = useModal()
</script>
