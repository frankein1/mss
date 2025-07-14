<template>
  <!-- Alert + Loader -->
  <AtomAlert
    v-if="error"
    :alert-type="AlertType.Error"
    message="Le nombre total de bénéficiaires n'a pas pu être chargé."
  />
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <WorkshopListEmpty
    v-if="workshopList.length === 0"
    :period
  />
  <template v-else>
    <p>{{ data?.count }} ateliers à venir</p>
    <ul class="workshop-list">
      <li
        v-for="month in groupAndSortWorkshops(
          workshopList,
          period != FilterWorkshopPeriod.Past
        )"
        :key="month[0]"
      >
        <p class="workshop-month">{{ month[0] }}</p>
        <ul class="workshop-list">
          <li
            v-for="workshop in month[1]"
            :key="workshop.id"
          >
            <WorkshopListItem :workshop="workshop" />
          </li>
        </ul>
      </li>
    </ul>

    <AtomPagination
      class="fr-mt-4w fr-px-5v"
      :page="page"
      :per-page="perPage"
      :total-pages="totalPages"
      @change-page="updatePagination($event)"
    />
  </template>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'
  import { WORKSHOPS_REQUEST_LIMIT_DEFAULT } from '~/utils/constants'
  import { WorkshopsPageItems } from './types'
  import { FilterWorkshopPeriod } from '~/utils/constants/filters'

  const page = ref(1)
  const perPage = ref(WORKSHOPS_REQUEST_LIMIT_DEFAULT)

  const props = withDefaults(
    defineProps<{
      period?: FilterWorkshopPeriod
    }>(),
    { period: FilterWorkshopPeriod.Future }
  )

  const totalPages = computed(() => data.value?.totalPages || 0)
  // @ts-expect-error // FIXME: will be fixed with filters
  const { updatePagination } = usePagination(page, perPage, null)

  const queryInput = computed(() => ({
    page: page.value,
    perPage: perPage.value,
    filter: {
      period: props.period
    }
  }))

  const getWorkshopList = async () => {
    const trpcClient = useTrpcClient()
    const { data, pending, error } =
      await trpcClient.workshop.getPage.useQuery(queryInput)

    return { pending, error, data }
  }
  const { pending, error, data } = await getWorkshopList()

  const workshopList: ComputedRef<WorkshopsPageItems> = computed(
    () => data.value?.items || []
  )

  function groupAndSortWorkshops(
    workshops: WorkshopsPageItems,
    asc: boolean
  ): Map<string, typeof workshops> {
    const months = [
      'janvier',
      'février',
      'mars',
      'avril',
      'mai',
      'juin',
      'juillet',
      'août',
      'septembre',
      'octobre',
      'novembre',
      'décembre'
    ]

    // Regroupement par mois/année avec clé technique "YYYY-MM"
    const tempGroups: Record<
      string,
      { label: string; items: typeof workshops }
    > = {}

    for (const workshop of workshops) {
      const date = workshop.date
      const year = date.getFullYear()
      const monthIndex = date.getMonth()
      const key = `${year}-${String(monthIndex + 1).padStart(2, '0')}` // ex: "2025-03"
      const label = `${months[monthIndex]} ${year}` // ex: "mars 2025"

      if (!tempGroups[key]) {
        tempGroups[key] = { label, items: [] }
      }

      tempGroups[key].items.push(workshop)
    }

    // Trie les groupes par date (YYYY-MM)
    const sortedKeys = Object.keys(tempGroups).sort((a, b) =>
      asc ? a.localeCompare(b) : b.localeCompare(a)
    )
    // Trie interne de chaque groupe, puis remplissage de la Map finale
    const result = new Map<string, typeof workshops>()
    for (const key of sortedKeys) {
      const group = tempGroups[key]
      group.items.sort((a, b) => a.date.getTime() - b.date.getTime())
      result.set(group.label, group.items)
    }

    return result
  }
</script>

<style scoped lang="scss">
  .workshop-list {
    --ul-start: 0;
    --xl-block: 0;
    --ul-type: none;
  }

  .workshop-month {
    font-size: 1.25rem;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }
</style>
