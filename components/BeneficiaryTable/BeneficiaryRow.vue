<template>
  <NuxtLink
    v-slot="{ navigate }"
    custom
    :to="RoutePath.AppBeneficiary(beneficiary.id)"
  >
    <tr
      class="clickable-row"
      @click="navigate"
    >
      <td>{{ formatTableValue(lastName) }}</td>
      <td>{{ formatTableValue(nameOrEmpty(general.firstName)) }}</td>
      <td>
        {{
          formatTableValue(
            general.birthDate ? formatDate(general.birthDate) : undefined
          )
        }}
      </td>
      <td>{{ formatTableValue(general.phone1) }}</td>
      <td class="address-data">
        <template v-if="general.street || addressCodeAndCity">
          {{ general.street }}
          <br v-if="general.street" />
          {{ addressCodeAndCity }}
        </template>
        <template v-else>{{ EMPTY_TABLE_CELL }}</template>
      </td>
      <td
        class="followup-types-data"
        :title="formatTableValue(followUpTypes)"
      >
        <span>{{ formatTableValue(followUpTypes) }}</span>
      </td>
    </tr>
  </NuxtLink>
</template>

<script lang="ts" setup>
  import type { BeneficiaryPageItem } from './types'
  import { EMPTY_TABLE_CELL } from '~/utils/constants'
  import { formatDate } from '~/utils/formatDate'
  import { nameOrEmpty } from '~/utils/nameOrEmpty'
  import { RoutePath } from '~/utils/routing'
  import { formatTableValue } from '~/utils/table'

  const props = defineProps<{
    item: BeneficiaryPageItem
  }>()

  const beneficiary = computed(() => props.item.beneficiary)
  const general = computed(() => beneficiary.value.general)
  const history = computed(() => beneficiary.value.history)

  const addressCodeAndCity = computed(() =>
    [general.value.zipcode, general.value.city].filter(v => !!v).join(' ')
  )

  const followUpTypes = computed(() =>
    history.value.types.map(({ name }) => name).join(', ')
  )

  const lastName = computed(() => {
    if (general.value.usualName) {
      return general.value.usualName.toUpperCase()
    }
    if (general.value.birthName) {
      return `(${general.value.birthName.toUpperCase()})`
    }
    return nameOrEmpty(general.value.usualName)
  })
</script>

<style lang="scss" scoped>
  .address-data,
  .followup-types-data {
    max-width: 15rem;
  }

  .followup-types-data > * {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* number of lines to show */
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
</style>
