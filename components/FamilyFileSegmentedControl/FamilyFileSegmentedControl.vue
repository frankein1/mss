<template>
  <DsfrSegmentedSet
    class="fr-my-2w"
    :title-id="id"
    name="family-file-members"
    :inline="true"
    label="Fiche :"
    legend="Fiche :"
    :options
    :model-value="modelValue"
    @update:model-value="onChange"
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
      modelValue: string | number
    }>(),
    { id: getRandomId('seg-control') }
  )

  const emit = defineEmits<{
    (e: 'update:modelValue', payload: string): void
  }>()

  const options = computed(() =>
    props.members.map(m => ({
      label: formatBeneficiaryShortenedName(m),
      value: m.id
    }))
  )

  function onChange($event: string) {
    if ($event === props.modelValue) {
      return
    }

    emit('update:modelValue', $event)
  }
</script>
