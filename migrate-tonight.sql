-- Scripts to run on the production database after v2 release on 10/07/2023 evening
update document set tags = array_replace(tags, 'emploi', 'Emploi') where 'emploi' = any(tags);
update document set tags = array_replace(tags, 'sante_handicap', 'SanteHandicap') where 'sante_handicap' = any(tags);
update document set tags = array_replace(tags, 'maintien_a_domicile', 'MaintienADomicile') where 'maintien_a_domicile' = any(tags);
update document set tags = array_replace(tags, 'budget_ressources', 'BudgetRessources') where 'budget_ressources' = any(tags);
update document set tags = array_replace(tags, 'logement', 'Logement') where 'logement' = any(tags);
update document set tags = array_replace(tags, 'impot', 'Impot') where 'impot' = any(tags);
update document set tags = array_replace(tags, 'justice', 'Justice') where 'justice' = any(tags);
update document set tags = array_replace(tags, 'retraite', 'Retraite') where 'retraite' = any(tags);
update document set tags = array_replace(tags, 'prestations_sociales', 'PrestationsSociales') where 'prestations_sociales' = any(tags);
