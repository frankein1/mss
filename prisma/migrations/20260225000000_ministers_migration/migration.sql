-- Seed Ministers
INSERT INTO minister (id, first_name, last_name, function, status, government, old_minister, updated, created)
VALUES
(gen_random_uuid(), 'François', 'Braun', 'Santé et Prévention', 'Former', 'non renseigné', 'FrancoisBraun', NOW(), NOW()),
(gen_random_uuid(), 'Agnès', 'Firmin-Le Bodo', 'Santé et Prévention', 'Former', 'non renseigné', 'AgnesFirminLeBodo', NOW(), NOW()),
(gen_random_uuid(), 'Jean-Christophe', 'Combe', 'Solidarités, Autonomie et Personnes handicapées', 'Former', 'non renseigné', 'JeanChristopheCombe', NOW(), NOW()),
(gen_random_uuid(), 'Geneviève', 'Darrieussecq', 'Personnes handicapées', 'Former', 'non renseigné', 'GenevieveDarrieussecq', NOW(), NOW()),
(gen_random_uuid(), 'Geneviève', 'Darrieussecq', 'Ministre de la Santé et de l’Accès aux soins', 'Former', 'Barnier1', 'GenevieveDarrieussecqBarnier1', NOW(), NOW()),
(gen_random_uuid(), 'Olivier', 'Dussopt', 'Travail, Plein emploi et Insertion', 'Former', 'non renseigné', 'OlivierDussopt', NOW(), NOW()),
(gen_random_uuid(), 'Carole', 'Grandjean', 'Enseignement, Formation professionnels', 'Former', 'non renseigné', 'CaroleGrandjean', NOW(), NOW()),
(gen_random_uuid(), 'Aurélien', 'Rousseau', 'Santé et Prévention', 'Former', 'non renseigné', 'AurelienRousseau', NOW(), NOW()),
(gen_random_uuid(), 'Aurore', 'Bergé', 'Solidarités et Familles', 'Former', 'non renseigné', 'AuroreBerge', NOW(), NOW()),
(gen_random_uuid(), 'Fadila', 'Khattabi', 'Personnes handicapées', 'Former', 'non renseigné', 'FadilaKhattabi', NOW(), NOW()),
(gen_random_uuid(), 'Catherine', 'Vautrin', 'Travail, Santé et Solidarités', 'Former', 'non renseigné', 'CatherineVautrin', NOW(), NOW()),
(gen_random_uuid(), 'Frédéric', 'Valletoux', 'Délégué Santé et Prévention', 'Former', 'non renseigné', 'FredericValletoux', NOW(), NOW()),
(gen_random_uuid(), 'Sarah', 'El Haïry', 'Déléguée Enfance, Jeunesse et Familles', 'Former', 'non renseigné', 'SarahElHairy', NOW(), NOW()),
(gen_random_uuid(), 'Astrid', 'Panosyan-Bouvet', 'Ministre du Travail et de l’Emploi', 'Former', 'non renseigné', 'AstridPanosyanBouvet', NOW(), NOW()),
(gen_random_uuid(), 'Paul', 'Christophe', 'Ministre des Solidarités, de l’Autonomie et de l’Égalité entre les femmes et les hommes', 'Former', 'non renseigné', 'PaulChristophe', NOW(), NOW()),
(gen_random_uuid(), 'Agnès', 'Canayer', 'Ministre déléguée, chargée de la Famille et de la Petite Enfance', 'Former', 'non renseigné', 'AgnesCanayer', NOW(), NOW()),
(gen_random_uuid(), 'Salima', 'Saa', 'Secrétaire d''État, chargée de l''Égalité entre les femmes et les hommes', 'Former', 'non renseigné', 'SalimaSaa', NOW(), NOW()),
(gen_random_uuid(), 'Charlotte', 'Parmentier-Lecocq', 'Ministre déléguée, chargée des Personnes en situation de handicap', 'Former', 'non renseigné', 'CharlotteParmentierLecocq', NOW(), NOW()),
(gen_random_uuid(), 'Catherine', 'Vautrin', 'Ministre du Travail, de la Santé, des Solidarités et des Familles', 'Former', 'Bayrou1', 'CatherineVautrinBayrou1', NOW(), NOW()),
(gen_random_uuid(), 'Astrid', 'Panosyan-Bouvet', 'Ministre chargée du Travail et de l''Emploi', 'Former', 'Bayrou1', 'AstridPanosyanBouvetBayrou1', NOW(), NOW()),
(gen_random_uuid(), 'Yannick', 'Neuder', 'Ministre chargé de la Santé et de l''Accès aux soins', 'Former', 'Bayrou1', 'YannickNeuder', NOW(), NOW()),
(gen_random_uuid(), 'Charlotte', 'Parmentier-Lecocq', 'Ministre chargée de l’Autonomie et du Handicap', 'Former', 'Bayrou1', 'CharlotteParmentierLecocqBayrou1', NOW(), NOW()),
(gen_random_uuid(), 'Sarah', 'El Haïry', 'Haut-commissaire à l’enfance', 'Former', 'Bayrou1', 'SarahElHairyBayrou1', NOW(), NOW()),
(gen_random_uuid(), 'Jean-Pierre', 'Farandou', 'Ministre du Travail et des Solidarités', 'Former', 'Lecornu', 'JeanPierreFarandou', NOW(), NOW()),
(gen_random_uuid(), 'Stephanie', 'Rist', 'Ministre de la Santé, des Familles, de l’Autonomie et des Personnes handicapées', 'Current', 'Lecornu', 'StephanieRist', NOW(), NOW()),
(gen_random_uuid(), 'Charlotte', 'Parmentier-Lecocq', 'Ministre déléguée, chargée de l’Autonomie et des Personnes handicapées', 'Current', 'Lecornu', 'CharlotteParmentierLecornu2', NOW(), NOW()),
(gen_random_uuid(), 'Sarah', 'El Haïry', 'Haut-commissaire à l’enfance', 'Current', 'Lecornu', 'SarahElHairyLecornu2', NOW(), NOW());

-- Update SocialSupports with new minister ids
UPDATE social_support ss
  SET minister_id = m.id
  FROM minister m
  WHERE ss.ministre IS NOT NULL
  AND m.old_minister = ss.ministre;