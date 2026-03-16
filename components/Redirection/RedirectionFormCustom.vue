<template>
  <div class="redirection-wrapper">
    <div class="form-header">
      <VeeRadioButtons
        :name="`socialSupportRedirections[${index}].type`"
        label="Réorienter vers"
        :class="{ 'fr-mb-0': selectedType == null }"
        :options="socialSupportRedirectionTypeKeys.options"
        @change-value="onChangeType($event)"
      />
    </div>
    <div class="form-items">
      <div
        v-if="selectedType === SocialSupportRedirectionType.Other"
        class="dora-link fr-mb-6v"
      >
        <img
          src="/assets/logos/dora-logo.svg"
          width="24px"
          height="24px"
          alt=""
        />
        <p class="fr-mb-0">
          <NuxtLink
            :to="`${routes.structure.AppStructureDora.path()}`"
            external
            target="_blank"
            class="fr-link"
            >Chercher un acteur du territoire sur DORA</NuxtLink
          >
        </p>
      </div>
      <VeeInput
        v-if="selectedType != null"
        :name="`socialSupportRedirections[${index}].motif`"
        label="Motif"
      />
      <VeeInput
        v-if="selectedType === SocialSupportRedirectionType.Other"
        :name="`socialSupportRedirections[${index}].externalStructureName`"
        label="Nom structure / personne"
        :hint="`Pour obtenir des statistiques sur le nom des structures, utilisez le champ : ${socialSupportRedirectionTypeKeys.byKey.PartnerOrganization}.`"
      />
      <div
        v-if="selectedType === SocialSupportRedirectionType.PartnerOrganization"
        class="fr-grid-row fr-grid-row--gutters form-grid fr-grid-row--bottom"
      >
        <div class="fr-col-12 fr-col-md-6">
          <VeeCombobox
            label="Nom de l'organisme"
            placeholder="Recherher l'organisme"
            :name="`socialSupportRedirections[${index}].partnerOrganizationId`"
            :options="withEmptyValue(partnerOrganizationOptions)"
            @change-value="onPrescribingOrganization"
          />
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <VeeSelect
            label="Contact de l'organisme"
            :name="`socialSupportRedirections[${index}].partnerOrganizationContactId`"
            :disabled="isDisabled(index)"
            :options="withEmptyValue(getContacts(index))"
          />
        </div>
      </div>
    </div>

    <div class="form-footer">
      <button
        type="button"
        class="fr-btn fr-icon-delete-bin-line fr-btn--secondary fr-mt-4v fr-mt-md-0 btn-delete-action"
        @click="$emit('remove')"
      >
        Supprimer la réorientation
      </button>
    </div>
    <hr class="fr-mt-3w" />
  </div>
</template>

<script lang="ts" setup>
  import { withEmptyValue } from '~/utils/options'
  import type { SocialSupportRedirectionsInput } from '~/server/schema'
  import { socialSupportRedirectionTypeKeys } from '~/client/options/redirection'
  import type { PartnerOrganizationIdName } from '~/types/partner'
  import { SocialSupportRedirectionType } from '@prisma/client'
  import { routes } from '~/utils/routes'

  const props = defineProps<{
    partnerOrganizationOptions: Options
    partnerOrganizations: Array<PartnerOrganizationIdName>
    index: number
  }>()
  defineEmits<{ remove: [] }>()

  const { value: type } = useField<string | null>(
    `socialSupportRedirections[${props.index}].type`
  )
  const selectedType = ref(type.value)
  const onChangeType = (type: string) => {
    selectedType.value = type
  }

  const { setValue: setPrescribingOrganizationContactId } = useField<
    string | null
  >('prescribingOrganizationContactId')

  const onPrescribingOrganization = (id: string) => {
    if (!id) {
      setPrescribingOrganizationContactId(null)
    }
  }

  const getContacts = (index: number) => {
    const { value: redirectionValue } =
      useFieldValue<SocialSupportRedirectionsInput>(
        `socialSupportRedirections[${index}]`
      )
    if (redirectionValue && redirectionValue.partnerOrganizationId) {
      const partnerOrganization = props.partnerOrganizations.find(
        organization =>
          organization.id === redirectionValue.partnerOrganizationId
      )
      if (partnerOrganization && partnerOrganization.contacts) {
        return toOptions(partnerOrganization.contacts, 'id', 'name')
      }
    }
    return [{ label: '', value: '' }]
  }

  const isDisabled = (index: number) => {
    const { value: redirectionValue } =
      useFieldValue<SocialSupportRedirectionsInput>(
        `socialSupportRedirections[${index}]`
      )
    if (redirectionValue && redirectionValue.partnerOrganizationId) {
      return false
    }
    return true
  }
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  // use grid layout to keep delete button lower in dom
  .redirection-wrapper {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: repeat(4, auto);

    .form-header {
      grid-area: 1 / 1 / 2 / 3;
    }

    .form-items {
      grid-area: 2 / 1 / 3 / 3;
    }

    .form-footer {
      grid-area: 3 / 1 / 4 / 3;
    }

    hr {
      grid-area: 4 / 1 / 5 / 3;
    }

    @include dsfr-media-query.respond-from('md') {
      .form-header {
        grid-area: 1 / 1 / 2 / 2;
      }

      .form-items {
        grid-area: 2 / 1 / 4 / 3;
      }

      .form-footer {
        grid-area: 1 / 2 / 2 / 3;
      }

      hr {
        grid-area: 4 / 1 / 5 / 3;
      }
    }
  }

  .dora-link {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
  }
</style>
