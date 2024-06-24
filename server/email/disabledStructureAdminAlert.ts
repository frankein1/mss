export function getDisabledStructureAdminAlert(name: string) {
  const text = `Bonjour,
  
La structure ${name} a été supprimé

L'équipe Mon Suivi Social`

  const html = `Bonjour,
<br/><br/>
La structure ${name} a été supprimé
<br/><br/>
<b>L'équipe Mon Suivi Social<b>`

  return { text, html }
}
