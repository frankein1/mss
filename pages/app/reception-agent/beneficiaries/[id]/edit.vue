<template>
  <PageBeneficiaryEdit
    :beneficiary="beneficiary"
    :tax-households="taxHouseholds"
    :entourages="entourages"
  />
</template>

<script lang="ts" setup>
  import { RoutePath, RouteTitle } from '~/utils/routing'
  import { useAuthStore } from '~/store/auth'

  definePageMeta({
    middleware: [
      'is-beneficiary-referent',
      to => {
        const authStore = useAuthStore()
        if (authStore.isReceptionAgent) {
          return
        }
        return navigateTo(
          RoutePath.AppBeneficiaryEdit(
            authStore.userRole,
            to.params.id as string
          )
        )
      }
    ]
  })

  const route = useRoute()
  const beneficiaryId = route.params.id as string
  const trpcClient = useTrpcClient()

  const { data } = await trpcClient.beneficiary.getBeneficiaryDetails.useQuery({
    id: beneficiaryId
  })

  const beneficiary = computed(() => data.value?.beneficiary || null)
  const taxHouseholds = computed(() => data.value?.taxHouseholds || [])
  const entourages = computed(() => data.value?.entourages || [])

  useHead({
    title: RouteTitle.AppBeneficiaryEdit(beneficiary.value)
  })
</script>
