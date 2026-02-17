<template>
  <div class="minister-combobox">
    <ComboBox
      ref="comboboxRef"
      v-model="selectedMinister"
      :required="true"
      :label="followupFieldLabels.minister"
      :options="ministers"
      :format-display-value="displayName"
      :on-focus-header="onFocusHeader"
      @input="onSearchMinister"
      @select="onSelect"
    >
      <!-- HEADER -->
      <template #header>
        <ul
          ref="header"
          class="fr-tabs__list"
          :class="{
            focused: activeRow === -1
          }"
          @keydown="onHeaderKeydown"
        >
          <li role="presentation">
            <button
              id="header-button-01"
              type="button"
              tabindex="-1"
              class="fr-tabs__tab"
              :aria-selected="currentMinister"
              @click="currentMinister = true"
            >
              Ministres actuels
            </button>
          </li>
          <li>
            <button
              id="header-button-02"
              type="button"
              tabindex="-1"
              class="fr-tabs__tab"
              :class="{ 'fr-tabs__tab--secondary': currentMinister }"
              :aria-selected="!currentMinister"
              @click="currentMinister = false"
            >
              Ministres anciens
            </button>
          </li>
        </ul>
      </template>

      <template #default="{ option }">
        {{ displayName(option) }}
      </template>
    </ComboBox>
  </div>
</template>

<script lang="ts" setup>
  import { followupFieldLabels } from '~/client/labels'
  import type { MinisterOutput } from './types'
  import { formatMinisterName } from '~/utils/minister'
  import type { MinisterStatus } from '@prisma/client'

  const { initialMinisterId = undefined } = defineProps<{
    initialMinisterId?: string
  }>()
  const emit = defineEmits<{
    onSetMinisterId: [id: string]
  }>()

  const comboboxRef = useTemplateRef('comboboxRef')

  // Minister combobox
  const selectedMinister = ref<(MinisterOutput & { disabled: boolean }) | null>(
    null
  )

  const ministers = ref<(MinisterOutput & { disabled: boolean })[]>([])
  const currentMinister = ref(true)
  const inputQuery = ref<string | null>()
  const trpcClient = useTrpcClient()
  const { data, status, error } =
    await trpcClient.minister.getMinisters.useQuery()

  if (data) {
    ministers.value =
      data.value
        ?.filter(m =>
          currentMinister.value ? m.status === 'Current' : m.status === 'Former'
        )
        .map(minister => ({
          ...minister,
          disabled: false
        })) || []

    if (initialMinisterId && data.value) {
      const initialMinister = data.value.find(m => m.id === initialMinisterId)
      if (initialMinister) {
        selectedMinister.value = {
          firstName: initialMinister.firstName,
          lastName: initialMinister.lastName,
          id: initialMinister.id,
          disabled: false,
          function: initialMinister.function,
          government: initialMinister.government,
          status: initialMinister.status
        }
      }
    }
  }

  const initialMinisterList = computed(() => {
    return (
      data.value
        ?.filter(m =>
          currentMinister.value ? m.status === 'Current' : m.status === 'Former'
        )
        .map(minister => ({
          ...minister,
          disabled: false
        })) || []
    )
  })

  const onSearchMinister = (query: string) => {
    inputQuery.value = query
    ministers.value = filter(query, initialMinisterList.value)
  }

  const filter = (
    query: string,
    initialMinisterList: (MinisterOutput & { disabled: boolean })[]
  ) => {
    return initialMinisterList.filter(
      minister =>
        formatSearchPattern(minister.lastName.toLocaleLowerCase()).includes(
          formatSearchPattern(query.toLocaleLowerCase())
        ) ||
        formatSearchPattern(minister.firstName.toLocaleLowerCase()).includes(
          formatSearchPattern(query.toLocaleLowerCase())
        )
    )
  }

  const onSelect = (minister: MinisterOutput) => {
    ministers.value = []
    emit('onSetMinisterId', minister.id)
  }

  const displayName = (minister: MinisterOutput): string => {
    return formatMinisterName(minister)
  }

  watch(currentMinister, v => {
    const newList = initialMinisterList.value.filter(m =>
      v ? m.status === 'Current' : m.status === 'Former'
    )
    if (!inputQuery.value) {
      ministers.value = newList
    } else {
      ministers.value = filter(inputQuery.value, newList)
    }
  })
  // focus
  const header = ref<HTMLElement | null>(null)
  const onFocusHeader = () => {
    if (!header.value) {
      return
    }
    const buttons = getHeaderButtons(header.value)
    buttons[0]?.focus()
  }

  function getHeaderButtons(container: HTMLElement) {
    return Array.from(
      container.querySelectorAll<HTMLButtonElement>(
        'button[id^="header-button-"]'
      )
    )
  }

  const activeRow = ref<number>(-1)
  function onHeaderKeydown(e: KeyboardEvent) {
    if (comboboxRef.value && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      const row = comboboxRef.value.selectActiveRow(e)
      activeRow.value = row
    }

    if (e.key === 'Enter' && comboboxRef.value && activeRow.value >= 0) {
      const row = comboboxRef.value.selectActiveRow(e)
      activeRow.value = row
    }

    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
      return
    }
    // Focus on the next/previous button
    if (!header.value) {
      return
    }
    const buttons = getHeaderButtons(header.value)
    const currentIndex = buttons.indexOf(
      document.activeElement as HTMLButtonElement
    )
    if (currentIndex === -1) {
      return
    }
    e.preventDefault()
    const delta = e.key === 'ArrowRight' ? 1 : -1
    const nextIndex = (currentIndex + delta + buttons.length) % buttons.length
    buttons[nextIndex]?.focus()
  }

  watch(activeRow, () => {
    if (activeRow.value === -1) {
      header.value?.scrollIntoView({ block: 'nearest' })
    }
  })
</script>

<style scoped lang="scss">
  .fr-tabs__list {
    list-style-type: none;
    gap: 0.5rem;
    margin: 0.25rem 0;
    padding: 0;
    border-bottom: 1px solid var(--border-default-grey);

    &.focused {
      outline: dashed 1px rgb(0 0 0 / 100%);
    }

    li {
      flex: 1 1 0;
      padding: 0;

      button {
        justify-content: center;
        width: 100%;
      }
    }
  }

  .minister-combobox {
    :deep(.combobox-wrapper) {
      input.fr-select {
        box-shadow: inset 0 -2px 0 0 var(--border-plain-grey);
        filter: saturate(0);
      }
    }
  }
</style>
