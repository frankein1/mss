<template>
  <BeneficiaryFormSection>
    <div class="fr-col-12 fr-col-lg-6">
      <VeeSelect
        name="status"
        :label="beneficiaryFieldLabels.status"
        :options="beneficiarystatusOptions"
        :disabled-options="[BeneficiaryStatus.Archived]"
        required
      />
      <div v-if="isDeceased">
        <VeeInput
          name="deathDate"
          :label="beneficiaryFieldLabels.deathDate"
          type="date"
        />
      </div>
    </div>
    <div class="fr-col-12 fr-col-lg-6">
      <MultiSelect
        name="referents"
        :label="beneficiaryFieldLabels.referents"
        :options="referentOptions"
        :disabled-options="disabledReferentOptions"
        required
      />
    </div>

    <div
      v-if="full"
      :class="
        application.module.vulnerablePerson
          ? 'fr-col-12 fr-col-md-6'
          : 'fr-col-12'
      "
    >
      <VeeCheckbox
        :label="beneficiaryFieldLabels.aidantConnectAuthorized"
        name="aidantConnectAuthorized"
      />
    </div>

    <div
      v-if="application.module.vulnerablePerson && full"
      :class="
        application.module.vulnerablePerson ? 'fr-col-12 fr-col-md-6' : ''
      "
    >
      <VeeCheckbox
        :label="beneficiaryFieldLabels.vulnerablePerson"
        name="vulnerablePerson"
      />
    </div>
  </BeneficiaryFormSection>
</template>

<script setup lang="ts">
  import { UserStatus, BeneficiaryStatus } from '@prisma/client'
  import { beneficiaryFieldLabels } from '~/client/labels'
  import { beneficiaryStatusKeys } from '~/client/options'
  import type { BeneficiaryReferent } from '~/types/beneficiary'

  const props = withDefaults(
    defineProps<{
      agents: BeneficiaryReferent[]
      beneficiaryReferentIds?: String[]
      full?: boolean
      initialBeneficiaryStatus?: BeneficiaryStatus
    }>(),
    {
      beneficiary: undefined,
      full: false,
      beneficiaryReferentIds: undefined,
      initialBeneficiaryStatus: undefined
    }
  )

  const { application } = usePermissions()
  const { value: status } = useField<BeneficiaryStatus>('status')

  const isDeceased = computed(() => status.value === BeneficiaryStatus.Deceased)
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

  const beneficiarystatusOptions = computed(() => {
    if (props.initialBeneficiaryStatus === BeneficiaryStatus.Archived) {
      return beneficiaryStatusKeys.options
    }
    return beneficiaryStatusKeys.options.filter(
      option => option.value !== BeneficiaryStatus.Archived
    )
  })
</script>
