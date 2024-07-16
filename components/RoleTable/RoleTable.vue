<template>
  <div
    class="table-container fr-collapse"
    tabindex="0"
  >
    <div class="fr-table fr-table--no-caption stripped-table">
      <table>
        <caption>
          Détails des rôles et habilitations
        </caption>
        <thead>
          <tr>
            <th scope="col">Fonctionnalité</th>
            <th scope="col">
              {{ nonAdminUserRoleKeys.byKey.StructureManager }}
            </th>
            <th scope="col">{{ nonAdminUserRoleKeys.byKey.SocialWorker }}</th>
            <th scope="col">{{ nonAdminUserRoleKeys.byKey.Instructor }}</th>
            <th scope="col">{{ nonAdminUserRoleKeys.byKey.ReceptionAgent }}</th>
            <th scope="col">{{ nonAdminUserRoleKeys.byKey.Referent }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Création et désactivation d'un utilisateur</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Accès à la liste des utilisateurs</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Changement du rôle d'un utilisateur</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Personnalisation de la structure</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              Vue des informations de la structure et des objets
              d'accompagnement
            </td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
          </tr>
          <tr>
            <td>Accès à la base de données bénéficiaires</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td>* les dossiers dont il est référent</td>
          </tr>
          <tr>
            <td>Création d'une fiche bénéficiaire</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
          </tr>
          <tr>
            <td>Consultation et modification d'une fiche bénéficiaire</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td>* informations générales</td>
            <td>* si il est référent</td>
          </tr>
          <tr>
            <td>Suppression d'une fiche bénéficiaire</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              Affectation ou retrait d'un agent référent sur une fiche
              bénéficiaire
            </td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td></td>
            <td>* si il est référent</td>
          </tr>
          <tr>
            <td>Export de la base de données bénéficiaires</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Ajout de documents</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td>* si il est référent</td>
          </tr>
          <tr>
            <td>Consultation et modification des documents</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td>* si ajoutés par lui</td>
            <td>* si il est référent</td>
          </tr>
          <tr>
            <td>Consultation et modification des documents confidentiels</td>
            <td>* si ajoutés par lui</td>
            <td>* si ajoutés par lui</td>
            <td>* si ajoutés par lui</td>
            <td>* si ajoutés par lui</td>
            <td>* si ajoutés par lui</td>
          </tr>
          <tr>
            <td>Suppression d'un document</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td></td>
            <td></td>
            <td>* si il est référent</td>
          </tr>
          <tr>
            <td>Création d'une synthèse d'entretien</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td>* si il est référent</td>
          </tr>
          <tr>
            <td>Aperçu de la synthèse d'entretien</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td>* si il est référent</td>
          </tr>
          <tr>
            <td>Voir le détail de la synthèse d'entretien</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td>* si créée par lui</td>
            <td>* si il est référent</td>
          </tr>
          <tr>
            <td>Modifier la synthèse d'entretien</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td>* si créée par lui</td>
            <td>* si créée par lui</td>
            <td>* si créée par lui</td>
            <td>* si créée par lui</td>
          </tr>
          <tr>
            <td>Ajouter un commentaire à la synthèse d'entretien</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td>* si il est référent</td>
          </tr>
          <tr>
            <td>Voir les commentaires de la synthèse d'entretien</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td>* si il est référent</td>
          </tr>
          <tr>
            <td>Supprimer une synthèse d'entretien</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td>* si créée par lui</td>
            <td>* si créée par lui</td>
            <td>* si créée par lui</td>
            <td>* si il est référent</td>
          </tr>
          <tr>
            <td>Imprimer une synthèse d'entretien</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td>* si créée par lui</td>
            <td>* si créée par lui</td>
            <td>* si il est référent</td>
          </tr>
          <tr>
            <td>Instruction d'un dossier</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td></td>
            <td>* si il est référent</td>
          </tr>
          <tr>
            <td>Aperçu de l'instruction de dossier</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td>* si il est référent</td>
          </tr>
          <tr>
            <td>Voir le détail de l'instruction de dossier</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td>* si créée par lui</td>
            <td></td>
            <td>* si il est référent</td>
          </tr>
          <tr>
            <td>Modifier l'instruction de dossier</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td>* si créée par lui</td>
            <td>* si créée par lui</td>
            <td></td>
            <td>* si créée par lui</td>
          </tr>
          <tr>
            <td>Ajouter un commentaire à l'instruction de dossier</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td>* si il est référent</td>
          </tr>
          <tr>
            <td>Voir les commentaires de l'instruction de dossier</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td>* si il est référent</td>
          </tr>
          <tr>
            <td>Supprimer l'instruction de dossier</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td>* si créée par lui</td>
            <td>* si créée par lui</td>
            <td></td>
            <td>* si il est référent</td>
          </tr>
          <tr>
            <td>Imprimer une synthèse d'instruction de dossier</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td>* si créée par lui</td>
            <td>* si créée par lui</td>
            <td>* si il est référent</td>
          </tr>
          <tr>
            <td>Accès au simulateur de droits sociaux</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
          </tr>
          <tr>
            <td>Accès à la page Accompagnements</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td>* les dossiers dont il est référent</td>
          </tr>
          <tr>
            <td>Exporter le tableau des accompagnements</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td></td>
            <td>* les dossiers dont il est référent</td>
          </tr>
          <tr>
            <td>Visualiser les statistiques</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
          </tr>
          <tr>
            <td>Exporter les statistiques</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td></td>
            <td>* les dossiers dont il est référent</td>
          </tr>
          <tr>
            <td>Annuaire des partenaires : créer et supprimer un organisme</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Voir et modifier un organisme partenaire</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
          </tr>
          <tr>
            <td>Module budget</td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class="fr-icon-check-line allowed-action-bg"></td>
            <td class=""></td>
            <td class="* les dossiers dont il est référent"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { nonAdminUserRoleKeys } from '~/client/options'
</script>

<style scoped>
  th:first-child,
  td:first-child {
    left: 0;
    position: sticky;
    z-index: 50;
    max-width: 14rem;
  }

  th:nth-child(2),
  td:nth-child(2) {
    max-width: 10rem;
  }

  td:not(:first-child) {
    text-align: center;
  }

  th:first-child,
  tr:nth-child(odd) td:first-child {
    background-color: white;
  }

  tr:nth-child(even) td:first-child {
    background-color: var(--background-contrast-grey);
  }

  .allowed-action-bg {
    background-color: var(--green-emeraude-main-632);
  }
</style>
