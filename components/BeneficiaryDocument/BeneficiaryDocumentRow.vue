<template>
  <tr>
    <td class="type-data">{{ documentTypeKeys.value(document.type) }}</td>

    <td class="name">
      <p>
        <span
          class="name-container"
          :title="document.name"
          >{{ document.name }}</span
        >
        <template v-if="familyFileIdentification.length > 1">
          <br />
          <span class="name-container">
            {{ formatBeneficiary(document.beneficiaryId) }}</span
          >
        </template>
      </p>
      <span
        v-if="document.confidential"
        class="fr-badge fr-badge--warning"
        >CONFIDENTIEL</span
      >
      <span
        v-if="hasUnreadNotifications"
        class="fr-badge fr-badge--new fr-badge--no-icon"
      >
        <span class="fr-icon-notification-3-fill fr-icon--sm fr-mr-1v"></span>
        NOUVEAU
      </span>
    </td>
    <td>{{ formatDate(document.created) }}</td>
    <td class="tags-data">
      <span
        v-if="document.tags.length"
        class="fr-tag"
        >{{ documentTagKeys.value(document.tags[0] as DocumentTag) }}</span
      >
      <span
        v-if="document.tags.length > 1"
        class="fr-tag fr-ml-1w"
        :title="
          document.tags
            .slice(1)
            .map(t => documentTagKeys.value(t as DocumentTag))
            .join(', ')
        "
        >+{{ document.tags.length - 1 }}</span
      >
    </td>
    <td>
      <ul class="fr-btns-group fr-btns-group--inline">
        <template v-if="permissions.view">
          <li>
            <button
              class="fr-btn fr-btn--tertiary-no-outline fr-icon-eye-line"
              title="Voir dans une nouvelle fenêtre"
              :aria-label="`Voir ${document.name} - Ouvre une nouvelle fenêtre`"
              @click="onView"
            >
              Voir
            </button>
          </li>
          <li>
            <a
              ref="downloadLink"
              target="_blank"
              :download="document.name"
              hidden
            />
            <button
              class="fr-btn fr-btn--tertiary-no-outline fr-icon-download-line"
              title="Télécharger"
              :aria-label="`Télécharger ${document.name}`"
              @click="onDownload"
            >
              Télécharger
            </button>
          </li>
        </template>
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
  import BeneficiaryDocumentEditForm from './BeneficiaryDocumentEditForm.vue'
  import { GetDocument } from './types'
  import { EditDocumentInput } from '~/server/schema'
  import { DocumentTag } from '~/types/document'
  import { DocumentEventAction, EventCategory } from '~/types/matomo'
  import { documentTypeKeys, documentTagKeys } from '~/client/options'
  import { DocumentPermissions } from '~/server/security'
  import { formatBeneficiaryShortenedName } from '~/utils/beneficiary/formatBeneficiaryShortenedName'
  import { BeneficiaryFileIdentification } from '~/types/beneficiary'

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

  const downloadLink = ref<HTMLLinkElement | null>(null)

  const hasUnreadNotifications = computed(
    () => !!props.document._count.notifications
  )

  const { download, open } = useDownload()

  function formatBeneficiary(beneficiaryId: string) {
    const selected = props.familyFileIdentification.filter(
      m => m.id === beneficiaryId
    )
    if (!selected.length) {
      return 'Non renseigné'
    }
    return formatBeneficiaryShortenedName(selected[0])
  }

  async function onView() {
    matomo.trackEvent(EventCategory.Document, DocumentEventAction.See)
    const data = await $fetch<Blob>(
      `/api/document/download?key=${props.document.key}`
    )
    open(data)
  }

  async function onDownload() {
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

  .name-container {
    word-break: break-word; // Allows to split dashed or underscored document names
    overflow: hidden;
    display: -webkit-box;
    height: 1rem;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  .type-data,
  .family-member-data,
  .tags-data {
    white-space: nowrap;
  }

  .fr-btns-group.fr-btns-group--inline {
    flex-wrap: initial;
  }

  .fr-btns-group .fr-btn {
    margin-bottom: 0;
  }

  .name > .fr-badge {
    margin-left: 0;
  }

  .name > .fr-badge ~ .fr-badge {
    margin-left: 0.5rem;
  }
</style>
