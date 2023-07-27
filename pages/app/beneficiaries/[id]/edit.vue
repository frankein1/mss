<template>
  <PageBeneficiaryEdit
    :beneficiary="beneficiary"
    :tax-households="taxHouseholds"
    :entourages="entourages"
    can-set-relatives
    can-set-referents
    can-set-health
    can-set-occupation-income
    can-set-external-organisations
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
        if (!authStore.isReceptionAgent) {
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

  const title = computed(() => RouteTitle.AppBeneficiaryEdit(beneficiary.value))

  useHead({ title })
</script>
