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
      <td>{{ formatTableValue(nameOrEmpty(beneficiary.firstName)) }}</td>
      <td>
        {{
          formatTableValue(
            beneficiary.birthDate
              ? formatDate(beneficiary.birthDate)
              : undefined
          )
        }}
      </td>
      <td>{{ formatTableValue(beneficiary.phone1) }}</td>
      <td class="address-data">
        <template v-if="beneficiary.street || addressCodeAndCity">
          {{ beneficiary.street }}
          <br v-if="beneficiary.street" />
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

  const addressCodeAndCity = computed(() =>
    [beneficiary.value.zipcode, beneficiary.value.city]
      .filter(v => !!v)
      .join(' ')
  )

  const followUpTypes = computed(() =>
    beneficiary.value.followupTypes.map(({ name }) => name).join(', ')
  )

  const lastName = computed(() => {
    if (beneficiary.value.usualName) {
      return beneficiary.value.usualName.toUpperCase()
    }
    if (beneficiary.value.birthName) {
      return `(${beneficiary.value.birthName.toUpperCase()})`
    }
    return nameOrEmpty(beneficiary.value.usualName)
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
