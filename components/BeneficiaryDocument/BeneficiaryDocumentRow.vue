<template>
  <tr>
    <td class="name">
      <p>
        <span
          class="name-link"
          :title="document.name"
        >
          {{ document.name }}
        </span>
      </p>
      <p class="name-subtitle">
        <span
          :class="documentTypeIcon"
          aria-hidden="true"
        ></span>
        {{ documentTypeKeys.value(document.type) }}
        <template v-if="familyFileIdentification.length > 1">
          · {{ formatBeneficiary(document.beneficiaryId) }}
        </template>
      </p>
      <p
        v-if="document.confidential"
        class="fr-badge fr-badge--warning fr-mb-0"
      >
        CONFIDENTIEL
      </p>
      <p
        v-if="hasUnreadNotifications"
        class="fr-badge fr-badge--new fr-badge--no-icon fr-mb-0"
      >
        <span class="fr-icon-notification-3-fill fr-icon--sm fr-mr-1v"></span>
        NOUVEAU
      </p>
      <p
        v-if="hasBeenOpened"
        class="fr-badge fr-badge--sm fr-badge--no-icon fr-mb-0"
      >
        CONSULTÉ
      </p>
    </td>
    <td>
      <template v-if="document.expirationDate">
        <p>{{ formatDate(document.expirationDate) }}</p>
        <p
          v-if="isExpired"
          class="fr-badge fr-badge--sm fr-badge--orange-terre-battue fr-badge--icon-left fr-icon-time-line"
        >
          EXPIRÉ
        </p>
      </template>
      <template v-else>—</template>
    </td>
    <td class="tags-data">
      <p
        v-if="document.tags.length"
        class="fr-tag"
      >
        {{ documentTagKeys.value(document.tags[0] as DocumentTag) }}
      </p>
      <p
        v-if="document.tags.length > 1"
        class="fr-tag fr-ml-1w"
        :title="
          document.tags
            .slice(1)
            .map(t => documentTagKeys.value(t as DocumentTag))
            .join(', ')
        "
      >
        +{{ document.tags.length - 1 }}
      </p>
    </td>
    <td>
      <p class="fr-mb-0">{{ formatDateToLocalTimezone(document.created) }}</p>
      <p
        v-if="createdByName"
        class="created-by fr-mb-0"
      >
        {{ createdByName }}
      </p>
    </td>
    <td>
      <ul class="fr-btns-group fr-btns-group--inline">
        <li v-if="permissions.view">
          <button
            v-if="isViewable"
            class="fr-btn fr-btn--tertiary-no-outline fr-icon-eye-line"
            title="Voir dans une nouvelle fenêtre"
            :aria-label="`Voir ${document.name} - Ouvre une nouvelle fenêtre`"
            :aria-describedby="!isViewable ? 'tooltip-not-viewable' : ''"
            @click="onView"
          >
            Voir
          </button>
          <template v-else>
            <button
              class="fr-btn fr-btn--tertiary-no-outline fr-btn--tooltip fr-icon-eye-line"
              title="Voir dans une nouvelle fenêtre"
              aria-describedby="tooltip-not-viewable"
            >
              Voir
            </button>
            <span
              id="tooltip-not-viewable"
              class="fr-tooltip fr-placement"
              role="tooltip"
              >Ce fichier ne peut pas être visualisé dans le navigateur
            </span>
          </template>
        </li>
        <li v-if="permissions.view">
          <button
            class="fr-btn fr-btn--tertiary-no-outline fr-icon-download-line"
            title="Télécharger"
            :aria-label="`Télécharger ${document.name}`"
            @click="onDownload"
          >
            Télécharger
          </button>
        </li>
        <li v-if="permissions.edit">
          <button
            class="fr-btn fr-btn--tertiary-no-outline fr-icon-pencil-line"
            data-fr-opened="false"
            aria-controls="global-modal"
            title="Modifier"
            :aria-label="`Modifier ${document.name}`"
            @click="onEdit"
          >
            Modifier
          </button>
        </li>
        <li v-if="permissions.delete">
          <button
            class="fr-btn fr-btn--tertiary-no-outline fr-icon-delete-line"
            title="Supprimer"
            :aria-label="`Supprimer ${document.name}`"
            @click="onDelete"
          >
            Supprimer
          </button>
        </li>
      </ul>
    </td>
  </tr>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs'
  import BeneficiaryDocumentEditForm from './BeneficiaryDocumentEditForm.vue'
  import type { GetDocument } from './types'
  import type { EditDocumentInput } from '~/server/schema'
  import type { DocumentTag } from '~/types/document'
  import { DocumentEventAction, EventCategory } from '~/types/matomo'
  import {
    documentTypeKeys,
    documentTypeIcons,
    documentTagKeys,
    viewableInBrowserTypes
  } from '~/client/options'
  import type { DocumentPermissions } from '~/server/security'
  import { formatBeneficiaryShortenedName } from '~/utils/beneficiary/formatBeneficiaryShortenedName'
  import type { BeneficiaryFileIdentification } from '~/types/beneficiary'
  import { formatUserDisplayName } from '~/utils/user/formatUserDisplayName'

  const modal = useModal()
  const matomo = useMatomo()
  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()

  const props = defineProps<{
    document: GetDocument
    familyFileIdentification: BeneficiaryFileIdentification[]
    permissions: DocumentPermissions
  }>()

  const emit = defineEmits<{
    updated: [document: GetDocument]
    deleted: []
  }>()

  const hasUnreadNotifications = computed(
    () => !!props.document._count.notifications
  )

  const isExpired = computed(
    () =>
      props.document.expirationDate &&
      dayjs(props.document.expirationDate).isBefore(dayjs(), 'day')
  )

  const documentTypeIcon = computed(
    () => documentTypeIcons[props.document.type]
  )

  const createdByName = computed(() => {
    const createdBy = props.document.createdBy
    if (!createdBy) {
      return null
    }
    return formatUserDisplayName(createdBy)
  })

  const isViewable = computed(() =>
    viewableInBrowserTypes.includes(props.document.mimeType)
  )

  const { download, open } = useDownload()

  function formatBeneficiary(beneficiaryId: string) {
    const selected = props.familyFileIdentification.filter(
      m => m.id === beneficiaryId
    )
    if (!selected[0]) {
      return 'Non renseigné'
    }
    return formatBeneficiaryShortenedName(selected[0])
  }

  const hasBeenOpened = ref(!!sessionStorage.getItem(props.document.key))

  async function onView() {
    sessionStorage.setItem(props.document.key, 'seen')
    hasBeenOpened.value = true
    matomo.trackEvent(EventCategory.Document, DocumentEventAction.See)
    const data = await $fetch<Blob>(
      `/api/document/download?key=${props.document.key}`
    )
    open(data)
  }

  async function onDownload() {
    sessionStorage.setItem(props.document.key, 'seen')
    hasBeenOpened.value = true
    matomo.trackEvent(EventCategory.Document, DocumentEventAction.Download)
    const data = await $fetch<Blob>(
      `/api/document/download?key=${props.document.key}`
    )
    download(data, props.document.name)
  }

  function onEdit() {
    matomo.trackEvent(EventCategory.Document, DocumentEventAction.Edit)
    modal.open(BeneficiaryDocumentEditForm, {
      title: 'Modifier le document',
      document: props.document,
      permissions: props.permissions,
      updateDocument: onUpdateDocument
    })
  }

  function onUpdateDocument(values: EditDocumentInput) {
    useTrpcMutation({
      mutation: () => trpcClient.documents.edit.mutate(values),
      onSuccess: document => {
        emit('updated', document)
        modal.close()
      },
      onFailure: () => {
        snackbar.error('La modification du document a échoué.')
      }
    })
  }

  function onDelete() {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      return
    }

    useTrpcMutation({
      mutation: () =>
        trpcClient.documents.delete.mutate({
          documentKey: props.document.key
        }),
      onSuccess: () => {
        emit('deleted')
      },
      onFailure: () => {
        snackbar.error('La suppression du document a échoué.')
      }
    })
  }
</script>

<style lang="scss" scoped>
  .name {
    p {
      font-size: 0.875rem;
      line-height: 1rem;
      margin-bottom: 0.5rem;
    }
  }

  .name-link {
    word-break: normal; // Allows to split dashed or underscored document names
    overflow-wrap: anywhere;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  .name-subtitle {
    color: var(--text-mention-grey);
    font-size: 0.75rem;
    line-height: 1rem;
  }

  .created-by {
    color: var(--text-mention-grey);
    font-size: 0.75rem;
    line-height: 1rem;
  }

  .tags-data {
    white-space: nowrap;
  }

  .fr-btns-group.fr-btns-group--inline {
    flex-wrap: initial;
  }

  .fr-btns-group .fr-btn {
    margin-bottom: 0;
    margin-right: 0.25rem;
    margin-left: 0.25rem;
  }

  .name > .fr-badge {
    margin-left: 0;
  }

  .name > .fr-badge ~ .fr-badge {
    margin-left: 0.5rem;
  }
</style>
