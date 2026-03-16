<template>
  <RedirectionFormCustom
    v-for="(field, idx) in fields"
    :key="field.key"
    :index="idx"
    :partner-organization-options
    :partner-organizations
    @remove="remove(idx)"
  />
  <ul
    class="fr-btns-group fr-btns-group--left fr-btns-group--inline fr-btns-group--icon-left"
  >
    <li>
      <button
        class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-add-line fr-mb-0"
        type="button"
        @click="addRedirectionAndReplaceFocus"
      >
        Ajouter une redirection
      </button>
    </li>
  </ul>
</template>

<script lang="ts" setup>
  import type { SocialSupportRedirectionsInput } from '~/server/schema'
  import type { PartnerOrganizationIdName } from '~/types/partner'
  import { v4 } from 'uuid'

  const { partnerOrganizations, partnerOrganizationOptions } = defineProps<{
    partnerOrganizationOptions: Options
    partnerOrganizations: Array<PartnerOrganizationIdName>
  }>()

  const addRedirectionAndReplaceFocus = async () => {
    push({ id: v4() } as any)
    await nextTick()
    const wrappers = document.querySelectorAll('.redirection-wrapper')
    const lastWrapper = wrappers[wrappers.length - 1]
    lastWrapper
      ?.querySelector<HTMLElement>(
        'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
      )
      ?.focus()
  }

  const { fields, push, remove } =
    useFieldArray<SocialSupportRedirectionsInput>('socialSupportRedirections')
  if (fields.value.length === 0) {
    fields.value.push({ id: v4() } as any) // push first entry
  }
</script>
