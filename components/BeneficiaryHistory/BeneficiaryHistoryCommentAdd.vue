<template>
  <div class="comment-form-section">
    <BeneficiaryHistoryCommentUserInitials
      v-if="currentUser"
      class="fr-mr-3v"
      :user="currentUser"
    />
    <form
      ref="form"
      novalidate
      class="comment-form"
      @submit.prevent="onAddComment"
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
            class="fr-btn"
            type="submit"
            :disabled="isSubmitting"
            :data-submitting="isSubmitting"
          >
            Ajouter
          </button>
        </li>
      </ul>
    </form>
  </div>
</template>

<script setup lang="ts">
  import type { SocialSupportDetailData, CommentItem } from './types'
  import { SENSITIVE_DATA_HINT } from '~/utils/constants'
  import type { AddCommentInput } from '~/server/schema'
  import { addCommentSchema } from '~/server/schema'

  const snackbar = useSnackbar()
  const form = ref<HTMLFormElement | null>(null)

  const props = defineProps<{
    socialSupport: SocialSupportDetailData
  }>()

  const emit = defineEmits<{
    commentAdded: [comment: CommentItem]
  }>()

  const isSubmitting = ref(false)

  const { handleSubmit } = useForm<AddCommentInput>({
    validationSchema: toTypedSchema(addCommentSchema),
    initialValues: {
      beneficiaryId: props.socialSupport.beneficiaryId,
      socialSupportId: props.socialSupport.id,
      isFollowup: props.socialSupport.socialSupportType === 'Followup'
    }
  })

  const { user: currentUser } = useAuthState()

  const onAddComment = handleSubmit(values => {
    useTrpcMutation({
      mutation: () => useTrpcClient().comment.add.mutate(values),
      isSubmitting,
      onSuccess: comment => {
        snackbar.success('Nouveau commentaire ajouté.', () =>
          form.value?.querySelector('textarea')?.focus()
        )
        form.value?.reset()
        emit('commentAdded', comment)
      },
      onFailure: () => {
        snackbar.error("L'ajout du commentaire a échoué.", () =>
          form.value?.querySelector('textarea')?.focus()
        )
      }
    })
  })
</script>

<style>
  .comment-form-section {
    display: flex;
  }
</style>
