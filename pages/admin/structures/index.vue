<template>
  <div class="fr-p-2w">
    <div class="fr-grid-row">
      <div class="fr-col-8">
        <input
          class="fr-input"
          placeholder="nom, code postal"
          @change="onSearch"
        />
      </div>
      <div class="fr-col-3">
        <button
          class="fr-btn fr-btn--secondary"
          data-fr-opened="false"
          aria-controls="global-modal"
          title="Ajouter une structure"
          aria-label="Ajouter une structure"
          @click="onCreateStructure"
        >
          Ajouter une structure
        </button>
      </div>
    </div>
    <StructureTableAdmin
      v-show="!pending"
      v-model:sort="orderBy"
      :structures="structures"
      :pending="pending"
    />
  </div>
</template>
<script lang="ts" setup>
  import StructureAdminInfoForm from '~/components/Structure/StructureAdminInfoForm.vue'
  import { CreateStructureInput } from '~/server/schema'
  import { StructureAdminSort, SortOrder } from '~/types/table'
  import { RoutePath } from '~/utils/routing'

  const trpcClient = useTrpcClient()

  const snackbar = useSnackbar()
  const modal = useModal()

  const search = ref<string>()
  const orderBy = ref<StructureAdminSort>({
    beneficiaries: { _count: SortOrder.Desc }
  })
  const isSubmitting = ref(false)

  const queryInput = computed(() => ({
    orderBy: orderBy.value,
    search: search.value
  }))

  const { data, pending } =
    await trpcClient.admin.getStructures.useQuery(queryInput)

  const structures = computed(() => data.value?.structures || [])

  function onSearch(event: Event) {
    const input = event.target as HTMLInputElement
    const value = input.value.trim()
    search.value = value
  }

  const onCreateStructure = () => {
    modal.open({
      title: "Création d'une structure",
      contentComponent: StructureAdminInfoForm,
      contentComponentProps: { structure: undefined },
      contentComponentEvents: { validate: addStructure }
    })
  }

  function addStructure(structure: CreateStructureInput) {
    useTrpcMutation({
      mutation: () => trpcClient.admin.createStructure.mutate(structure),
      isSubmitting,
      onSuccess: ({ id }) => {
        modal.close()
        navigateTo(RoutePath.AdminStructure(id))
      },
      onFailure: () => {
        snackbar.error("L'ajout de la structure a échoué.")
      }
    })
  }
</script>
