import { AgeLimitCondition, PrismaClient } from '@prisma/client'
import {
  fixtureStructures,
  fixturesPartnerOrganizations,
  fixturesUsers
} from './fixtures'

const prismaClient = new PrismaClient()

const structureId = fixtureStructures[0].id

const getRandomPartnerOrganizationId = () => {
  const index = Math.floor(Math.random() * fixturesPartnerOrganizations.length)
  if (!fixturesPartnerOrganizations[index]) {
    throw new Error('workshop: wrong index')
  }
  return fixturesPartnerOrganizations[index].id
}

const getRandomDate = () => {
  const start = new Date('2024-01-01')
  const end = new Date('2026-12-30')
  const randomTime =
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  return new Date(randomTime)
}
export const workshopInputs = [
  {
    structureId,
    date: getRandomDate(),
    startTime: '14:00',
    endTime: '16:00',
    location: 'Atelier des Beaux-Arts',
    partnerOrganizationId: getRandomPartnerOrganizationId(),
    host: 'Élise Vernet',
    sessionName: 'L’œil et la main',
    description: 'Matériel fourni sur place',
    attendeeLimit: 10,
    ageLimit: 13,
    ageLimitCondition: AgeLimitCondition.GreaterThan
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '10:00',
    endTime: '12:00',
    location: 'Fablab Junior',
    partnerOrganizationId: getRandomPartnerOrganizationId(),
    host: 'Kevin Lahlou',
    sessionName: 'Découverte des capteurs',
    description: 'Pour enfants curieux de 8 à 12 ans',
    attendeeLimit: 12,
    ageLimit: 8,
    ageLimitCondition: AgeLimitCondition.GreaterThan
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '15:00',
    endTime: '17:00',
    location: 'Mercerie La Bobine',
    partnerOrganizationId: getRandomPartnerOrganizationId(),
    host: 'Madame Lili Couture',
    sessionName: 'Premiers points à la machine',
    description: 'Apportez tissu et fil si possible',
    attendeeLimit: 6,
    ageLimit: 16,
    ageLimitCondition: AgeLimitCondition.GreaterThan
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '18:00',
    endTime: '19:00',
    location: 'Studio Calme Intérieur',
    partnerOrganizationId: getRandomPartnerOrganizationId(),
    host: 'Jean-Baptiste Sarrault',
    sessionName: 'Présence et respiration',
    description: 'Chaises et coussins fournis',
    attendeeLimit: 20,
    ageLimit: 18,
    ageLimitCondition: AgeLimitCondition.GreaterThan
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '14:30',
    endTime: '16:00',
    location: 'Salle d’animation de la MJC',
    host: 'Keiko Nakamura',
    description: 'Papier fourni'
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '16:00',
    endTime: '18:00',
    location: 'Maison de quartier du Nord',
    host: 'Laura Benedetti',
    description: 'Venez avec votre téléphone',
    attendeeLimit: 14,
    ageLimit: 15,
    ageLimitCondition: AgeLimitCondition.GreaterThan
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '17:00',
    endTime: '18:30',
    location: 'Salle du Monde',
    partnerOrganizationId: getRandomPartnerOrganizationId(),
    host: 'Tamba Diarra',
    sessionName: 'Expression et rythme',
    description: 'Tenue fluide recommandée',
    attendeeLimit: 18,
    ageLimit: 70,
    ageLimitCondition: AgeLimitCondition.LowerThan
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '10:30',
    endTime: '12:30',
    location: 'Atelier Terre & Forme',
    partnerOrganizationId: getRandomPartnerOrganizationId(),
    host: 'François Moinet',
    sessionName: 'Modelage libre',
    description: 'Vêtements qui ne craignent rien',
    attendeeLimit: 8,
    ageLimit: 17,
    ageLimitCondition: AgeLimitCondition.GreaterThan
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '21:00',
    endTime: '23:00',
    location: 'Observatoire du Mont d’Or',
    partnerOrganizationId: getRandomPartnerOrganizationId(),
    host: 'Stéphanie Delaunay',
    sessionName: 'Balade céleste',
    description: 'Lunettes d’observation fournies',
    attendeeLimit: 25,
    ageLimit: 10,
    ageLimitCondition: AgeLimitCondition.GreaterThan
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '16:00',
    endTime: '18:00',
    location: 'Résidence Les Chênes',
    partnerOrganizationId: getRandomPartnerOrganizationId(),
    host: 'Monique Peltier',
    sessionName: 'Maille à l’endroit',
    description: 'Apportez vos aiguilles',
    attendeeLimit: 10,
    ageLimit: 60,
    ageLimitCondition: AgeLimitCondition.GreaterThan
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '14:00',
    endTime: '16:00',
    location: 'Ludothèque Arc-en-jeux',
    partnerOrganizationId: getRandomPartnerOrganizationId(),
    host: 'Baptiste Colin',
    sessionName: 'Lancez les dés !',
    description: 'Jeux pour tous les âges',
    attendeeLimit: 20,
    ageLimit: 5,
    ageLimitCondition: AgeLimitCondition.GreaterThan
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '11:00',
    endTime: '13:00',
    location: 'Maison de la Culture',
    host: 'Catherine Delpuech',
    sessionName: 'Peindre sans jugement',
    description: 'Tout le matériel est sur place'
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '18:00',
    endTime: '19:30',
    location: 'Studio Danse et Mouvement',
    partnerOrganizationId: getRandomPartnerOrganizationId(),
    host: 'Inès Ramos',
    sessionName: 'Liberté du geste',
    description: 'Prévoir une bouteille d’eau',
    attendeeLimit: 15,
    ageLimit: 60,
    ageLimitCondition: AgeLimitCondition.LowerThan
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '09:00',
    endTime: '12:00',
    location: 'Forêt de la Grésigne',
    partnerOrganizationId: getRandomPartnerOrganizationId(),
    host: 'Éric Sauvage',
    sessionName: 'Sur les sentiers',
    description: 'Chaussures de marche recommandées',
    attendeeLimit: 20,
    ageLimit: 12,
    ageLimitCondition: AgeLimitCondition.GreaterThan
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '14:00',
    endTime: '16:00',
    location: 'Salle Paul Morphy',
    host: 'Maître Luc Roux',
    description: 'Plateaux disponibles sur place'
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '10:00',
    endTime: '12:00',
    location: 'Ferme urbaine du Clos Vert',
    host: 'Gaëlle Antoine',
    sessionName: 'Recycler vivant',
    description: 'Atelier pratique en extérieur',
    attendeeLimit: 10,
    ageLimit: 14,
    ageLimitCondition: AgeLimitCondition.GreaterThan
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '19:00',
    endTime: '22:00',
    location: 'Café ludique La Quête',
    partnerOrganizationId: getRandomPartnerOrganizationId(),
    host: 'Maître du jeu Hugo Lanvin',
    sessionName: 'Une aventure médiévale',
    description: 'Fiches personnages fournies',
    attendeeLimit: 6,
    ageLimit: 16,
    ageLimitCondition: AgeLimitCondition.GreaterThan
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '13:00',
    endTime: '15:30',
    location: 'Atelier Terre en Main',
    host: 'Maud Lacombe',
    sessionName: 'Tourner la terre',
    description: 'Prévoir un tablier',
    attendeeLimit: 5,
    ageLimit: 18,
    ageLimitCondition: AgeLimitCondition.GreaterThan
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '18:30',
    endTime: '20:30',
    location: 'Salle des fêtes de Bellevue',
    partnerOrganizationId: getRandomPartnerOrganizationId(),
    host: 'Claire Montel',
    sessionName: 'Impro et créativité',
    description: 'Aucune expérience requise',
    attendeeLimit: 16,
    ageLimit: 16,
    ageLimitCondition: AgeLimitCondition.GreaterThan
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '09:00',
    endTime: '12:00',
    location: 'Jardin partagé des Sources',
    partnerOrganizationId: getRandomPartnerOrganizationId(),
    host: 'Michel Pujol',
    sessionName: 'Cultiver autrement',
    description: 'Prévoir des gants',
    attendeeLimit: 12,
    ageLimit: 18,
    ageLimitCondition: AgeLimitCondition.GreaterThan
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '17:00',
    endTime: '18:30',
    location: 'Conservatoire de musique',
    partnerOrganizationId: getRandomPartnerOrganizationId(),
    host: 'Julie Lemoine',
    sessionName: 'Pose de voix',
    description: 'Echauffement vocal au début',
    attendeeLimit: 8,
    ageLimit: 14,
    ageLimitCondition: AgeLimitCondition.GreaterThan
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '15:00',
    endTime: '17:00',
    location: 'Bibliothèque numérique',
    partnerOrganizationId: getRandomPartnerOrganizationId(),
    host: 'Romain Perret',
    sessionName: 'Apprendre en s’amusant',
    description: 'Ordinateurs sur place',
    attendeeLimit: 10,
    ageLimit: 10,
    ageLimitCondition: AgeLimitCondition.GreaterThan
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '11:00',
    endTime: '12:00',
    location: 'Centre bien-être Respire',
    partnerOrganizationId: getRandomPartnerOrganizationId(),
    host: 'Isabelle Berthier',
    sessionName: 'Relaxation guidée',
    description: 'Prévoir une tenue confortable',
    attendeeLimit: 15,
    ageLimit: 18,
    ageLimitCondition: AgeLimitCondition.GreaterThan
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '14:00',
    endTime: '16:30',
    location: 'Maison des associations',
    partnerOrganizationId: getRandomPartnerOrganizationId(),
    host: 'Marc Delcourt',
    sessionName: 'Écrire sans frein',
    description: 'Venez avec un carnet',
    attendeeLimit: 10,
    ageLimit: 16,
    ageLimitCondition: AgeLimitCondition.GreaterThan
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '10:00',
    endTime: '11:00',
    location: 'Crèche Les Petits Sons',
    partnerOrganizationId: getRandomPartnerOrganizationId(),
    host: 'Anaïs Roux',
    sessionName: 'Découverte des sons',
    description: 'Instruments adaptés aux tout-petits',
    attendeeLimit: 12,
    ageLimit: 3,
    ageLimitCondition: AgeLimitCondition.GreaterThan
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '18:00',
    endTime: '19:30',
    location: 'Médiathèque Jules Verne',
    partnerOrganizationId: getRandomPartnerOrganizationId(),
    host: 'Patrick Menez',
    sessionName: 'Rencontre intergalactique',
    description: 'Lecture du mois : *Dune*',
    attendeeLimit: 10,
    ageLimit: 15,
    ageLimitCondition: AgeLimitCondition.GreaterThan
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '14:30',
    endTime: '16:30',
    location: 'Maison des savoirs',
    partnerOrganizationId: getRandomPartnerOrganizationId(),
    host: 'Delphine Vasseur',
    sessionName: 'Baume et savon',
    description: 'Matériel fourni, repartez avec vos créations',
    attendeeLimit: 8,
    ageLimit: 16,
    ageLimitCondition: AgeLimitCondition.GreaterThan
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '17:00',
    endTime: '19:00',
    location: 'Dojo municipal',
    partnerOrganizationId: getRandomPartnerOrganizationId(),
    host: 'Sonia Benhaïm',
    sessionName: 'Force et confiance',
    description: 'Tenue de sport obligatoire',
    attendeeLimit: 12,
    ageLimit: 18,
    ageLimitCondition: AgeLimitCondition.GreaterThan
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '09:30',
    endTime: '12:00',
    location: 'Cuisine partagée de la Ferme Urbaine',
    partnerOrganizationId: getRandomPartnerOrganizationId(),
    host: 'Nina Ferrand',
    sessionName: 'Recettes colorées',
    description: 'Dégustation incluse',
    attendeeLimit: 10,
    ageLimit: 16,
    ageLimitCondition: AgeLimitCondition.GreaterThan
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '14:00',
    endTime: '17:00',
    location: 'Atelier Art & Soie',
    partnerOrganizationId: getRandomPartnerOrganizationId(),
    host: 'Sophie Kahn',
    sessionName: 'Motifs et fluidité',
    description: 'Matériel fourni',
    attendeeLimit: 6,
    ageLimit: 18,
    ageLimitCondition: AgeLimitCondition.GreaterThan
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '13:00',
    endTime: '16:00',
    location: 'Atelier Bois & Compagnie',
    partnerOrganizationId: getRandomPartnerOrganizationId(),
    host: 'Georges Letellier',
    sessionName: 'Je crée mon jeu',
    description: 'Outils et matériaux fournis',
    attendeeLimit: 8,
    ageLimit: 12,
    ageLimitCondition: AgeLimitCondition.GreaterThan
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '10:00',
    endTime: '12:00',
    location: 'Maison des Enfants',
    partnerOrganizationId: getRandomPartnerOrganizationId(),
    host: 'Céline Darbon',
    sessionName: 'Ombres et lumières',
    description: 'Création de silhouettes et mise en scène',
    attendeeLimit: 10,
    ageLimit: 6,
    ageLimitCondition: AgeLimitCondition.GreaterThan
  },
  {
    structureId,
    date: getRandomDate(),
    startTime: '15:00',
    endTime: '17:00',
    location: 'Club du 3e âge Les Acacias',
    partnerOrganizationId: getRandomPartnerOrganizationId(),
    host: 'Jean-Pierre Audran',
    sessionName: 'Tournoi amical',
    description: 'Niveau débutant à intermédiaire',
    attendeeLimit: 16,
    ageLimit: 60,
    ageLimitCondition: AgeLimitCondition.GreaterThan
  }
]

const workshopNameInputs = [
  'Atelier dessin d’observation',
  'Atelier robotique enfants',
  'Atelier couture débutant',
  'Atelier méditation guidée',
  'Atelier d’origami',
  'Atelier photo smartphone',
  'Danse africaine',
  'Atelier sculpture argile',
  'Atelier astronomie pour tous',
  'Club de tricot',
  'Jeux de société en famille',
  'Atelier peinture intuitive',
  'Atelier danse contemporaine',
  'Randonnée guidée',
  'Club d’échecs',
  'Atelier compost et écogestes',
  'Atelier jeux de rôle',
  'Atelier poterie sur tour',
  'Atelier théâtre d’impro',
  'Initiation à la permaculture',
  'Atelier initiation au chant',
  'Atelier initiation au coding',
  'Atelier sophrologie',
  'Atelier écriture créative',
  'Atelier éveil musical',
  'Club de lecture science-fiction',
  'Atelier fabrication de cosmétiques naturels',
  'Atelier self-défense féminin',
  'Atelier cuisine végétarienne',
  'Atelier peinture sur soie',
  'Atelier fabrication de jeux en bois',
  'Atelier théâtre d’ombres',
  'Club de bridge senior'
]

async function main() {
  console.log('starting seed')

  const workshopNames = await prismaClient.workshopName.createManyAndReturn({
    data: workshopNameInputs.map(name => ({
      name,
      structureId,
      createdById: fixturesUsers[4].id
    }))
  })

  const workshopName = workshopNames[0]
  if (!workshopName) {
    throw new Error('workshop: missing data')
  }

  await prismaClient.workshop.createMany({
    data: workshopInputs.map(input => ({
      ...input,
      createdById: fixturesUsers[4].id,
      workshopNameId: workshopName.id
    }))
  })
}
main()
