<template>
  <article
    v-if="false"
    class="feature-section ongoing-social-supports ongoing-social-supports__file-instructions"
  >
    <div class="ongoing-social-supports__header">
      <span
        class="ongoing-social-supports__icon fr-icon-questionnaire-line"
        aria-hidden="true"
      ></span>
      <h2 class="ongoing-social-supports__title">Rendez-vous à venir</h2>
    </div>
    <AtomAlert
      v-if="errorMessage"
      class="fr-mx-auto"
      :alert-type="AlertType.Error"
      :message="errorMessage"
    />
    <AtomLoader
      v-else-if="status === 'pending'"
      class="fr-mx-auto"
    />
    <ul
      v-else-if="data?.length"
      class="ongoing-social-supports__list"
    >
      <li
        v-for="ss in data"
        :key="ss.id"
      >
        <div class="fr-text--bold">{{ ss.beneficiaryName }}</div>
        <div>agent : {{ ss.agentName }}</div>
        <div>date : {{ formatDate(ss.date) }}</div>
        <div>lieu : {{ ss.place }}</div>
        <div>motif : {{ ss.subject }}</div>
        <div>statut : {{ appointmentStatusKeys.value(ss.status) }}</div>
        <NuxtLink
          :href="ss.url"
          target="_blank"
          external
          >Lien vers le rdv</NuxtLink
        >
      </li>
      <hr />
    </ul>
    <p
      v-else
      class="ongoing-social-supports__empty"
    >
      Vous n'avez pas de rendez-vous prévus
    </p>
  </article>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'
  import { appointmentStatusKeys } from '~/client/options'

  const { data, status, error } =
    await useTrpcClient().rdvsp.getAppointments.useQuery()

  const errorMessage = computed(() =>
    error.value ? "Les rendez-vous à venir n'ont pas pu être chargés." : ''
  )
</script>

<style scoped lang="scss">
  $section-padding: 1.5rem;

  .ongoing-social-supports__header {
    margin: -#{$section-padding} -#{$section-padding} 0;
    padding: $section-padding $section-padding 1rem;
    position: relative;
    margin-bottom: 2rem;

    > .ongoing-social-supports__icon {
      padding: 1.25rem;
      border-radius: 50%;
      border-width: 2px;
      background-color: var(--text-inverted-grey);
      border-style: solid;
      position: absolute;
      margin-top: -0.5rem;
    }

    > .ongoing-social-supports__title {
      --title-spacing: 0;

      font-size: 1.25rem;
      line-height: 2rem;
      font-weight: 700;
      margin-top: 0.25rem;
      margin-left: 5.5rem;
    }
  }

  .ongoing-social-supports__file-instructions {
    .ongoing-social-supports__header {
      background-color: var(--background-alt-purple-glycine);
    }

    .ongoing-social-supports__icon {
      border-color: var(--border-default-purple-glycine);
      color: var(--border-default-purple-glycine);
    }

    .ongoing-social-supports__title {
      color: var(--border-default-purple-glycine);
    }
  }

  .ongoing-social-supports__followups {
    .ongoing-social-supports__header {
      background-color: var(--background-alt-green-archipel);
    }

    .ongoing-social-supports__icon {
      border-color: var(--border-plain-green-archipel);
      color: var(--border-plain-green-archipel);
    }

    .ongoing-social-supports__title {
      color: var(--border-plain-green-archipel);
    }
  }

  .ongoing-social-supports__list {
    --ul-type: none;
    --ul-start: 0;
    --xl-block: 0;
    --li-bottom: 1.25rem;

    > :last-child {
      --li-bottom: 0;
    }
  }

  .ongoing-social-supports__empty {
    --text-spacing: 0;

    text-align: center;
  }
</style>
