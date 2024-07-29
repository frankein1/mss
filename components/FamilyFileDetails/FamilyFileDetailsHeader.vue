<template>
  <div class="family-file-details-header fr-grid-row fr-grid-row--gutters">
    <!-- ROW -->
    <div class="fr-col-12">
      <p class="fr-tag fr-icon-group-line fr-tag--icon-left tag">
        Dossier foyer
      </p>
    </div>
    <!-- ROW -->
    <div class="fr-col-12 fr-col-xl-8">
      <PageTitle
        :title="prettyNames.spouses.join(' & ')"
        no-margin
        class="title"
      />
    </div>
    <!-- ROW -->
    <div class="fr-col-12 fr-col-xl-4 btn-wrapper">
      <button
        class="fr-btn fr-btn--icon-left fr-icon-user-add-line edit-btn"
        data-fr-opened="false"
        aria-controls="global-modal"
        type="button"
        @click="$emit('openModal')"
      >
        Ajouter un membre au dossier
      </button>
    </div>
    <!-- ROW -->
    <div class="fr-col-12">
      <!-- TODO: create component -->
      <p v-if="prettyNames.other.length">
        <span
          v-for="(name, index) in prettyNames.other"
          :key="index"
          class="family-members"
        >
          <span
            class="fr-icon-user-line user-icon"
            aria-hidden="true"
          ></span>
          <span class="fr-text--bold">{{ name }}</span>
        </span>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { BeneficiaryFileIdentification } from '~/types/beneficiary'
  import { formatFamilyFileLabels } from '~/utils/familyFile'

  const props = defineProps<{
    title: string
    beneficiaries: BeneficiaryFileIdentification[]
  }>()

  defineEmits<{
    openModal: []
  }>()

  const prettyNames = computed(() =>
    formatFamilyFileLabels(props.beneficiaries)
  )
  console.log(prettyNames.value)
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/module/media-query' as dsfr-media-query;

  .family-file-details-header {
    .family-members {
      margin-top: 1rem;
      gap: 0.5rem;
      .user-icon::before {
        height: 1rem;
        width: 1rem;
        margin-right: 0.25rem;
        line-height: 1rem;
        transform: translateY(-3px);
      }
      &::after {
        content: '·';
        font-weight: 400;
        margin: 0 0.5rem;
      }
      &:last-child {
        &::after {
          display: none;
        }
      }
    }
    @include dsfr-media-query.respond-from('xl') {
      .btn-wrapper {
        text-align: end;
      }
    }
  }
</style>
