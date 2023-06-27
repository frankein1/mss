<template>
  <div class="comment-form-section">
    <BeneficiaryHistoryCommentUserInitials
      class="fr-mr-3v"
      :user="currentUser"
    />
    <form
      ref="form"
      class="new-comment-form"
      @submit="onAddComment"
    >
      <VeeTextarea
        label="Nouveau commentaire"
        name="content"
        required
      >
        <template #hint>
          {{ SENSITIVE_DATA_HINT }}
        </template>
      </VeeTextarea>
      <ul
        class="fr-btns-group fr-btns-group--sm fr-btns-group--inline fr-btns-group--right"
      >
        <li>
          <button
            type="submit"
            class="fr-btn"
            :disabled="isSubmitting"
            :submitting="isSubmitting"
          >
            Ajouter
          </button>
        </li>
      </ul>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { HistoryItem, HistoryItemComment } from './types'
  import { SENSITIVE_DATA_HINT } from '~/utils/constants'
  import { useAuthStore } from '~/store/auth'
  import { AddCommentInput, addCommentSchema } from '~/server/schema'

  const authStore = useAuthStore()
  const snackbar = useSnackbar()
  const form = ref<HTMLFormElement | null>(null)

  const props = defineProps<{
    history: HistoryItem
  }>()

  const emit = defineEmits<{
    (e: 'commentAdded', comment: HistoryItemComment): void
  }>()

  const isSubmitting = ref(false)

  const { handleSubmit } = useForm<AddCommentInput>({
    validationSchema: toTypedSchema(addCommentSchema),
    initialValues: {
      beneficiaryId: props.history.beneficiaryId,
      historyId: props.history.id,
      isFollowup: props.history.isFollowup
    }
  })

  const currentUser = computed(() => authStore.getAuthUser)

  const onAddComment = handleSubmit(async values => {
    isSubmitting.value = true

    try {
      const comment = await useTrpcClient().comment.add.mutate(values)

      snackbar.success('Nouveau commentaire ajouté.', () =>
        form.value?.querySelector('textarea')?.focus()
      )
      form.value?.reset()
      emit('commentAdded', comment)
    } catch {
      snackbar.error("L'ajout du commentaire a échoué.", () =>
        form.value?.querySelector('textarea')?.focus()
      )
    } finally {
      isSubmitting.value = false
    }
  })
</script>

<style>
  .comment-form-section {
    display: flex;
  }

  .new-comment-form {
    width: 100%;
    margin-right: 4px; /* Allow to display right ouline of the comment textarea */
  }
</style>
