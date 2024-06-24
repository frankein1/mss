export function getInactiveStructureAlert() {
  const text = `Bonjour,

Après plusieurs mois d'inactivité sur votre espace de travail Mon suivi Social celui-ci va être supprimé ainsi que l'ensemble des données consignées si vous ne vous connectez pas dans les prochains jours.

Rendez-vous sur https://monsuivisocial.incubateur.anct.gouv.fr/auth/login pour consigner les informations de vos bénéficiaires et conserver les données déjà saisies.

Pour toute question, vous pouvez nous contacter par retour de mail.

Toute l'équipe de Mon Suivi social reste à votre disposition.

A bientôt,

L'équipe Mon Suivi Social`

  const html = `Bonjour,
<br/><br/>  
Après plusieurs mois d'inactivité sur votre espace de travail Mon suivi Social celui-ci va être supprimé ainsi que l'ensemble des données consignées si vous ne vous connectez pas dans les prochains jours.
<br/><br/>
Rendez-vous sur <a href="https://monsuivisocial.incubateur.anct.gouv.fr/auth/login">https://monsuivisocial.incubateur.anct.gouv.fr/auth/login</a> pour consigner les informations de vos bénéficiaires et conserver les données déjà saisies.
<br/><br/>
Pour toute question, vous pouvez nous contacter par retour de mail.
<br/><br/>
Toute l'équipe de Mon Suivi social reste à votre disposition.
<br/><br/>
A bientôt,
<br/><br/>
<b>L'équipe Mon Suivi Social</b>`

  return { text, html }
}
