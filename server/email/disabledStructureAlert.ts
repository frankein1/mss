export function getDisabledStructureAlert() {
  const text = `Bonjour,
  
Suite aux relances effectuées nous vous informons que votre espace de travail sur Mon Suivi Social  a été supprimé ainsi que l'ensemble des informations consignées.

Certaines données anonymisées alimentent les statistiques d'usage (https://monsuivisocial.dev.incubateur.anct.gouv.fr/statistiques) de Mon Suivi Social.

Nous restons à votre disposition pour davantage d'informations.

Cordialement,

L'équipe Mon Suivi Social`

  const html = `Bonjour,
<br/><br/>
Suite aux relances effectuées nous vous informons que votre espace de travail sur Mon Suivi Social  a été supprimé ainsi que l'ensemble des informations consignées.
<br/><br/>
Certaines données anonymisées alimentent <a href="https://monsuivisocial.dev.incubateur.anct.gouv.fr/statistiques">les statistiques d'usage</a> de Mon Suivi Social.
<br/><br/>
Nous restons à votre disposition pour davantage d'informations.
<br/><br/>
Cordialement,
<br/><br/>
<b>L'équipe Mon Suivi Social<b>`

  return { text, html }
}
