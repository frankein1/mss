import type { DataInclusionStructureApiInputV1 } from '~/server/schema'

export const dataInclusionStructures = [
  {
    horaires_accueil:
      ' Lundi : 9h-12h30 Mardi et vendredi : 9h-12h30 et 14h-18h Samedi : 9h-12h ',
    id: '1',
    lien_source:
      'https://annuaire.ille-et-vilaine.fr/organisme/1-mairie-davailles-sur-seiche',
    nom: "Mairie d'Availles Sur Seiche",
    siret: null,
    site_web: null,
    source: 'cd35',
    description:
      'Une commune est une collectivité locale gérée de manière autonome par le Maire. Il s’appuie sur ses adjoints et ses conseillers municipaux.\r\n \nLes rôles du Maire et de son équipe sont définis par le Code Général des Collectivités Territoriales et les lois de transferts de compét…',
    date_maj: new Date(1593734400000).toDateString(),
    complement_adresse: null,
    commune: 'AVAILLES-SUR-SEICHE',
    adresse: '3 rue des Fontaines',
    code_postal: '35130',
    courriel: 'availles.mairie@wanadoo.fr',
    telephone: '0299962292',
    doublons: [
      { source: 'dora', id: 'dora--old-id-abc' },
      {
        source: 'emplois-de-linclusion',
        id: 'emplois-de-linclusion--old-id-xyz'
      }
    ]
  },
  {
    horaires_accueil: null,
    id: '10',
    lien_source:
      'https://annuaire.ille-et-vilaine.fr/organisme/10-association-hemochromatose-ouest-rennes',
    nom: 'Association Hémochromatose Ouest  - Rennes',
    siret: null,
    site_web: null,
    source: 'cd35',
    description:
      " \nL'hémochromatose est la première maladie génétique et familiale en France. Il s'agit d'une maladie mal connue et dont on parle peu. Un service de dépistage est situé à Rennes, Hôpital Pontchaillou : 2, rue Henri Le Guillou, service maladies du foie, tél. 02 99 28 42 97.\nAHO es…",
    date_maj: new Date(1580947200000).toDateString(),
    complement_adresse: null,
    commune: 'RENNES',
    adresse: '2  rue Henri le Guilloux',
    code_postal: '35033',
    courriel: 'president.aho@hotmail.fr',
    telephone: '0299284321'
  },
  {
    horaires_accueil: 'cf :  renseignements complémentaires',
    id: '1001',
    lien_source: 'https://annuaire.ille-et-vilaine.fr/organisme/1001-city-roul',
    nom: 'City-roul',
    siret: null,
    site_web: 'http://www.cityroul.com ',
    source: 'cd35',
    description:
      "City-roul propose de partager l'usage de véhicules, moyennant un abonnement et un prix à l'heure.City-roul gère une flotte de véhicules disponibles sur courte durée, 24 heures sur 24 et 7 jours sur 7. Les abonnés réservent facilement et disposent d'un véhicule stationné sur un p…",
    date_maj: new Date(1546300800000).toDateString(),
    complement_adresse: null,
    commune: 'RENNES',
    adresse: '40  place du Colombier',
    code_postal: '35000',
    courriel: 'info@cityroul.com',
    telephone: '0223210747'
  },
  {
    horaires_accueil: null,
    id: '1002',
    lien_source:
      'https://annuaire.ille-et-vilaine.fr/organisme/1002-service-social-la-poste-rennes',
    nom: 'Service social la Poste - Rennes',
    siret: null,
    site_web: null,
    source: 'cd35',
    description:
      "Service social d'entreprise  au service des salariés actifs, des fonctionnaires et retraités de la poste.\nPrendre rendez-vous en fonction du service ou laisser un message.(pas de secrétariat)\nservice social courrier : 27, boulevard du Colombier / 02.22.93.79.01 et  02.22.93.79.0…",
    date_maj: new Date(1580947200000).toDateString(),
    complement_adresse: null,
    commune: 'RENNES',
    adresse: '27  boulevard du Colombier',
    code_postal: '35032',
    courriel: null,
    telephone: null
  },
  {
    horaires_accueil: 'lundi au vendredi : 9h-12h, 14h-17h.',
    id: '1003',
    lien_source:
      'https://annuaire.ille-et-vilaine.fr/organisme/1003-service-social-maritime-nantes',
    nom: 'Service Social Maritime - Nantes',
    siret: null,
    site_web: 'http://www.ssm-mer.fr',
    source: 'cd35',
    description:
      "Service social d'entreprise au service des marins, actifs ou pensionnés et de leurs familles (marins-pêcheurs et marins du commerce).\nEn Ille-et-Vilaine, prendre rendez-vous auprès de la direction des affaires maritimes, 27, quai Duguay Trouin, BP 70, 35406 Saint Malo, tél. 02 9…",
    date_maj: new Date(1580947200000).toDateString(),
    complement_adresse: null,
    commune: 'NANTES',
    adresse: '54  quai de la Fosse',
    code_postal: '44000',
    courriel: 'direction@ssm-mer.fr',
    telephone: '0240710150'
  },
  {
    horaires_accueil:
      'permanence téléphonique du lundi au vendredi : 9h-12h, 14h-17h.',
    id: '1004',
    lien_source:
      'https://annuaire.ille-et-vilaine.fr/organisme/1004-association-des-victimes-daccidents-de-la-circulation-dagressions-et-dactes-medicaux-cesson-sevigne',
    nom: "Association des victimes d'accidents de la circulation \" \" d'agressions et d'actes médicaux - Cesson Sévigné",
    siret: null,
    site_web: null,
    source: 'cd35',
    description:
      "Association créée par des bénévoles afin de soutenir, accompagner, informer, conseiller les victimes d'accidents de la circulation, d'agressions, d'actes médicaux dans leurs démarches administratives et d'indemnisation.\nEquipe de juristes et de médecins.",
    date_maj: new Date(1628726400000).toDateString(),
    complement_adresse: null,
    commune: 'CESSON-SEVIGNE',
    adresse: 'La Rigourdière',
    code_postal: '35510',
    courriel: 'aviacaam@hotmail.com',
    telephone: '0633422908'
  },
  {
    horaires_accueil:
      'de 7h30 à 18h du lundi au vendredi sauf jours fériés et vacances scolaires',
    id: '1005',
    lien_source:
      'https://annuaire.ille-et-vilaine.fr/organisme/1005-sos-urgences-mamans-antenne-de-rennes',
    nom: 'SOS Urgences Mamans " " antenne de Rennes.',
    siret: null,
    site_web: 'http://www.sosurgencesmamans.com',
    source: 'cd35',
    description:
      "SOS Urgences Maman propose une garde d'enfant immédiate, occassionnelle et temporaire, afin de venir en aide à des parents confrontés à un problème inattendu. SOS Urgences Mamans ne fontionne ni le week-end ni pendant les vacances scolaires.\nGarde d'enfants de tous âges, en dépa…",
    date_maj: new Date(1609113600000).toDateString(),
    complement_adresse: null,
    commune: 'RENNES',
    adresse: '187  Rue de Châtillon',
    code_postal: '35000',
    courriel: null,
    telephone: '0299305200'
  },
  {
    horaires_accueil: 'du lundi au vendredi : 9 h-18h',
    id: '1006',
    lien_source:
      'https://annuaire.ille-et-vilaine.fr/organisme/1006-info-sociale-en-ligne-rennes',
    nom: 'Info sociale en ligne - Rennes',
    siret: null,
    site_web: 'http://annuaire.ille-et-vilaine.fr',
    source: 'cd35',
    description:
      "Le Département d'Ille-et-Vilaine met à votre disposition un service d'écoute et d'information, Info sociale en ligne, qui peut répondre à toutes questions d'accès aux droits et vous aider dans les démarches (trouver le bon guichet, aider à remplir un dossier, etc...)\nTout citoye…",
    date_maj: new Date(1610064000000).toDateString(),
    complement_adresse: null,
    commune: 'RENNES',
    adresse: null,
    code_postal: '35000',
    courriel: 'isl@ille-et-vilaine.fr',
    telephone: '0800953545'
  },
  {
    horaires_accueil: ' mardi, jeudi et vendredi : 9h-12h,  Sur rendez vous ',
    id: '1007',
    lien_source:
      'https://annuaire.ille-et-vilaine.fr/organisme/1007-la-rencontre-association-departementale-dentraide-des-personnes-accueillies-a-laide-sociale-a-lenfance-en-ille-et-vilaine-rennes',
    nom: "La Rencontre - Association Départementale d'Entraide des Personnes Accueillies à l'Aide sociale à  l'Enfance en Ille-et-Vilaine - Rennes",
    siret: null,
    site_web: 'https://fnadepape.org/',
    source: 'cd35',
    description:
      "Cette association a pour but de développer l'esprit de solidarité entre les personnes accueillies à la protection de l'enfance du département d'Ille-et-Vilaine (catégories définies dans les statuts de l'association), de leur venir en aide. Elle veut être pour tous une grande fam…",
    date_maj: new Date(1711065600000).toDateString(),
    complement_adresse: null,
    commune: 'Rennes',
    adresse: '4 Rue Perrin de la Touche',
    code_postal: '35000',
    courriel: 'adepape35larencontre@orange.fr',
    telephone: '0299541864'
  },
  {
    horaires_accueil: '8h-12h / 13h30-17h30',
    id: '1008',
    lien_source:
      'https://annuaire.ille-et-vilaine.fr/organisme/1008-association-letape-chantier-dinsertion-mordelles',
    nom: "Association l'Etape - Chantier d'insertion - Mordelles",
    siret: null,
    site_web: null,
    source: 'cd35',
    description:
      'Les Ateliers et Chantiers d’Insertion (ACI) sont des structures prestataires de biens et de services qui interviennent dans le champ non marchand. Ils accueillent un public particulièrement éloigné de l’emploi en proposant une première étape de réinsertion par le travail en offr…',
    date_maj: new Date(1654128000000).toDateString(),
    complement_adresse: null,
    commune: 'MORDELLES',
    adresse: 'Rue de la Croix Ignon',
    code_postal: '35310',
    courriel: null,
    telephone: '0299673907'
  }
] satisfies DataInclusionStructureApiInputV1[]
