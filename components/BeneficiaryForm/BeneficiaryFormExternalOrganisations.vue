<template>
  <section class="fr-p-3v">
    <h2 class="title-blue fr-mb-6v">
      {{ routes.beneficiary.AppBeneficiaryEditExternalOrganisations.title }}
    </h2>

    <BeneficiaryFormSection>
      <div class="fr-col-12">
        <VeeSelect
          name="protectionMeasure"
          :label="beneficiaryFieldLabels.protectionMeasure"
          :options="withEmptyValue(beneficiaryProtectionMeasureKeys.options)"
        />
      </div>
      <div class="fr-col-12">
        <VeeInput
          name="representative"
          :label="beneficiaryFieldLabels.representative"
        />
      </div>
      <div class="fr-col-12">
        <VeeInput
          name="prescribingStructure"
          :label="beneficiaryFieldLabels.prescribingStructure"
        />
      </div>
      <div class="fr-col-12">
        <VeeSelect
          name="orientationType"
          :label="beneficiaryFieldLabels.orientationType"
          :options="withEmptyValue(beneficiaryOrientationTypeKeys.options)"
        />
      </div>
      <div class="fr-col-12">
        <VeeInput
          name="orientationStructure"
          :label="beneficiaryFieldLabels.orientationStructure"
        />
      </div>
      <div class="fr-col-12">
        <AtomAlertMSS :alert-type="AlertType.Info">
          <template #detailedMessage>
            <p>
              Vous pouvez maintenant préciser les partenaires et prestataires
              intervenant dans la partie dispositifs. Rapprochez-vous de votre
              responsable de structure pour définir les noms de dispositifs.
            </p>
            <p>
              <strong>Ces dispositifs alimenteront vos statistiques.</strong>
            </p>
          </template>
        </AtomAlertMSS>
      </div>
      <div class="fr-col-12">
        <VeeInput
          disabled
          name="serviceProviders"
          :label="beneficiaryFieldLabels.serviceProviders"
          placeholder="Repas à domicile, aide à domicile..."
        />
      </div>
      <div class="fr-col-12">
        <VeeInput
          disabled
          name="involvedPartners"
          :label="beneficiaryFieldLabels.involvedPartners"
        />
      </div>
    </BeneficiaryFormSection>
  </section>
</template>

<script setup lang="ts">
  import {
    beneficiaryOrientationTypeKeys,
    beneficiaryProtectionMeasureKeys
  } from '~/client/options'
  import { beneficiaryFieldLabels } from '~/client/labels/beneficiary.labels'
  import { routes } from '~/utils/routes'
  import { AlertType } from '~/utils/constants/alert'
</script>
