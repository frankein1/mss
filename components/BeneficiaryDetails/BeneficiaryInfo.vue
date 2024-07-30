<template>
  <div class="fr-grid-row fr-mt-1w">
    <div class="fr-col-12 fr-col-lg-6 fr-my-2w">
      <h2 class="title fr-h4 fr-mb-0">
        Informations
        {{
          beneficiary.general.firstName + ' ' + beneficiary.general.usualName
        }}
      </h2>
    </div>
    <div class="fr-col-12 fr-col-lg-6 detail-actions">
      <BeneficiaryDetailsActions
        class="actions"
        :beneficiary-id="beneficiary.id"
        :permissions="permissions"
        :family-file="familyFile"
        @toggle-delete="emit('toggleDelete')"
        @deleted="emit('deleted')"
        @split="emit('split')"
      />
    </div>
  </div>
  <BeneficiaryInfoSection
    id="header"
    title=""
  >
    <BeneficiaryInfoHeader :beneficiary="beneficiary" />
  </BeneficiaryInfoSection>
  <BeneficiaryInfoSection
    v-if="socialSupportSubjects.length"
    id="socialSupportSubjects"
    title=""
  >
    <BeneficiaryInfoSocialSupportSubjects
      :social-support-subjects="socialSupportSubjects"
    />
  </BeneficiaryInfoSection>

  <BeneficiaryInfoGeneral
    :beneficiary-id="beneficiary.id"
    :general="beneficiary.general"
  />

  <BeneficiaryInfoTaxHouseholds
    v-if="beneficiary.taxHouseholds"
    :beneficiary-id="beneficiary.id"
    :tax-households="beneficiary.taxHouseholds"
  />

  <BeneficiaryInfoEntourages
    v-if="beneficiary.entourages"
    :beneficiary-id="beneficiary.id"
    :entourages="beneficiary.entourages"
  />

  <BeneficiaryInfoHealth
    v-if="beneficiary.health"
    :beneficiary-id="beneficiary.id"
    :health="beneficiary.health"
  />

  <BeneficiaryInfoOccupationIncome
    v-if="beneficiary.occupationIncome"
    :beneficiary-id="beneficiary.id"
    :occupation-income="beneficiary.occupationIncome"
  />

  <BeneficiaryInfoExternalOrganisations
    v-if="beneficiary.externalOrganisations"
    :beneficiary-id="beneficiary.id"
    :external-organisations="beneficiary.externalOrganisations"
  />
</template>

<script lang="ts" setup>
  import { GetBeneficiaryOutput } from '~/types/beneficiary'
  import { SocialSupportSubjectIdAndName } from '~/types/socialSupportSubject'
  import { FamilyFilePermissions } from '~/server/security'

  defineProps<{
    beneficiary: GetBeneficiaryOutput
    socialSupportSubjects: SocialSupportSubjectIdAndName[]
    permissions: FamilyFilePermissions | undefined
    familyFile?: boolean
  }>()

  const emit = defineEmits<{ toggleDelete: []; deleted: []; split: [] }>()
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/module/media-query' as dsfr-media-query;

  .title {
    color: var(--primary);
    align-self: center;
  }

  .actions {
    @include dsfr-media-query.respond-from('lg') {
      justify-content: right;
    }
  }

  .detail-actions {
    margin-top: 1rem;

    @include dsfr-media-query.respond-from('lg') {
      margin-top: 0;
    }
  }
</style>
