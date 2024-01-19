<template>
  <div>
    <p class="fr-mb-0">
      Composition du foyer fiscal renseigné dans le profil :
      <template v-if="!hasTaxHouseholds"
        >aucune information renseignée.</template
      >
    </p>
    <ul v-if="hasTaxHouseholds">
      <li v-if="familySituation">
        {{ familySituationLabels[familySituation] }}
      </li>
      <li v-if="minorChildren">{{ minorChildren }} enfant(s) mineur(s)</li>
      <li v-if="majorChildren">{{ majorChildren }} enfant(s) majeur(s)</li>
      <li v-if="otherMembersNb">
        {{ otherMembersNb }} autre(s) membre(s) du foyer fiscal
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { familySituationLabels } from '~/client/options'

  const props = defineProps<{
    beneficiaryId: string
  }>()

  const { data } = await useTrpcClient().beneficiary.getTaxHouseholds.useQuery({
    id: props.beneficiaryId
  })

  const familySituation = computed(() => data.value?.familySituation)
  const minorChildren = computed(() => data.value?.minorChildren)
  const majorChildren = computed(() => data.value?.majorChildren)

  const otherMembersNb = computed(
    () =>
      data.value?.taxHouseholds.filter(
        t =>
          t.relationship !== 'EnfantMajeur' && t.relationship !== 'EnfantMineur'
      ).length
  )

  const hasTaxHouseholds = computed(
    () =>
      familySituation.value ||
      minorChildren.value ||
      majorChildren.value ||
      otherMembersNb.value
  )
</script>
