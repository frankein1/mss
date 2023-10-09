<template>
  <BeneficiaryFormNavArrows
    :previous-page="previousPage"
    :next-page="nextPage"
    @save="emit('save', $event)"
  />
</template>

<script setup lang="ts">
  import {
    SecurityTargetWithReferents,
    SecurityTargetWithStructure
  } from '~/server/security'
  import { useAuthStore } from '~/store/auth'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import {
    AppBeneficiaryEditRoute,
    getBeneficiaryEditRouteNavArrows,
    RouteTitle,
    RoutePath
  } from '~/utils/routing'

  const authStore = useAuthStore()

  const props = defineProps<{
    currentRoute: AppBeneficiaryEditRoute
    beneficiaryId: string
    originTab: BeneficiaryTab | undefined
    securityTarget: SecurityTargetWithReferents & SecurityTargetWithStructure
  }>()

  const emit = defineEmits<{
    save: [target: string]
  }>()

  const user = computed(() => authStore.getAuthUser)

  const navArrows = computed(() =>
    getBeneficiaryEditRouteNavArrows(
      props.currentRoute,
      user.value,
      props.securityTarget
    )
  )

  const previousPage = computed(() => getPage(navArrows.value.previous))

  const nextPage = computed(() => getPage(navArrows.value.next))

  function getPage(route: AppBeneficiaryEditRoute | undefined) {
    if (!route) {
      return undefined
    }

    return {
      title: RouteTitle[route](),
      path: RoutePath[route](props.beneficiaryId, {
        saved: true,
        originTab: props.originTab
      })
    }
  }
</script>
