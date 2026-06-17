<template>
  <form
    novalidate
    @submit.prevent="onSubmit"
  >
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <p v-if="countStatus === 'pending'">Chargement…</p>

        <template v-else-if="count === 0">
          <p>Ce dispositif n'est pas utilisé et peut être supprimé.</p>
        </template>

        <template v-else>
          <AtomAlert
            class="fr-mb-2w"
            :alert-type="AlertType.Warning"
            message="Suppression irréversible"
          >
            <template #detailedMessage>
              <p>
                Ce dispositif est utilisé <strong>{{ count }}</strong> fois au
                sein de la structure. Les bénéficiaires, suivis, demandes d'aide
                et ateliers associés perdront cette référence.
              </p>
            </template>
          </AtomAlert>

          <div class="fr-checkbox-group">
            <input
              id="confirm-deletion"
              v-model="confirmed"
              type="checkbox"
              name="confirm-deletion"
            />
            <label
              class="fr-label"
              for="confirm-deletion"
            >
              Je comprends que cette action est irréversible
            </label>
          </div>
        </template>
      </div>

      <div class="fr-col-12">
        <ul
          class="fr-btns-group fr-btns-group--inline-md fr-btns-group--right fr-mt-2w"
        >
          <li>
            <button
              class="fr-btn fr-btn--secondary"
              type="button"
              @click="modal.close"
            >
              Annuler
            </button>
          </li>
          <li>
            <button
              class="fr-btn"
              type="submit"
              :disabled="(count !== 0 && !confirmed) || isSubmitting"
            >
              Supprimer
            </button>
          </li>
        </ul>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'

  const modal = useModal()
  const trpcClient = useTrpcClient()

  const props = defineProps<{
    id: string
    isSubmitting: boolean
    delete: () => void
  }>()

  const confirmed = ref(false)

  const { data: count, status: countStatus } =
    await trpcClient.supportProgram.countNameUsage.useQuery({ id: props.id })

  function onSubmit() {
    props.delete()
  }
</script>
