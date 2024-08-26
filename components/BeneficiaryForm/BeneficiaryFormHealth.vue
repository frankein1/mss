<template>
  <section class="fr-p-3v">
    <h2 class="title-blue fr-mb-6v">
      {{ routes.beneficiary.AppBeneficiaryEditHealth.title }}
    </h2>

    <AtomNotice class="fr-mb-4w">
      <template #default> Attention aux données de santé </template>

      <template #content>
        Vous ne pouvez manipuler des données de santé des bénéficiaires que si
        votre structure est habilitée à le faire au titre de l'article 9 du RGPD
        (pour plus d'information voir
        <a
          target="_blank"
          href="/notice/20231103_donnees_sante_monsuivisocial.pdf"
          rel="noopener external"
          title="Notice d'information - nouvelle fenêtre"
          >la notice d'information</a
        >
        ou référez-vous à votre responsable de structure). Nous vous
        encourageons également à ne mentionner que les données qui sont
        strictement nécessaires au suivi des bénéficiaires.
      </template>
    </AtomNotice>

    <BeneficiaryFormSection>
      <div class="fr-col-12">
        <VeeSelect
          name="gir"
          :label="beneficiaryFieldLabels.gir"
          :options="withEmptyValue(beneficiaryGirKeys.options)"
        />
      </div>
      <div class="fr-col-12">
        <VeeInput
          name="doctor"
          :label="beneficiaryFieldLabels.doctor"
        />
      </div>
      <div
        v-if="application.edit.health.nir"
        class="fr-col-12"
      >
        <VeeInput
          name="socialSecurityNumber"
          :label="beneficiaryFieldLabels.socialSecurityNumber"
          type="social-security-number"
        />
      </div>
      <div class="fr-col-12">
        <VeeInput
          name="insurance"
          :label="beneficiaryFieldLabels.insurance"
        />
      </div>
      <div class="fr-col-12">
        <VeeTextarea
          name="healthAdditionalInformation"
          :label="beneficiaryFieldLabels.healthAdditionalInformation"
        >
          <template #hint>
            Il est fortement recommandé de ne stocker que les informations
            utiles au suivi du bénéficiaire et d'éviter le recueil
            d'informations sensibles (données de santé, mots de passe, etc).
          </template>
        </VeeTextarea>
      </div>
    </BeneficiaryFormSection>
  </section>
</template>

<script lang="ts" setup>
  import { beneficiaryGirKeys } from '~/client/options'
  import { beneficiaryFieldLabels } from '~/client/labels/beneficiary.labels'
  import { routes } from '~/utils/routes'

  const { application } = usePermissions()
</script>
