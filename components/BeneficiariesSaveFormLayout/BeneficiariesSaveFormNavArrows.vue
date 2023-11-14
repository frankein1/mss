<template>
  <BeneficiaryFormNavArrows
    :previous-page="previousPage"
    :next-page="nextPage"
    @save="emit('save', $event)"
  />
</template>

<script setup lang="ts">
  import {
    AppBeneficiariesSaveRoute,
    RoutePath,
    RouteTitle,
    getBeneficiariesSaveRouteNavArrows
  } from '~/utils/routing'

  const props = defineProps<{
    currentRoute: AppBeneficiariesSaveRoute
    draftId: string
  }>()

  const emit = defineEmits<{
    save: [target: string]
  }>()

  const user = useAuthUser()

  const navArrows = computed(() =>
    getBeneficiariesSaveRouteNavArrows(props.currentRoute, user.value, {
      structureId: user.value.structureId,
      referents: [user.value.id]
    })
  )

  const previousPage = computed(() => getPage(navArrows.value.previous))

  const nextPage = computed(() => getPage(navArrows.value.next))

  function getPage(route: AppBeneficiariesSaveRoute | undefined) {
    if (!route) {
      return undefined
    }

    return {
      title: RouteTitle[route](),
      path: RoutePath[route](props.draftId)
    }
  }
</script>
