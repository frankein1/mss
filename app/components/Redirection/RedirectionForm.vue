<template>
  <RedirectionFormCustom
    v-for="(field, idx) in fields"
    :key="field.key"
    :index="idx"
    :partner-organization-options
    :partner-organizations
    :redirection-reason-options="redirectionReasonOptions"
    @remove="remove(idx)"
  />
  <ul
    class="fr-btns-group fr-btns-group--left fr-btns-group--inline fr-btns-group--icon-left"
  >
    <li>
      <button
        class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-add-line fr-mb-0"
        type="button"
        @click="push({ id: randomUUID() } as any)"
      >
        Ajouter une redirection
      </button>
    </li>
  </ul>
</template>

<script lang="ts" setup>
  import type { SocialSupportRedirectionsInput } from '~~/server/schema'
  import type { PartnerOrganizationIdName } from '~~/types/partner'

  const randomUUID = () => crypto.randomUUID()

  const { partnerOrganizations, partnerOrganizationOptions } = defineProps<{
    partnerOrganizationOptions: Options
    partnerOrganizations: Array<PartnerOrganizationIdName>
  }>()

  // useFieldArray relies on Vue's inject and must run before any `await` in
  // this setup, otherwise the active component instance context is lost.
  const { fields, push, remove } =
    useFieldArray<SocialSupportRedirectionsInput>('socialSupportRedirections')
  if (fields.value.length === 0) {
    fields.value.push({ id: crypto.randomUUID() } as any) // push first entry
  }

  const { data: redirectionReasons } =
    await useTrpcClient().redirection.getRedirectionReasonList.useQuery()

  const redirectionReasonOptions: Ref<Options> = computed(
    () =>
      redirectionReasons.value?.map(({ name }) => ({
        label: name,
        value: name
      })) ?? []
  )
</script>
