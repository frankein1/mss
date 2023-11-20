export function getWelcomeWorkshopEmailContent() {
  const text = `Bonjour,

Cela fait maintenant une semaine que vous avez rejoint votre espace de travail Mon Suivi Social. 🥳

Vous avez encore des questions ou des difficultés sur la prise en main de l'outil ? Pas de panique ! Nous organisons prochainement un webinaire "Premiers pas" pour les nouveaux utilisateurs. 🤓

Ce sera l'occasion de revoir ensemble les principales fonctionnalités de Mon Suivi Social et de répondre à toutes vos questions.

Pour y participer, il vous suffit de vous inscrire via ce formulaire : https://framaforms.org/inscription-webinaire-premiers-pas-sur-mon-suivi-social-1700152784.

A bientôt,

L'équipe Mon Suivi Social`

  const html = `Bonjour,
<br/><br/>
Cela fait maintenant une semaine que vous avez rejoint votre espace de travail Mon Suivi Social. 🥳
<br/><br/>
Vous avez encore des questions ou des difficultés sur la prise en main de l'outil ? Pas de panique ! Nous organisons prochainement un <b>webinaire "Premiers pas" pour les nouveaux utilisateurs</b>. 🤓
<br/><br/>
Ce sera l'occasion de revoir ensemble les principales fonctionnalités de Mon Suivi Social et de répondre à toutes vos questions.
<br/><br/>
Pour y participer, il vous suffit de vous inscrire via ce formulaire : <a href="https://framaforms.org/inscription-webinaire-premiers-pas-sur-mon-suivi-social-1700152784">Inscription webinaire premiers pas</a>.
<br/><br/>
A bientôt,
<br/><br/>
<b>L'équipe de Mon Suivi Social</b>`

  return { text, html }
}
