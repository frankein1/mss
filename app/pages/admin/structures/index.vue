<template>
  <PageContainer class="fr-p-5w">
    <PageTitle title="Structures" />
    <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--bottom">
      <div class="fr-col-12 fr-col-lg-8 fr-col-xl-9">
        <div class="fr-input-group">
          <label
            class="fr-label"
            for="search-strucuture"
          >
            Recherche une structure
            <span class="fr-hint-text">Par nom ou code postal</span>
          </label>
          <div class="fr-input-wrap fr-input-wrap--addon">
            <input
              id="search-strucuture"
              class="fr-input"
              aria-describedby="search-strucuture-messages"
              type="text"
              @change="onSearch"
            />
            <button
              type="submit"
              class="fr-btn"
            >
              Chercher
            </button>
          </div>

          <div
            id="search-strucuture-messages"
            class="fr-messages-group"
            aria-live="polite"
          ></div>
        </div>
      </div>

      <div class="fr-col-12 fr-col-lg-4 fr-col-xl-3">
        <button
          class="fr-btn fr-btn--icon-left fr-icon-add-line"
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
      :structures="structures"
    />
  </PageContainer>
</template>
<script lang="ts" setup>
  import StructureAdminInfoForm from '~/components/Structure/StructureAdminInfoForm.vue'
  import type { CreateStructureInput } from '~~/server/schema'
  import { routes } from '~/utils/routes'

  const trpcClient = useTrpcClient()

  const snackbar = useSnackbar()
  const modal = useModal()

  const search = ref<string>()
  const isSubmitting = ref(false)

  const queryInput = computed(() => ({
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
    modal.open(StructureAdminInfoForm, {
      title: "Création d'une structure",
      structure: undefined,
      validate: addStructure
    })
  }

  function addStructure(structure: CreateStructureInput) {
    useTrpcMutation({
      mutation: () => trpcClient.admin.createStructure.mutate(structure),
      isSubmitting,
      onSuccess: ({ id }) => {
        modal.close()
        navigateTo(routes.admin.AdminStructure.path(id))
      },
      onFailure: () => {
        snackbar.error("L'ajout de la structure a échoué.")
      }
    })
  }
</script>
