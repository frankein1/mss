<template>
  <tr class="clickable-row">
    <td>
      <NuxtLink
        class="table-row-link"
        :to="RoutePath.AppBeneficiary(beneficiary.id)"
      >
        {{ formatTableValue(lastName) }}
      </NuxtLink>
    </td>
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
    <!-- <td
      class="social-support-subjects-data"
      :title="formatTableValue(socialSupportSubjects)"
    >
      <span>{{ formatTableValue(socialSupportSubjects) }}</span>
    </td> -->
  </tr>
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
  // const history = computed(() => beneficiary.value.history)

  const addressCodeAndCity = computed(() =>
    [general.value.zipcode, general.value.city].filter(v => !!v).join(' ')
  )

  // const socialSupportSubjects = computed(() =>
  //   history.value.subjects.map(({ name }) => name).join(', ')
  // )

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
  .social-support-subjects-data {
    max-width: 15rem;
  }
</style>
