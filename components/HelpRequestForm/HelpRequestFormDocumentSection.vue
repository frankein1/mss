<template>
  <section
    class="fr-grid-row fr-grid-row--gutters fr-grid-row--bottom fr-grid-row--center"
  >
    <h3 class="fr-col-12 fr-h5 fr-mb-0">Document(s)</h3>

    <div class="fr-col-12">
      <BeneficiaryDocumentsSelect
        :family-file-id="familyFileId"
        :beneficiary-id="beneficiaryId"
        name="documents"
        snackbar-success-message="Le document a été ajouté à la fiche bénéficiaire. Enregistrez l'instruction de dossier pour conserver le lien entre les deux."
      />
    </div>
  </section>
</template>

<script setup lang="ts">
  defineProps<{
    familyFileId: string
    beneficiaryId: string
  }>()
</script>
