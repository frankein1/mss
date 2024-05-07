<template>
  <div class="fr-container--fluid fr-p-2w">
    <div class="fr-grid-row">
      <div class="fr-col-12">
        <h1>Data Inclusion</h1>
      </div>

      <div class="fr-col-12">
        <h2>Import des structures</h2>
      </div>
      <div class="fr-col-12">
        <JobResultFiltersAdmin
          class="fr-px-5v fr-mt-2w"
          @filter="filters = $event"
        />

        <DsfrButtonGroup
          inline-layout-when="always"
          class="fr-btns-group--icon-left"
        >
          <li>
            <DsfrButton
              label="Mettre à jour les structures"
              type="button"
              :disabled="launching"
              @click="onLaunch"
            />
          </li>
          <li>
            <DsfrButton
              label="Rafraîchir le tableau"
              type="button"
              secondary
              :disabled="pending"
              icon="fr-icon-refresh-line"
              @click="refresh"
            />
          </li>
        </DsfrButtonGroup>

        <JobResultTableAdmin
          v-show="!pending"
          v-model:sort="orderBy"
          :jobs
          :pending
        />

        <AtomPagination
          v-show="!pending"
          class="fr-mt-4w fr-px-5v"
          :page
          :per-page="perPage"
          :total-pages="totalPages"
          @change-page="updatePagination($event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { JobResultAdminSort, SortOrder } from '~/types/table'
  import { REQUEST_LIMIT_DEFAULT } from '~/utils/constants'
  import type { JobResultAdminFilterInput } from '~/server/schema'

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const filters = ref<JobResultAdminFilterInput>({})
  const orderBy = ref<JobResultAdminSort>({ startDate: SortOrder.Desc })
  const page = ref(1)
  const perPage = ref(REQUEST_LIMIT_DEFAULT)

  const { updatePagination } = usePagination(page, perPage, filters)

  const queryInput = computed(() => ({
    filters: filters.value,
    orderBy: orderBy.value,
    page: page.value,
    perPage: perPage.value
  }))

  const { data, pending, refresh } =
    await trpcClient.admin.getJobResults.useQuery(queryInput)

  const jobs = computed(() => data.value?.jobs || [])

  const totalPages = computed(() => data.value?.totalPages || 0)

  const launching = ref(false)

  function onLaunch() {
    useTrpcMutation({
      mutation: () => trpcClient.admin.launchStructureImport.mutate(),
      isSubmitting: launching,
      onSuccess: launched => {
        if (launched) {
          snackbar.success("L'import de structure a démarré avec succès")
        } else {
          snackbar.info('Un import de structure est déjà en cours')
        }
      },
      onFailure: () => {
        snackbar.error("Echec de lancement de l'import de structure")
      }
    })
  }
</script>
