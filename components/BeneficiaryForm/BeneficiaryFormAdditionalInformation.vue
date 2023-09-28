<template>
  <BeneficiaryFormSection section-title="Informations complémentaires">
    <div class="fr-col-12">
      <VeeTextarea
        name="additionalInformation"
        label="Informations complémentaires"
      >
        <template #hint>
          Il est fortement recommandé de ne stocker que les informations utiles
          au suivi du bénéficiaire et d'éviter le recueil d'informations
          sensibles (données de santé, mots de passe, etc).
        </template>
      </VeeTextarea>
    </div>
  </BeneficiaryFormSection>
</template>
