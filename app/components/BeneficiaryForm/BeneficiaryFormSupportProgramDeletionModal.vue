<template>
  <form
    novalidate
    @submit.prevent="onSubmit"
  >
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <p v-if="status === 'pending'">Chargement…</p>

        <AtomAlert
          v-else-if="error"
          :alert-type="AlertType.Error"
          message="Les données permettant la suppression n'ont pas pu être chargées."
        />

        <template v-else-if="count === 0">
          <p>
            Ce dispositif ou axe d'intervention n'est lié à aucun accompagnement
            social et peut être supprimé.
          </p>
        </template>

        <template v-else>
          <AtomAlert
            class="fr-mb-2w"
            :alert-type="AlertType.Warning"
            message="Accompagnements existants liés au dispositif"
          >
            <template #detailedMessage>
              <p>
                Ce dispositif ou axe d'intervention est lié à
                <strong>{{ count }}</strong>
                {{
                  count === 1
                    ? 'accompagnement social'
                    : 'accompagnements sociaux'
                }}. En le supprimant,
                {{
                  count === 1
                    ? 'cet accompagnement perdra'
                    : 'ces accompagnements perdront'
                }}
                cette référence.
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
              Je comprends que ces accompagnements perdront le lien avec ce
              dispositif.
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
              class="fr-btn btn-delete-action"
              type="submit"
              :disabled="!!error || (count !== 0 && !confirmed)"
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
    supportProgramId: string
    remove: () => void
  }>()

  const confirmed = ref(false)

  const {
    data: count,
    status,
    error
  } = await trpcClient.supportProgram.countLinkedSocialSupports.useQuery({
    id: props.supportProgramId
  })

  function onSubmit() {
    props.remove()
    modal.close()
  }
</script>
