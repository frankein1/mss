<template>
  <tr class="clickable-row">
    <th
      v-if="selectable"
      class="fr-cell--fixed"
      scope="row"
    >
      <div class="fr-checkbox-group fr-checkbox-group--sm">
        <input
          :id="`table-select-checkbox--${beneficiary.id}`"
          name="row-select"
          type="checkbox"
          :checked="selected"
          :disabled="disabled"
          @change="emit('toggle')"
        />
        <label
          class="fr-label"
          :for="`table-select-checkbox--${beneficiary.id}`"
        >
          <span class="fr-sr-only"
            >Sélectionner {{ beneficiary.firstName }} {{ lastName }}</span
          >
        </label>
      </div>
    </th>
    <td>
      <NuxtLink
        class="table-row-link"
        :to="
          routes.file.AppFile.path(beneficiary.familyFileId, {
            beneficiaryId: beneficiary.id
          })
        "
      >
        {{ formatTableValue(lastName) }}
      </NuxtLink>
    </td>
    <td>{{ formatTableValue(nameOrEmpty(beneficiary.firstName)) }}</td>
    <td>
      {{
        formatTableValue(
          beneficiary.birthDate ? formatDate(beneficiary.birthDate) : undefined
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
  </tr>
</template>

<script lang="ts" setup>
  import type { BeneficiaryListItem } from './types'
  import { EMPTY_TABLE_CELL } from '~/utils/constants'
  import { formatDate } from '~/utils/formatDate'
  import { nameOrEmpty } from '~/utils/nameOrEmpty'
  import { routes } from '~/utils/routes'
  import { formatTableValue } from '~/utils/table'

  const { beneficiary, selectable, selected, disabled } = defineProps<{
    beneficiary: BeneficiaryListItem
    selectable?: boolean
    selected?: boolean
    disabled?: boolean
  }>()

  const emit = defineEmits<{
    toggle: []
  }>()

  const addressCodeAndCity = computed(() =>
    [beneficiary.zipcode, beneficiary.city].filter(v => !!v).join(' ')
  )

  const lastName = computed(() => {
    if (beneficiary.usualName) {
      return beneficiary.usualName.toUpperCase()
    }
    if (beneficiary.birthName) {
      return `(${beneficiary.birthName.toUpperCase()})`
    }
    return nameOrEmpty(beneficiary.usualName)
  })
</script>

<style lang="scss" scoped>
  .address-data,
  .social-support-subjects-data {
    max-width: 15rem;
  }

  .fr-cell--fixed {
    position: relative;
    z-index: 1;
  }
</style>
