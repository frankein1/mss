import { SUPPORT_EMAIL } from '~/utils/constants'

type TransferedUserEmailInput = {
  userDisplayName: string
  fromStructureName: string
  toStructureName: string
  newRoleLabel: string
}

export function getTransferedUserEmailContent({
  userDisplayName,
  fromStructureName,
  toStructureName,
  newRoleLabel
}: TransferedUserEmailInput) {
  const text = `Bonjour ${userDisplayName},

Votre compte Mon Suivi Social vient d'être transféré de la structure "${fromStructureName}" vers la structure "${toStructureName}", avec le rôle "${newRoleLabel}".

Lors de votre prochaine connexion, vous aurez accès aux données de votre nouvelle structure.

Si vous n'êtes pas à l'origine de cette demande de transfert, veuillez contacter l'équipe support de Mon Suivi Social : ${SUPPORT_EMAIL}.

L'équipe Mon Suivi Social`
  const html = `Bonjour ${userDisplayName},
<br/><br/>
Votre compte Mon Suivi Social vient d'être transféré de la structure <strong>${fromStructureName}</strong> vers la structure <strong>${toStructureName}</strong>, avec le rôle <strong>${newRoleLabel}</strong>.
<br/><br/>
Lors de votre prochaine connexion, vous aurez accès aux données de votre nouvelle structure.
<br/><br/>
Si vous n'êtes pas à l'origine de cette demande de transfert, veuillez contacter l'équipe support de Mon Suivi Social : <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.
<br/><br/>
L'équipe Mon Suivi Social`
  return { text, html }
}

type TargetStructureManagerEmailInput = {
  userDisplayName: string
  userEmail: string
  toStructureName: string
  newRoleLabel: string
}

export function getTargetStructureManagerTransferEmailContent({
  userDisplayName,
  userEmail,
  toStructureName,
  newRoleLabel
}: TargetStructureManagerEmailInput) {
  const text = `Bonjour,

L'utilisateur ${userDisplayName} (${userEmail}) vient d'être transféré vers votre structure "${toStructureName}" avec le rôle "${newRoleLabel}".

Il ou elle peut désormais accéder aux données de votre structure conformément aux permissions de ce rôle.

L'équipe Mon Suivi Social`
  const html = `Bonjour,
<br/><br/>
L'utilisateur <strong>${userDisplayName}</strong> (${userEmail}) vient d'être transféré vers votre structure <strong>${toStructureName}</strong> avec le rôle <strong>${newRoleLabel}</strong>.
<br/><br/>
Il ou elle peut désormais accéder aux données de votre structure conformément aux permissions de ce rôle.
<br/><br/>
L'équipe Mon Suivi Social`
  return { text, html }
}

type SupportTransferEmailInput = {
  userDisplayName: string
  userEmail: string
  fromStructureName: string
  toStructureName: string
  newRoleLabel: string
  adminDisplayName: string
  adminEmail: string
}

export function getSupportTransferEmailContent({
  userDisplayName,
  userEmail,
  fromStructureName,
  toStructureName,
  newRoleLabel,
  adminDisplayName,
  adminEmail
}: SupportTransferEmailInput) {
  const text = `Un transfert d'utilisateur vient d'être effectué sur Mon Suivi Social.

Utilisateur : ${userDisplayName} (${userEmail})
Structure d'origine : ${fromStructureName}
Structure de destination : ${toStructureName}
Nouveau rôle : ${newRoleLabel}
Administrateur : ${adminDisplayName} (${adminEmail})`
  const html = `Un transfert d'utilisateur vient d'être effectué sur Mon Suivi Social.
<br/><br/>
<ul>
<li><strong>Utilisateur</strong> : ${userDisplayName} (${userEmail})</li>
<li><strong>Structure d'origine</strong> : ${fromStructureName}</li>
<li><strong>Structure de destination</strong> : ${toStructureName}</li>
<li><strong>Nouveau rôle</strong> : ${newRoleLabel}</li>
<li><strong>Administrateur</strong> : ${adminDisplayName} (${adminEmail})</li>
</ul>`
  return { text, html }
}
