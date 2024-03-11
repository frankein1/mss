<template>
  <BeneficiaryFormSection>
    <div class="fr-col-6">
      <VeeSelect
        name="status"
        :label="beneficiaryFieldLabels.status"
        :options="beneficiaryStatusOptions"
        required
      />
    </div>
    <div class="fr-col-6">
      <VeeMultiSelect
        name="referents"
        :label="beneficiaryFieldLabels.referents"
        :options="referentOptions"
        required
        dropdown
        :disabled-options="disabledReferentOptions"
      />
    </div>
    <div
      v-if="full"
      class="fr-col-12"
    >
      <VeeToggle
        :label="beneficiaryFieldLabels.aidantConnectAuthorized"
        name="aidantConnectAuthorized"
      />
    </div>

    <div
      v-if="full"
      class="fr-col-12"
    >
      <VeeToggle
        :label="beneficiaryFieldLabels.vulnerablePerson"
        name="vulnerablePerson"
      />
    </div>

    <div
      v-if="vulnerablePerson"
      class="fr-col-12"
    >
      <VeeSelect
        name="vulnerablePersonType"
        :label="beneficiaryFieldLabels.vulnerablePersonType"
        :options="beneficiaryVulnerablePersonTypeOptions"
      />
    </div>
  </BeneficiaryFormSection>
</template>

<script setup lang="ts">
  import { UserStatus } from '@prisma/client'
  import { beneficiaryFieldLabels } from '~/client/labels'
  import {
    beneficiaryStatusOptions,
    beneficiaryVulnerablePersonTypeOptions
  } from '~/client/options'
  import { SaveBeneficiaryGeneralInformationInput } from '~/server/schema'
  import { BeneficiaryReferent } from '~/types/beneficiary'
  import { BeneficiaryPermissions } from '~/server/security'

  const props = withDefaults(
    defineProps<{
      agents: BeneficiaryReferent[]
      beneficiary?: SaveBeneficiaryGeneralInformationInput
      permissions: BeneficiaryPermissions
      full?: boolean
    }>(),
    {
      beneficiary: undefined,
      full: false
    }
  )

  const referentOptions = computed(() => toOptions(props.agents, 'id', 'name'))

  const disabledReferentOptions = computed(() =>
    props.agents.reduce(
      (disabledOptions: string[], agent: BeneficiaryReferent) => {
        const disabledAgent = agent.status !== UserStatus.Active
        const agentIsBeneficiaryReferent = (
          props.beneficiary?.referents || []
        ).includes(agent.id)
        return disabledAgent && !agentIsBeneficiaryReferent
          ? [...disabledOptions, agent.id]
          : disabledOptions
      },
      []
    )
  )

  const { value: vulnerablePerson } = useField<boolean>('vulnerablePerson')
</script>
