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
      <td>{{ lastName }}</td>
      <td>{{ nameOrEmpty(beneficiary.firstName) }}</td>
      <td>
        {{
          beneficiary.birthDate ? formatDate(beneficiary.birthDate) : undefined
        }}
      </td>
      <td>{{ beneficiary.phone1 }}</td>
      <td class="address-data">
        {{ beneficiary.street }}
        <br v-if="beneficiary.street" />
        {{ addressCodeAndCity }}
      </td>
      <td class="followup-types-data">{{ followUpTypes }}</td>
    </tr>
  </NuxtLink>
</template>

<script lang="ts" setup>
  import type { BeneficiaryItem } from './types'
  import { formatDate } from '~/utils/formatDate'
  import { nameOrEmpty } from '~/utils/nameOrEmpty'
  import { RoutePath } from '~/utils/routing'

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
  .address-data {
    max-width: 15rem;
  }
</style>
