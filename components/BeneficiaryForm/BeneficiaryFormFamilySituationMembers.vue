<template>
  <div class="fr-col-12">
    <template
      v-for="(item, index) in familyIdentification"
      :key="index"
    >
      <article
        v-if="item.id !== beneficiaryId"
        class="bffsm"
      >
        <span
          class="bffsm__icon fr-icon-user-line"
          aria-hidden="true"
        ></span>

        <div>
          <p class="fr-text--xl fr-text--bold fr-mb-1v">
            {{ formatBeneficiaryDisplayName(item) }}
          </p>
          <p class="fr-mb-0">
            {{ relativeRelationshipKeys.value(item.relationship) }}
          </p>
        </div>
      </article>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { relativeRelationshipKeys } from '~/client/options'
  import { BeneficiaryFileIdentification } from '~/types/beneficiary'
  defineProps<{ familyIdentification: BeneficiaryFileIdentification[] }>()

  const route = useRoute()

  const beneficiaryId = route.params.id as string
</script>

<style scoped>
  .bffsm {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
  }

  .bffsm:not(:last-of-type) {
    margin-bottom: 1rem;
  }

  .bffsm__icon {
    color: var(--primary);
    width: 24px;
    height: 24px;
  }
</style>
