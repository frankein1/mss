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
      class="fr-btns-group fr-btns-group--sm fr-btns-group--inline fr-btns-group--left"
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
    </ul>
  </form>
</template>

<script setup lang="ts">
  import { HistoryItemComment } from './types'
  import { EditCommentInput, editCommentSchema } from '~/server/schema'

  const snackbar = useSnackbar()
  const form = ref<HTMLFormElement | null>(null)

  const props = defineProps<{
    comment: HistoryItemComment
  }>()

  const emit = defineEmits<{
    commentEdited: [comment: HistoryItemComment]
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
</script>
