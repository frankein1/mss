<template>
  <p class="fr-text--bold fr-text--lg fr-mb-0 fr-mt-4v">Réorientations</p>
  <ul class="information-list">
    <li
      v-for="redirection in redirections"
      :key="redirection.id"
    >
      <dl>
        <dt>{{ socialSupportRedirectionLabels.type }}&nbsp;:</dt>
        <dd>{{ socialSupportRedirectionTypeKeys.value(redirection.type) }}</dd>
        <div></div>
        <template v-if="redirection.partnerOrganization?.name">
          <dt>
            {{ socialSupportRedirectionLabels.partnerOrganizationId }}&nbsp;:
          </dt>
          <dd>{{ redirection.partnerOrganization.name }}</dd>
        </template>
        <div></div>
        <template v-if="redirection.partnerOrganizationContact?.name">
          <dt>
            {{
              socialSupportRedirectionLabels.partnerOrganizationContactId
            }}&nbsp;:
          </dt>
          <dd>{{ redirection.partnerOrganizationContact.name }}</dd>
        </template>
        <div></div>
        <template v-if="redirection.externalStructureName">
          <dt>
            {{ socialSupportRedirectionLabels.externalStructureName }}&nbsp;:
          </dt>
          <dd>{{ redirection.externalStructureName }}</dd>
        </template>
        <div></div>
      </dl>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import type { SocialSupportRedirectionsDetails } from './types'
  import { socialSupportRedirectionTypeKeys } from '~/client/options/redirection'
  import { socialSupportRedirectionLabels } from '~/client/labels/redirection.labels'

  defineProps<{
    redirections: SocialSupportRedirectionsDetails
  }>()
</script>
<style scoped lang="scss">
  ul {
    column-gap: 2rem;
    column-count: 2;

    li {
      break-inside: avoid;

      dt,
      dd {
        display: inline-block;
        margin: 0;
        padding-bottom: 0.25rem;
      }

      dd {
        margin-left: 0.25rem;
      }

      dt {
        color: var(--text-mention-grey);
        font-weight: 400;
      }
    }
  }
</style>
