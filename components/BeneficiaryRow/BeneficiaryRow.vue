<template>
  <NuxtLink
    v-slot="{ navigate }"
    custom
    :to="beneficiaryLink"
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
        {{ beneficiary.streetNumber }} {{ beneficiary.street }}
      </td>
      <td>{{ beneficiary.city }}</td>
      <td>{{ beneficiary.phone1 }}</td>
      <td class="follow-up-types-data">{{ followUpTypes }}</td>
      <td>{{ referents }}</td>
      <td>{{ beneficiaryStatusLabels[beneficiary.status] }}</td>
      <td>{{ readableFileNumber(beneficiary.id) }}</td>
    </tr>
  </NuxtLink>
</template>

<script lang="ts" setup>
  import type { BeneficiaryItem } from './types'
  import { formatDate } from '~/utils/formatDate'
  import { getUserDisplayName } from '~/utils/user'
  import {
    calculateAge,
    getBeneficiaryFollowUpTypes
  } from '~/utils/beneficiary'
  import { readableFileNumber } from '~/utils/readableFileNumber'
  import { ORIGIN_PAGE_PARAMETER } from '~/utils/constants'
  import { beneficiaryStatusLabels } from '~/client/options/beneficiary'
  import { nameOrEmpty } from '~/utils/nameOrEmpty'
  import { Routes } from '~/utils/routing/routes'

  const route = useRoute()

  const props = defineProps<{
    beneficiary: BeneficiaryItem
  }>()

  const beneficiaryLink = computed(() => {
    return {
      path: Routes.Beneficiary(props.beneficiary.id),
      query: {
        [ORIGIN_PAGE_PARAMETER]: route.path
      }
    }
  })

  const followUpTypes = computed(() =>
    getBeneficiaryFollowUpTypes(props.beneficiary)
      .map(({ name }) => name)
      .join(', ')
  )

  const referents = computed(() =>
    props.beneficiary.referents
      .map(referent => getUserDisplayName(referent))
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

  .follow-up-types-data {
    max-width: 25rem;
  }
</style>
