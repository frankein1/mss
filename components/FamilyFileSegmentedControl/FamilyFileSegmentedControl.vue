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
  import { toFirstLetterUpperCase } from '~/utils/toFirstLetterUpperCase'

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

  function formatName(member: BeneficiaryFileIdentification) {
    const firstname = member.firstName || 'non renseigné'
    const lastname = member.usualName || member.birthName || ''
    return `${toFirstLetterUpperCase(firstname)} ${lastname.substring(0, 1)}.`
  }

  const options = computed(() =>
    props.members.map(m => ({ label: formatName(m), value: m.id }))
  )
</script>
