<template>
  <div class="landing-main-container fr-container fr-mt-5w">
    <h1 ref="heading">
      {{ routes.structure.AppStructureDora.title }}
    </h1>
    <AtomAlert
      v-if="!token"
      :alert-type="AlertType.Error"
      message="Impossible de charger la page. Veuillez réessayer plus tard."
    />
    <iframe
      v-else
      id="data-inclusion-frame"
      title="Recherche et résultats d’acteurs du territoire dans DORA"
      class="iframe-dora"
      :src="doraWidgetUrl"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
  import type { RouterOutput } from '~~/server/trpc/routers'
  import { BeneficiaryHistoryAction, EventCategory } from '~~/types/matomo'
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'

  onMounted(() => {
    useMatomo().trackEvent(
      EventCategory.History,
      BeneficiaryHistoryAction.SearchDoraStructure
    )
  })

  useHead({
    title: routes.structure.AppStructureDora.title
  })

  definePageMeta({
    layout: 'empty'
  })

  // Get structure info
  const structure = ref<
    RouterOutput['structure']['getStructure']['structure'] | undefined | null
  >(null)

  const trpcClient = useTrpcClient()
  const res = await trpcClient.structure.getStructure.query()
  structure.value = res.structure

  // Get commune code
  const getCodeCommune = async () => {
    const response = await fetch(
      `https://geo.api.gouv.fr/communes?codePostal=${structure.value?.zipcode}`
    )
    const data = (await response.json()) as {
      code: string
      population: number
    }[]
    if (data.length === 1) {
      return data[0]?.code
    }
    // municipality with the highest population
    return data.reduce((a, b) => (b.population > a.population ? b : a)).code
  }
  const { data: codeCommune } = await useAsyncData(getCodeCommune)

  // Config Dora widget url
  const config = useRuntimeConfig()
  const token = config.public.dataInclusion.token
  const doraWidgetUrl = computed(() => {
    const code_commune = codeCommune.value || '71014' // Autun fallback code
    const score_qualite_minimum = '0.8'
    return `https://api.data.inclusion.gouv.fr/widget?token=${token}&code_commune=${code_commune}&score_qualite_minimum=${score_qualite_minimum}&size=12`
  })
</script>

<style lang="scss" scoped>
  .iframe-dora {
    height: calc(100vh - 6rem);
    width: 100%;
  }
</style>
