<template>
  <NuxtLink
    v-slot="{ navigate }"
    custom
    :to="RoutePath.AppBeneficiary(props.beneficiary.id)"
    target="_self"
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
  import type { BeneficiaryItem } from './types'
  import { EMPTY_TABLE_CELL } from '~/utils/constants'
  import { formatDate } from '~/utils/formatDate'
  import { nameOrEmpty } from '~/utils/nameOrEmpty'
  import { RoutePath } from '~/utils/routing'
  import { formatTableValue } from '~/utils/table'

  const props = defineProps<{
    beneficiary: BeneficiaryItem
  }>()

  const addressCodeAndCity = computed(
    () =>
      (props.beneficiary.zipcode ? props.beneficiary.zipcode + ' ' : '') +
      (props.beneficiary.city ? props.beneficiary.city : '')
  )

  const followUpTypes = computed(() =>
    props.beneficiary.followupTypes.map(({ name }) => name).join(', ')
  )

  const lastName = computed(() => {
    if (props.beneficiary.usualName) {
      return props.beneficiary.usualName.toUpperCase()
    }
    if (props.beneficiary.birthName) {
      return `(${props.beneficiary.birthName.toUpperCase()})`
    }
    return nameOrEmpty(props.beneficiary.usualName)
  })
</script>

<style lang="scss" scoped>
  .address-data,
  .followup-types-data {
    max-width: 15rem;
  }

  .followup-types-data span {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* number of lines to show */
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
</style>
