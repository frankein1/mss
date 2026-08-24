<template>
  <div class="fr-grid-row fr-grid-row--gutters">
    <template v-if="supportPrograms.length">
      <div class="fr-col-12">
        <h5 class="fr-text--md fr-mb-0">Dispositifs ou axes d'intervention</h5>
      </div>

      <ul class="information-list fr-col-12">
        <li
          v-for="(supportProgram, index) in supportPrograms"
          :key="supportProgram.id"
        >
          <h6 class="fr-mb-1w fr-text--md">
            {{ index + 1 }}. {{ supportProgram.supportProgramName.name }}
          </h6>
          <p
            v-if="supportProgram.supportProgramName.hasLifecycle"
            class="fr-mb-1w"
          >
            <span
              class="fr-badge fr-badge--sm"
              :class="supportProgramStatusBadgeClass(supportProgram)"
            >
              {{ supportProgramStatus(supportProgram) }}
            </span>
            <span
              v-if="supportProgram.startDate || supportProgram.endDate"
              class="fr-ml-1w"
            >
              {{ formatSupportProgramDateRange(supportProgram) }}
            </span>
          </p>
          <BeneficiaryInfoLabel
            :label="supportProgramFieldLabels.partnerOrganisationIds"
            :value="
              supportProgram.partnerOrganisations.map(o => o.name).join(', ') ||
              undefined
            "
          />
          <BeneficiaryInfoLabel
            v-if="supportProgram.endDate"
            :label="supportProgramFieldLabels.exitReason"
            :value="supportProgram.exitReason ?? undefined"
          />
          <BeneficiaryInfoLabel
            v-if="supportProgram.outcome"
            :label="supportProgramFieldLabels.outcome"
            :value="supportProgramOutcomeKeys.byKey[supportProgram.outcome]"
          />
        </li>
      </ul>
    </template>
  </div>
</template>

<script setup lang="ts">
  import type { GetBeneficiarySupportPrograms } from '~~/types/beneficiary'
  import { supportProgramFieldLabels } from '~~/client/labels'
  import { supportProgramOutcomeKeys } from '~~/client/options'
  import {
    supportProgramStatus,
    formatSupportProgramDateRange
  } from '~/utils/beneficiary/supportProgramStatus'

  defineProps<{
    supportPrograms: GetBeneficiarySupportPrograms
  }>()

  type SupportProgram = GetBeneficiarySupportPrograms[number]

  function supportProgramStatusBadgeClass(program: SupportProgram) {
    const status = supportProgramStatus(program)
    if (status === 'En cours') {
      return 'fr-badge--success fr-badge--no-icon'
    }
    if (status === 'À venir') {
      return 'fr-badge--info fr-badge--no-icon'
    }
    return ''
  }
</script>
