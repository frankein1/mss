import { Minister } from '@prisma/client'

const ministerLabels = {
  [Minister.FrancoisBraun]: 'François Braun (Santé et Prévention)',
  [Minister.AgnesFirminLeBodo]: 'Agnès Firmin-Le Bodo (Santé et Prévention)',
  [Minister.JeanChristopheCombe]:
    'Jean-Christophe Combe (Solidarités, Autonomie et Personnes handicapées)',
  [Minister.GenevieveDarrieussecq]:
    'Geneviève Darrieussecq (Personnes handicapées)',
  [Minister.OlivierDussopt]:
    'Olivier Dussopt (Travail, Plein emploi et Insertion)',
  [Minister.CaroleGrandjean]:
    'Carole Grandjean (Enseignement, Formation professionnels)'
}

export { ministerLabels }
