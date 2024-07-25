<template>
  <DsfrSegmentedSet
    :title-id="id"
    name="family-file-members"
    label="Fiche :"
    legende="Fiche :"
    :options
    @update:model-value="$emit('onChange', $event)"
  />
</template>

<script setup lang="ts">
  import { getRandomId } from '~/utils/random'
  import { BeneficiaryFileIdentification } from '~/types/beneficiary'
  import { formatBeneficiaryShortenedName } from '~/utils/beneficiary/formatBeneficiaryShortenedName'

  const props = withDefaults(
    defineProps<{
      id?: string
      members: BeneficiaryFileIdentification[]
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
