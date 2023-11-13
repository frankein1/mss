import { getInclusionConnectClient } from '~/server/lib'

export function getEmailContent() {
  const client = getInclusionConnectClient()
  const registrationUrl = client.getRegistrationUrl()

  const text = `Bonjour,

Votre espace Mon Suivi Social a bien été configuré. Voici les 3 étapes pour commencer à l'utiliser :

1- Créez votre compte. Afin d'accéder à votre espace avec cette présente adresse mail, vous devez vous créer un compte. Voici les étapes :
- Rendez-vous sur ce lien d'inscription à Mon Suivi Social : ${registrationUrl} ;
- Créez votre compte ;
- Un email de confirmation sera envoyé dans vos emails, pensez à vérifier dans vos spams et courriers indésirables.

Vous pourrez ainsi commencer à créer les fiches de vos bénéficiaires et consigner vos premiers éléments de suivi.

💡 Nous vous conseillons de créer un raccourci sur votre bureau (ainsi que vos collaborateurs) afin d'accéder plus facilement à votre espace de travail ! Regarder un court tutoriel pour créer son raccourci en 1 minute : https://mon-suivi-social.gitbook.io/mon-suivi-social/configuration-au-demarrage/se-connecter-a-mon-suivi-social-responsable-de-structure#creez-un-raccourci-sur-votre-bureau-dordinateur

2- Invitez votre équipe. Vous pouvez désormais inviter le reste de votre équipe à rejoindre votre espace de travail. Pour cela, vous pouvez vous rendre dans la page "Utilisateurs" (en cliquant sur votre nom en haut à droite) puis ajoutez les autres membres de votre structure.

Vous pourrez voir différents rôles qui autorisent ou contraignent l'accès à certaines informations. Toutes les étapes pour ajouter un utilisateur sur notre page dédiée : https://mon-suivi-social.gitbook.io/mon-suivi-social/configuration-au-demarrage/ajouter-un-agent

3- Trouvez de l'aide. Si vous rencontrez des difficultés sur la prise en main de l'outil, vous pouvez :
- Consulter notre documentation en ligne sur ce lien : https://mon-suivi-social.gitbook.io/mon-suivi-social/configuration-au-demarrage/se-connecter-a-mon-suivi-social-responsable-de-structure ;
- Nous écrire à  l'adresse mail de support : support@monsuivisocial.incubateur.anct.gouv.fr.

Bonne journée,
L'équipe Mon Suivi Social`

  const html = `Bonjour,
</br></br></br>
Votre espace Mon Suivi Social a bien été configuré. <b>Voici les 3 étapes pour commencer à l'utiliser :</b>
</br></br>
<b>1- Créez votre compte.</b> Afin d'accéder à votre espace avec cette présente adresse mail, vous devez vous créer un compte. Voici les étapes :
<ul>
<li>Rendez-vous sur ce lien : <a href="${registrationUrl}">inscription à Mon Suivi Social</a> ;</li>
<li>Créez votre compte ;</li>
<li>Un email de confirmation sera envoyé dans vos emails, pensez à vérifier dans vos spams et courriers indésirables.</li>
</ul>
Vous pourrez ainsi commencer à créer les fiches de vos bénéficiaires et consigner vos premiers éléments de suivi.
</br></br>
<em>💡 Nous vous conseillons de créer un raccourci sur votre bureau (ainsi que vos collaborateurs) afin d'accéder plus facilement à votre espace de travail ! <a href="https://mon-suivi-social.gitbook.io/mon-suivi-social/configuration-au-demarrage/se-connecter-a-mon-suivi-social-responsable-de-structure#creez-un-raccourci-sur-votre-bureau-dordinateur">Regarder un court tutoriel pour créer son raccourci en 1 minute</a></em>
</br></br>
<b>2- Invitez votre équipe.</b> Vous pouvez désormais inviter le reste de votre équipe à rejoindre votre espace de travail. Pour cela, vous pouvez vous rendre dans la page "Utilisateurs" (en cliquant sur votre nom en haut à droite) puis ajoutez les autres membres de votre structure.
</br></br>
<em>Vous pourrez voir différents rôles qui autorisent ou contraignent l'accès à certaines informations : <a href="https://mon-suivi-social.gitbook.io/mon-suivi-social/configuration-au-demarrage/ajouter-un-agent">toutes les étapes pour ajouter un utilisateur sur notre page dédiée</a> !</em>
</br></br>
<b>3- Trouvez de l'aide.</b> Si vous rencontrez des difficultés sur la prise en main de l'outil, vous pouvez :
<ul>
<li>Consulter notre documentation en ligne sur ce lien : <a href="https://mon-suivi-social.gitbook.io/mon-suivi-social/configuration-au-demarrage/se-connecter-a-mon-suivi-social-responsable-de-structure">lire la documentation et trouver mes réponses</a> ;
<li>Nous écrire à  l'adresse mail de support : support@monsuivisocial.incubateur.anct.gouv.fr.
</ul>
Bonne journée,
</br></br></br>
<b>L'équipe Mon Suivi Social<b>`

  return { text, html }
}
