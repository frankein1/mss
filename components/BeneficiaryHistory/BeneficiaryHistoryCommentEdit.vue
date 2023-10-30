<template>
  <form
    ref="form"
    novalidate
    class="comment-form"
    @submit.prevent="onEditComment"
  >
    <VeeTextarea
      label="Modifier le commentaire"
      name="content"
      no-label
    />
    <ul
      class="fr-btns-group fr-btns-group--sm fr-btns-group--inline fr-btns-group--left fr-btns-group--icon-left"
    >
      <li>
        <button
          type="submit"
          class="fr-btn"
          :disabled="isSubmitting"
          :submitting="isSubmitting"
        >
          Valider
        </button>
      </li>
      <li>
        <button
          type="button"
          class="fr-btn fr-btn--secondary"
          :disabled="isSubmitting"
          @click="emit('cancel')"
        >
          Annuler
        </button>
      </li>
      <li>
        <button
          type="button"
          class="fr-btn fr-btn--secondary fr-icon-delete-fill btn-delete"
          :disabled="isSubmitting"
          data-fr-opened="false"
          aria-controls="global-modal"
          @click="deleteConfirm"
        >
          Supprimer
        </button>
      </li>
    </ul>
  </form>
</template>

<script setup lang="ts">
  import BeneficiaryHistoryCommentDeleteConfirm from './BeneficiaryHistoryCommentDeleteConfirm.vue'
  import { HistoryItemComment } from './types'
  import { EditCommentInput, editCommentSchema } from '~/server/schema'

  const modal = useModal()
  const snackbar = useSnackbar()
  const form = ref<HTMLFormElement | null>(null)

  const props = defineProps<{
    comment: HistoryItemComment
  }>()

  const emit = defineEmits<{
    commentEdited: [comment: HistoryItemComment]
    commentDeleted: [comment: HistoryItemComment]
    cancel: []
  }>()

  const isSubmitting = ref(false)

  const { handleSubmit } = useForm<EditCommentInput>({
    validationSchema: toTypedSchema(editCommentSchema),
    initialValues: {
      commentId: props.comment.id,
      content: props.comment.content
    }
  })

  const onEditComment = handleSubmit(values => {
    useTrpcMutation({
      mutation: () => useTrpcClient().comment.edit.mutate(values),
      isSubmitting,
      onSuccess: comment => {
        snackbar.success(
          'Commentaire modifié.',
          () => form.value?.querySelector('textarea')?.focus()
        )
        form.value?.reset()
        emit('cancel')
        emit('commentEdited', comment)
      },
      onFailure: () => {
        snackbar.error(
          'La modification du commentaire a échoué.',
          () => form.value?.querySelector('textarea')?.focus()
        )
      }
    })
  })

  function deleteConfirm() {
    modal.open(
      'Confirmer la suppression du commentaire',
      BeneficiaryHistoryCommentDeleteConfirm,
      {},
      { delete: onDeleteComment }
    )
  }

  function onDeleteComment() {
    // TODO: trpc request to delete comment
    // TODO: delete comment from client-side history
    emit('commentDeleted', props.comment)
    useSnackbar().success('Le commentaire a été supprimé.')
  }
</script>

<style scoped>
  .btn-delete {
    box-shadow: none;
  }
</style>
