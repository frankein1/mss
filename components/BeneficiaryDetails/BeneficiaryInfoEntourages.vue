<template>
  <BeneficiaryInfoSection
    v-if="hasEntourages"
    title="Entourage"
    :edit-link="editLink"
  >
    <div class="fr-container">
      <div class="fr-grid-row">
        <div
          v-for="(entourage, index) in entourages"
          :key="entourage.id"
          class="fr-col-12"
        >
          <hr
            v-if="index > 0"
            class="fr-col-12 fr-mt-5v"
          />
          <BeneficiaryInfoRelative :relative="entourage" />
        </div>
      </div>
    </div>
  </BeneficiaryInfoSection>
</template>

<script setup lang="ts">
  import { GetBeneficiaryOutput } from '~/server/routers'
  import { BeneficiaryRelativeWithLinkedBeneficiary } from '~/types/relative'
  import { RoutePath } from '~/utils/routing'

  const props = defineProps<{
    beneficiary: GetBeneficiaryOutput
    entourages: BeneficiaryRelativeWithLinkedBeneficiary[]
  }>()

  const hasEntourages = computed(() => props.entourages.length > 0)

  const editLink = computed(
    () => RoutePath.AppBeneficiaryEditInfo(props.beneficiary.id) // TODO: Update path
  )
</script>
