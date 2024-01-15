<template>
  <div
    :id="collapseId"
    class="fr-collapse beneficiary-history-details-body"
  >
    <hr
      v-if="canViewHistoryDetails"
      class="fr-mb-1v"
    />

    <template v-if="canViewHistoryDetails">
      <BeneficiaryFollowupDetailsBodyMetas
        v-if="isFollowup && socialSupport.followup"
        :social-support="socialSupport"
        :followup="socialSupport.followup"
      />
      <BeneficiaryHelpRequestDetailsBodyMetas
        v-else-if="
          socialSupport.socialSupportType === 'HelpRequest' &&
          socialSupport.helpRequest
        "
        :social-support="socialSupport"
        :help-request="socialSupport.helpRequest"
      />

      <BeneficiaryHistoryDetailsBodyDocuments
        v-if="socialSupport.documents?.length"
        :documents="socialSupport.documents"
      />

      <template v-if="socialSupport.synthesis">
        <h3 class="synthesis-title">Compte rendu</h3>
        <p class="synthesis-content">{{ socialSupport.synthesis }}</p>
      </template>

      <template v-if="socialSupport.privateSynthesis">
        <h3 class="synthesis-title fr-icon-lock-line">Compte rendu privé</h3>
        <p class="synthesis-content">{{ socialSupport.privateSynthesis }}</p>
      </template>

      <ul
        class="fr-btns-group fr-btns-group--sm fr-btns-group--icon-left fr-btns-group--inline fr-btns-group--right"
      >
        <li v-if="canDelete">
          <button
            class="fr-btn fr-btn--secondary btn-delete fr-icon-delete-line"
            data-fr-opened="false"
            aria-controls="global-modal"
            type="button"
            @click="onDelete"
          >
            Supprimer
          </button>
        </li>
        <li v-if="canEdit">
          <NuxtLink
            :to="editLink"
            class="fr-btn fr-btn--secondary fr-icon-edit-line"
          >
            Modifier
          </NuxtLink>
        </li>
      </ul>

      <hr
        v-if="commentItems.length > 0"
        class="fr-pb-3v"
      />
    </template>

    <BeneficiaryHistoryComments
      :items="commentItems"
      :social-support="socialSupport"
      :beneficiary-permissions="beneficiaryPermissions"
      @comment-added="emit('refresh')"
      @comment-edited="emit('refresh')"
      @comment-deleted="emit('refresh')"
    />
  </div>
</template>

<script setup lang="ts">
  import type { SocialSupportItem } from './types'
  import BeneficiaryHistoryDeleteForm from './BeneficiaryHistoryDeleteForm.vue'
  import { RoutePath } from '~/utils/routing'
  import { BeneficiaryPermissions } from '~/server/security'

  const props = defineProps<{
    item: SocialSupportItem
    collapseId: string
    beneficiaryPermissions: BeneficiaryPermissions
  }>()

  const emit = defineEmits<{
    refresh: []
  }>()

  const socialSupport = computed(() => props.item.data)
  const permissions = computed(() => props.item.permissions)

  const isFollowup = computed(
    () => socialSupport.value.socialSupportType === 'Followup'
  )

  const commentItems = ref(socialSupport.value.comments || [])

  const editLink = computed(() => {
    const routeWithParams = isFollowup.value
      ? RoutePath.AppBeneficiaryFollowupEdit
      : RoutePath.AppBeneficiaryHelpRequestEdit
    return routeWithParams(
      socialSupport.value.beneficiaryId,
      socialSupport.value.id
    )
  })

  const canEdit = computed(() => permissions.value?.edit)

  const canDelete = computed(() => permissions.value?.delete)

  const canViewHistoryDetails = computed(() => permissions.value?.get.details)

  function onDelete() {
    useModal().open({
      title: isFollowup.value
        ? "Supprimer la synthèse d'entretien"
        : "Supprimer l'instruction de dossier",
      contentComponent: BeneficiaryHistoryDeleteForm,
      contentComponentProps: {
        historyItemId: socialSupport.value.id,
        isFollowup: isFollowup.value
      },
      contentComponentEvents: { deleted: onSocialSupportItemDeleted }
    })
  }

  function onSocialSupportItemDeleted() {
    emit('refresh')
    useSnackbar().success("L'accompagnement a été supprimé.")
  }
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/src/core/index' as dsfr;

  .beneficiary-history-details-body {
    --text-spacing: 0 0 1rem;

    border-radius: 0 0 0.5rem 0.5rem;

    &.fr-collapse--expanded {
      padding: 0.5rem 1.5rem 1rem;
    }
  }

  .synthesis-title {
    @include dsfr.text-style(md);

    margin-bottom: 0.5rem;
    color: var(--text-mention-grey);
    font-weight: 400;

    &::before {
      margin-right: 0.25rem;
    }
  }

  .synthesis-content {
    white-space: pre-line;
    font-weight: 500;
  }

  .btn-delete {
    box-shadow: inset 0 0 0 1px var(--red-marianne-main-472);
    color: var(--red-marianne-main-472);
  }
</style>

<style>
  .beneficiary-history-details-body .information-label {
    color: var(--text-mention-grey);
    font-weight: 400;
  }

  .beneficiary-history-details-body li {
    font-weight: 500;
  }
</style>
