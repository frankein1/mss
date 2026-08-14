<template>
  <DsfrSegmentedSet
    class="fr-my-2w"
    :title-id="id"
    name="family-file-members"
    :inline="true"
    legend="Fiche :"
    :options
    :model-value="modelValue"
    @update:model-value="onChange"
  />
</template>

<script setup lang="ts">
  import type { BeneficiaryFileIdentification } from '~~/types/beneficiary'
  import { formatBeneficiaryShortenedName } from '~/utils/beneficiary/formatBeneficiaryShortenedName'

  const {
    id = 'seg-control' + useId(),
    members,
    modelValue
  } = defineProps<{
    id?: string
    members: BeneficiaryFileIdentification[]
    modelValue: string
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', payload: string): void
  }>()

  const options = computed(() =>
    members.map(m => ({
      label: formatBeneficiaryShortenedName(m),
      value: m.id
    }))
  )

  function onChange($event: string | number) {
    if ($event === modelValue) {
      return
    }

    emit('update:modelValue', $event as string)
  }
</script>
