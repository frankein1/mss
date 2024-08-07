<template>
  <section class="fr-p-3v">
    <h2 class="title-blue fr-mb-6v">
      {{ routes.beneficiary.AppBeneficiaryEditTaxHousehold.title }}
    </h2>

    <AtomNotice class="fr-mx-n3v fr-mb-4w">
      <template #default>
        Si des membres du foyer étaient précédemment renseignés dans la section
        "foyer fiscal", ils se trouvent désormais dans la section "Entourage".
      </template>
    </AtomNotice>

    <BeneficiaryFormSection>
      <BeneficiaryFormFamilySituationInfos />
    </BeneficiaryFormSection>

    <BeneficiaryFormCallOut
      v-if="familyIdentification.length <= 1"
      class="fr-mx-n3v fr-mb-4w"
    />
    <BeneficiaryFormSection
      v-else
      section-title="Autres bénéficiaires du dossier"
    >
      <BeneficiaryFormFamilySituationMembers
        :family-identification="familyIdentification"
      />
    </BeneficiaryFormSection>
  </section>
</template>

<script setup lang="ts">
  import { BeneficiaryFileIdentification } from '~/types/beneficiary'

  import { routes } from '~/utils/routes'

  defineProps<{ familyIdentification: BeneficiaryFileIdentification[] }>()
</script>
