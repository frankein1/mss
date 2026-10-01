<template>
  <AtomLoader
    v-if="status === 'pending'"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartition des réorientations n'ont pas pu être chargées."
  />
  <template v-if="followupsWithRedirections?.length">
    <StatsList
      :total-count="totalCount"
      :stats="followupsWithRedirections"
      :display-total="false"
      stats-bar
    />
    <hr />
    <StatsList
      v-if="beneficiariesWithRedirections?.length"
      caption="Bénéficiaires avec au moins une réorientation"
      :total-count="beneficiaryTotalCount"
      :stats="beneficiariesWithRedirections"
      :display-total="false"
      stats-bar
    />
    <hr />
    <p
      v-if="redirectionTypes.length"
      class="fr-text--xs text--muted"
    >
      <span
        :id="headingId"
        class="fr-text--bold text--uppercase"
        >Répartition des réorientations</span
      >
      <br />
      Pourcentage calculé sur le total de synthèses d’entretiens. Une synthèse
      d’entretien pouvant donner lieu à plusieurs réorientations, la somme des
      pourcentages peut être supérieure à 100&nbsp;%.
    </p>
    <StatsList
      :labelledby="headingId"
      :total-count="totalCount"
      :stats="redirectionTypes"
      :with-sum="false"
    />
  </template>
  <p v-else>
    Commencez à créer des synthèses d'entretien dans les fiches de bénéficiaires
    pour voir apparaître les statistiques de la répartition des réorientations.
  </p>
</template>

<script lang="ts" setup>
  import type { StatFilterInput } from '~~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { SupportColor } from '~~/client/colors/support'

  const props = defineProps<{
    totalCount: number
    beneficiaryTotalCount: number
    filters: StatFilterInput
  }>()

  const headingId = useId()

  const trpcClient = useTrpcClient()
  const { data, error, status } =
    await trpcClient.stat.getFollowupRedirectionsStats.useQuery(
      toRef(() => props.filters)
    )

  const followupsWithRedirections = computed(() => {
    return [
      {
        key: 'followupWithRedirections',
        label: 'Entretiens avec au moins une réorientation',
        color: SupportColor.followups,
        emphasis: true,
        count: data.value?.followupsWithRedirections._count || 0
      }
    ]
  })

  const beneficiariesWithRedirections = computed(() => {
    return [
      {
        key: 'beneficiariesWithRedirections',
        label: 'Bénéficiaires avec au moins une réorientation',
        color: SupportColor.followups,
        emphasis: true,
        count: data.value?.beneficiariesWithRedirections._count || 0,
        description:
          'Pourcentage calculé sur les bénéficiaires ayant au moins un entretien.'
      }
    ]
  })

  const redirectionTypes =
    computed(() => {
      const parters = data.value?.withTypeIsPartners.partners.map(partner => {
        return {
          key: partner.id,
          label: partner.name,
          color: SupportColor.followups,
          emphasis: false,
          count: partner._count
        }
      })
      const redirectionWithPartners = [
        {
          key: 'redirectionWithPartners',
          label: 'Redirections avec partenaire renseigné',
          color: SupportColor.followups,
          emphasis: true,
          count: data.value?.withTypeIsPartners._count || 0
        }
      ]
      parters
        ?.filter(p => p != null)
        .forEach(e => redirectionWithPartners.push(e))
      redirectionWithPartners.push(
        {
          key: 'withTypeIsIntern',
          label: 'Redirections internes',
          color: SupportColor.followups,
          emphasis: true,
          count: data.value?.withTypeIsIntern._count || 0
        },
        {
          key: 'withTypeIsOther',
          label: 'Autres redirections',
          color: SupportColor.followups,
          emphasis: true,
          count: data.value?.withTypeIsOther._count || 0
        }
      )
      return redirectionWithPartners
    }) || []
</script>
