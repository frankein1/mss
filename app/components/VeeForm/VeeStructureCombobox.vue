<template>
  <ComboBox
    v-model="selectedStructure"
    :label
    :required
    :loading
    :options
    :format-display-value="formatOptionLine"
    :error
    @input="onSearch"
    @select="onSelect"
    @clear="onClear"
  >
    <template #default="{ option }">
      <span class="vee-structure-combobox__option-name">{{ option.name }}</span>
      <span class="vee-structure-combobox__option-meta">
        · {{ structureTypeLabel(option.type) }} · {{ option.city }} ·
        {{ option.zipcode }}
      </span>
    </template>
  </ComboBox>
</template>

<script setup lang="ts">
  import { useDebounceFn } from '@vueuse/core'
  import type { StructureType } from '@prisma/client'
  import { structureTypeKeys } from '~~/client/options'
  import { SEARCH_DEFER_MS, SEARCH_NUMBER_CHARACTERS } from '~/utils/constants'
  import type { StructureOption } from './types'

  const {
    label = 'Structure',
    name = 'structureId',
    required = false,
    excludeStructureId = undefined,
    initialSelection = undefined
  } = defineProps<{
    label?: string
    name?: string
    required?: boolean
    excludeStructureId?: string
    initialSelection?: StructureOption | null
  }>()

  const emit = defineEmits<{
    select: [structure: StructureOption]
    clear: []
  }>()

  const trpcClient = useTrpcClient()

  const { setValue, errorMessage: error } = useField<string | null>(name)

  const selectedStructure = ref<StructureOption | null>(
    initialSelection ?? null
  )
  const options = ref<StructureOption[]>([])
  const loading = ref(false)

  const structureTypeLabel = (type: StructureType) =>
    structureTypeKeys.value(type) ?? type

  const formatOptionLine = (option: StructureOption) =>
    `${option.name} · ${structureTypeLabel(option.type)} · ${option.city} · ${option.zipcode}`

  async function fetchStructures(search: string) {
    loading.value = true
    try {
      const res = await trpcClient.admin.getStructures.query(
        search ? { search } : undefined
      )
      options.value = res.structures
        .filter(s => s.id !== excludeStructureId)
        .map(s => ({
          id: s.id,
          name: s.name,
          type: s.type,
          city: s.city,
          zipcode: s.zipcode
        }))
    } finally {
      loading.value = false
    }
  }

  const debouncedFn = useDebounceFn((search: string) => {
    fetchStructures(search)
  }, SEARCH_DEFER_MS)

  function onSearch(search: string) {
    if (search.trim().length < SEARCH_NUMBER_CHARACTERS) {
      options.value = []
      return
    }
    debouncedFn(search.trim())
  }

  function onSelect(option: StructureOption) {
    setValue(option.id)
    emit('select', option)
  }

  function onClear() {
    setValue(null)
    emit('clear')
  }

  defineExpose({ selectedStructure })
</script>

<style scoped lang="scss">
  .vee-structure-combobox__option-name {
    font-weight: 600;
  }

  .vee-structure-combobox__option-meta {
    color: var(--text-mention-grey);
  }
</style>
