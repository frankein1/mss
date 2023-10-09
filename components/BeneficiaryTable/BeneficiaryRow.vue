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
        <template v-if="beneficiary.birthDate">
          {{ calculateAge(beneficiary.birthDate) }} ans
        </template>
      </td>
      <td>
        {{
          beneficiary.birthDate ? formatDate(beneficiary.birthDate) : undefined
        }}
      </td>
      <td class="address-data">
        {{ beneficiary.street }}
      </td>
      <td>{{ beneficiary.city }}</td>
      <td>{{ beneficiary.phone1 }}</td>
      <td class="followup-types-data">{{ followUpTypes }}</td>
      <td>{{ referents }}</td>
      <td>{{ beneficiaryStatusLabels[beneficiary.status] }}</td>
      <td>{{ readableFileNumber(beneficiary.id) }}</td>
    </tr>
  </NuxtLink>
</template>

<script lang="ts" setup>
  import type { BeneficiaryItem } from './types'
  import { formatDate } from '~/utils/formatDate'
  import { formatUserDisplayName } from '~/utils/user'
  import { calculateAge } from '~/utils/beneficiary'
  import { readableFileNumber } from '~/utils/readableFileNumber'
  import { beneficiaryStatusLabels } from '~/client/options/beneficiary'
  import { nameOrEmpty } from '~/utils/nameOrEmpty'
  import { RoutePath } from '~/utils/routing'

  const props = defineProps<{
    beneficiary: BeneficiaryItem
  }>()

  const followUpTypes = computed(() =>
    props.beneficiary.followupTypes.map(({ name }) => name).join(', ')
  )

  const referents = computed(() =>
    props.beneficiary.referents
      .map(referent => formatUserDisplayName(referent))
      .join(', ')
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
