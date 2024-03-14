<template>
  <BeneficiaryFormSection>
    <div class="fr-col-6">
      <VeeSelect
        name="status"
        :label="beneficiaryFieldLabels.status"
        :options="beneficiaryStatusKeys.options"
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
      class="fr-col-6"
    >
      <VeeCheckbox
        :label="beneficiaryFieldLabels.aidantConnectAuthorized"
        name="aidantConnectAuthorized"
      />
    </div>

    <div
      v-if="full"
      class="fr-col-6"
    >
      <VeeCheckbox
        :label="beneficiaryFieldLabels.vulnerablePerson"
        name="vulnerablePerson"
      />
    </div>
  </BeneficiaryFormSection>
</template>

<script setup lang="ts">
  import { UserStatus } from '@prisma/client'
  import { beneficiaryFieldLabels } from '~/client/labels'
  import { beneficiaryStatusKeys } from '~/client/options'
  import { BeneficiaryReferent } from '~/types/beneficiary'
  import { BeneficiaryPermissions } from '~/server/security'

  const props = withDefaults(
    defineProps<{
      agents: BeneficiaryReferent[]
      beneficiaryReferentIds?: String[]
      permissions: BeneficiaryPermissions
      full?: boolean
    }>(),
    {
      beneficiary: undefined,
      full: false,
      beneficiaryReferentIds: undefined
    }
  )

  const referentOptions = computed(() => toOptions(props.agents, 'id', 'name'))

  const disabledReferentOptions = computed(() =>
    props.agents.reduce(
      (disabledOptions: string[], agent: BeneficiaryReferent) => {
        const disabledAgent = agent.status !== UserStatus.Active
        const referentIds = props.beneficiaryReferentIds || []
        const agentIsBeneficiaryReferent = referentIds.includes(agent.id)
        return disabledAgent && !agentIsBeneficiaryReferent
          ? [...disabledOptions, agent.id]
          : disabledOptions
      },
      []
    )
  )
</script>
