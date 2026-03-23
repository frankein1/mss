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
  <template
    v-if="
      followupWithRedirections &&
      followupWithRedirections.length &&
      prescribingOrganizationStats &&
      prescribingOrganizationStats.length
    "
  >
    <StatsList
      :total-count="totalCount"
      :stats="followupWithRedirections"
      :display-total="false"
      stats-bar
    />

    <hr />
    <p class="fr-text--xs text--muted">
      <span class="fr-text--bold">RÉPARTITION DES RÉORIENTATIONS</span>
      <br />
      Pourcentage calculé sur le total de synthèses d’entretiens. Une synthèse
      d’entretien pouvant donner lieu à plusieurs réorientations, la somme des
      pourcentages peut être supérieure à 100&nbsp;%.
    </p>
    <StatsList
      :total-count="followupsWithRedirectionscount"
      :stats="prescribingOrganizationStats"
      :with-sum="false"
    />
  </template>
  <p v-else>
    Commencez à créer des synthèses d'entretien dans les fiches de bénéficiaires
    pour voir apparaître les statistiques de la répartition des réorientations.
  </p>
</template>

<script lang="ts" setup>
  import type { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { SupportColor } from '~/client/colors/support'

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const trpcClient = useTrpcClient()
  const { data, error, status } =
    await trpcClient.stat.getFollowupRedirectionsStats.useQuery(
      toRef(() => props.filters)
    )

  const followupsWithRedirectionscount = computed(
    () => data.value?.followupsWithRedirections._count || 0
  )

  const followupWithRedirections = computed(() => {
    const followupsWithRedirections =
      data.value?.followupsWithRedirections._count || 0
    return [
      {
        key: 'followupWithRedirections',
        label: 'Entretiens avec au moins une réorientation',
        color: SupportColor.followups,
        emphasis: true,
        count: followupsWithRedirections
      }
    ]
  })

  const prescribingOrganizationStats =
    computed(() => {
      const parters = data.value?.withTypeIsPartners.partners.map(partner => {
        return {
          key: partner.prescribingOrganizationId,
          label: partner.prescribingOrganization,
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
