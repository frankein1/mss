<template>
  <div>
    <hr />
    <section class="fr-accordion">
      <div class="fr-accordion__title">
        <button
          ref="expandBtn"
          class="fr-accordion__btn"
          aria-expanded="false"
          :aria-controls="usersActivityId"
          @click="onExpand"
        >
          Historique des changements
        </button>
      </div>
      <div
        :id="usersActivityId"
        class="fr-collapse"
      >
        <UsersActivityTable
          v-if="usersActivity"
          :users-activity="usersActivity"
          :route-with-params="routeWithParams"
          :has-next-page="hasNextPage"
          @next-page="onNextPage"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { GetBeneficiariesUsersActivityOutput } from '~/server/routers'
  import { RoutePath } from '~/utils/routing'
  import { EventCategory, UserActivityEventAction } from '~/types/matomo'

  const { matomo } = useMatomo()

  const PAGE_SIZE = 5

  const props = defineProps<{
    id?: string
    collection?: 'beneficiaries'
    /**
     * Used for the mutation logs of a collection
     * It defines the URL base to access the item within the application
     */
    routeWithParams?: typeof RoutePath.AppBeneficiary
  }>()

  const usersActivity = ref<GetBeneficiariesUsersActivityOutput['activity']>([])
  const page = ref(1)
  const expandBtn = ref<HTMLButtonElement | null>(null)

  const usersActivityId = computed(
    () => `users-activity-${props.id || props.collection}`
  )

  // FIXME: For now, trpc-nuxt does not allow to define query key, and their defined key is not based on the transform option
  const { data: usersActivityWithCount } = useAsyncData(loadUsersActivity)

  const count = computed(() => usersActivityWithCount.value?.count)

  const hasNextPage = computed(
    () => !!count.value && count.value > usersActivity.value.length
  )

  onMounted(() => {
    if (!usersActivityWithCount.value) {
      usersActivity.value = []
    } else {
      usersActivity.value = [...usersActivityWithCount.value.activity]
    }
  })

  async function loadUsersActivity() {
    if (props.collection) {
      return await loadCollectionUsersActivity(props.collection, page.value++)
    }
    return { activity: [], count: 0 }
  }

  function loadCollectionUsersActivity(
    collection: 'beneficiaries',
    page: number
  ) {
    return useTrpcClient().usersActivity[collection].query({
      perPage: PAGE_SIZE,
      page
    })
  }

  async function onNextPage() {
    const nextPage = await loadUsersActivity()
    usersActivity.value.push(...nextPage.activity)
  }

  function onExpand() {
    if (!expandBtn.value) {
      return
    }
    const isExpanded = expandBtn.value.getAttribute('aria-expanded') === 'true'
    if (!isExpanded) {
      matomo.trackEvent(
        EventCategory.UsersActivity,
        UserActivityEventAction.ExpandBeneficiaries
      )
    }
  }
</script>

<style lang="scss" scoped>
  @use '~/assets/style/variables' as *;

  $border-radius: 1.5rem;

  .fr-accordion {
    &::before {
      box-shadow: none;
      border: solid 1px var(--border-default-grey);
      border-radius: $border-radius;
    }

    .fr-accordion__btn {
      border-top-left-radius: $border-radius;
      border-top-right-radius: $border-radius;
      transition: border-radius 0.3s;
      color: $primary;

      &[aria-expanded='false'] {
        border-bottom-left-radius: $border-radius;
        border-bottom-right-radius: $border-radius;
      }
    }

    .fr-collapse {
      padding: 0;
      margin: 0;
    }
  }
</style>
