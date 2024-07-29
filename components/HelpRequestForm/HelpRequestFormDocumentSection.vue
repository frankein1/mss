<template>
  <h3 class="fr-col-12 fr-h5 fr-mb-0">Document(s)</h3>

  <div class="fr-col-12">
    <BeneficiaryDocumentsSelect
      :family-file-id="familyFileId"
      :family-file-identification="[]"
      name="documents"
      snackbar-success-message="Le document a été ajouté à la fiche bénéficiaire. Enregistrez l'instruction de dossier pour conserver le lien entre les deux."
    />
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    familyFileId: string
  }>()
</script>
