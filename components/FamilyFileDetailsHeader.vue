<template>
  <div class="family-file-details-header">
    <p class="fr-tag fr-icon-group-line fr-tag--icon-left tag">Dossier foyer</p>
    <button
      class="fr-btn fr-btn--icon-left fr-icon-user-add-line edit-btn"
      data-fr-opened="false"
      aria-controls="global-modal"
      type="button"
      @click="$emit('openModal')"
    >
      Ajouter un membre au dossier
    </button>

    <PageTitle
      :title="prettyNames.spouses.join(' & ')"
      no-margin
      class="title"
    />

    <!-- TODO: create component -->
    <template v-if="prettyNames.other.length">
      <div
        v-for="(name, index) in prettyNames.other"
        :key="index"
        class="family-members"
      >
        <span
          class="fr-icon-user-line"
          aria-hidden="true"
        ></span>
        <p class="fr-text--bold">{{ name }}</p>
      </div>
    </template>
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
  .family-file-details-header {
    .family-members {
      display: flex;
      align-items: baseline;
      flex-wrap: nowrap;
      margin-top: 1rem;
      gap: 0.5rem;
      &::after {
        content: '·';
        font-weight: 400;
      }
      &:last-child {
        &::after {
          display: none;
        }
      }
    }
  }
</style>
