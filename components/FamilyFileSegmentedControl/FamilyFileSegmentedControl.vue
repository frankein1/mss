<template>
  <div class="segment fr-my-2w">
    <span class="fr-mr-2w">Fiche&nbsp;:</span>
    <DsfrSegmentedSet
      :title-id="id"
      name="family-file-members"
      :inline="true"
      label="Fiche :"
      legende="Fiche :"
      :options
      :model-value="modelValue"
      @update:model-value="$emit('onChange', $event)"
    />
  </div>
</template>

<script setup lang="ts">
  import { getRandomId } from '~/utils/random'
  import { BeneficiaryFileIdentification } from '~/types/beneficiary'
  import { formatBeneficiaryShortenedName } from '~/utils/beneficiary/formatBeneficiaryShortenedName'

  const props = withDefaults(
    defineProps<{
      id?: string
      members: BeneficiaryFileIdentification[]
      modelValue: string | number
    }>(),
    { id: getRandomId('seg-control') }
  )

  defineEmits<{
    (e: 'onChange', payload: string): void
  }>()

  const options = computed(() =>
    props.members.map(m => ({
      label: formatBeneficiaryShortenedName(m),
      value: m.id
    }))
  )
</script>
<style lang="scss" scoped>
  @use '@gouvfr/dsfr/module/media-query' as dsfr-media-query;
  .segment {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    justify-content: flex-start;
  }
</style>
