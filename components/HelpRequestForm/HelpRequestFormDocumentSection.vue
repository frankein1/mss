<template>
  <h3 class="fr-h4">Documents</h3>
  <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--top">
    <div class="fr-col-12">
      <BeneficiaryDocumentsSelect
        :family-file-id="familyFileId"
        :beneficiary-id="beneficiaryId"
        name="documents"
        snackbar-success-message="Le document a été ajouté à la fiche bénéficiaire. Enregistrez l'instruction de dossier pour conserver le lien entre les deux."
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    familyFileId: string
    beneficiaryId: string
  }>()
</script>
