# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [1.66.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.65.0...v1.66.0) (2026-09-14)


### Features

* **dispositifs:** notifications ([fb26190](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/fb261902243b8011a7a10b8ad55067abdf16c180)), closes [#1177](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1177)
* **document:** script de migration des documents ([cf6ecbe](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/cf6ecbe796a334c5df0d97a7abea61f32513ed0b)), closes [#937](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/937)
* **logs:** meilleurs logs serveur pour compléter les logs routeur ([51eb157](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/51eb157f9a1a591bfc761c84be5be951c2d924aa))


### Bug Fixes

* **admin:** afficher le nombre de structures actives ([685131c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/685131caa5e40323f0b9853fc6e3b37114ede7e0))
* **admin:** amélioration de l'e-mail d'alerte de désactivation de structure ([b7bdf60](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b7bdf60adb0e59bf3acd304920a1b92ec06bd635)), closes [#1097](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1097)
* **bénéficiaire:** ajout tests et gestion transfert de référent pour le rôle de référent ([abc1c0d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/abc1c0de9ce72aa76dfd584cd5331783219b2ee1))
* **document:** adapt document migration with better query ([aa733d2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/aa733d2ab68df312adc7a9c26bc36bf8b452ce33))
* **ministères:** suppression de départements et services en doublons ([dd4d41d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/dd4d41db701e505f28e1e034faa477b503f28847)), closes [#1182](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1182)
* **notifications:** ajout du rôle Instructeur ([c57e499](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c57e49904a70b5add6a48bf7d463467c0c68e420))
* **notifications:** dispositifs 2 mois ([ade6da4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ade6da414f2956704755d73e24abf8889f19791f))
* régression UI ([b42b456](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b42b456a4aaa8d3fe12e53afffb1e6a662ca61eb)), closes [#1097](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1097)
* **structure:** correction d'un bug lors de la suppression d'utilisateur ([d88d947](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d88d94738884c57140b26a4c48e464e1cca0f020)), closes [#1183](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1183)

## [1.65.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.64.0...v1.65.0) (2026-09-01)


### Features

* **bénéficiaires:** export des partenaires intervenants ([afe930c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/afe930c47489a25ed6b85541a9f92af523c83921)), closes [#1165](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1165)
* **dispositif:** gestion dispositifs dans les dossiers, accompagnements et statistiques ([d405ac2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d405ac225adcf2ec825ee1b14ac6d847ccf5152b)), closes [#889](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/889)
* **dispositifs:** exports ([e14cdb8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e14cdb86a09c3e29f937e448f41e1edfa145db8a)), closes [#1176](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1176)
* **statistiques:** ajout d'un filtre Employeur ([3b3bcff](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3b3bcff4cacd1268e3e5ee83feb1e20c38d66570)), closes [#1162](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1162)


### Bug Fixes

* **bénéficaires:** export quartier et référents à tous les rôles ([9570d2d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/9570d2d146fc01c29a43156e22cdd041e3a9efcb))
* **bénéficiaires:** formulaire Bénéficiaire > Partenaire ([7c21392](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7c21392825de406e167182faa219693ea89d6840)), closes [#1174](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1174)
* **dispositifs:** améliorations et résolutions de bugs UI ([c0fafd9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c0fafd946e004e8e83af30c661d0333e74e3c7a1)), closes [#1138](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1138)
* **dispositifs:** améliorations UI ([a5b48da](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a5b48dafe90d1e88c59a69d2eccbae2adb4b2eb4)), closes [#1170](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1170)
* **dispositifs:** améliorations UI ([dd3b76b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/dd3b76b0f3787df5c460604d15c98678b36f8dd1)), closes [#1138](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1138)
* **dispositifs:** améliorer l'ordonnancement ([62762c6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/62762c66f007ab596c4157adc36efe479a892e0d)), closes [#1171](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1171)
* **dispositifs:** suppression des colonnes vides ([b05cf04](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b05cf04af1f998a0b395661fcf2aee2d2da48598))
* **export bénéficiaires:** supprimer onglets innacessibles ([a0b056a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a0b056a625141dfa6b02ce3e704717fe2a24a157)), closes [/gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/work_items/1165#note_3761073760](https://gitlab.com/incubateur-territoires/startups/monsuivisocial//gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/work_items/1165/issues/note_3761073760)
* **statistiques:** déplacement du filtre Employeur ([1e6e5cd](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1e6e5cdd831ef4e245ec268877f088b6e5c462f6)), closes [#1172](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1172)
* **ui:** améliorations des formulaires accompagnement ([addae64](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/addae640e6888920930901c0488b280eb15d5d74)), closes [#1169](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1169)

## [1.64.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.63.0...v1.64.0) (2026-08-20)


### Features

* **accessibilité:** correctifs bénéficiaire,accompagnement et structure ([f3c6885](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f3c6885f63c9e1a38b1267972811a90ab84c2385))
* **bénéficiaires:** ajout de dispositifs scolaire, ajout des SEGPA et ULIS dans les classes ([6469068](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/646906897a6a8585ad70078c1442056fc8b93030)), closes [#1141](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1141)
* **document:** script de rewrap des DEK suite à rotation de la KEK ([ce5fea3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ce5fea3e9a96edafa73e9d788995ca7196407150)), closes [#937](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/937)
* **ministères:** ajout d'items au champ "Département ou service de l'administration centrale"" ([b3fb8da](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b3fb8da5d02c0c3623acf558ccc522538cbf36be)), closes [#1132](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1132)


### Bug Fixes

* **accessibilité:** correction du focus lors de l'ajout dynamique d'un champ dans un formulaire ([cb9b06a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/cb9b06ac077ecc8bb922d527a460e126ba5d1659)), closes [#1158](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1158)
* amélioration de l'affichage des formulaires ([cf532e6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/cf532e64fd1e1c27b6e5a959adb3cb28e4bd78e8))
* **bénéficiaire:** données initiales dans le formulaire ([f9bc2c2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f9bc2c2ea07100dbeb682399c6c7c8740aaf3433))
* **bénéficiaire:** restauration structure et mode d'orientation ([db8c1ed](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/db8c1ed40b464659d1a4ac9476db1b7c9b1898bb)), closes [#1160](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1160)
* **document:** simplification AAD utilisant document key ([efb05e3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/efb05e3205ab8678d7339c1023f9c9587dbd3181)), closes [#937](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/937)
* **rdvsp:** corrige rafraichissement du token ([c9142c2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c9142c2f3ce5341ee6a42d7e79d121515926ff61))
* **rdvsp:** statut rdv collectif synchronisé ([5c2e36f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5c2e36f8788265a57dc481d7c6c6ff543b58a91e)), closes [#1157](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1157)
* redirection après dissociation de dossier ([7ad71f7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7ad71f7433a3ffef33ee27ca3651398fa8283d7e))

## [1.63.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.62.0...v1.63.0) (2026-08-03)


### Features

* **bénéficiaire:** ajout des partenaires intervenants dans le formulaire ([0e3de62](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0e3de62e0dc7991543e927e091cc958555ab5804)), closes [#1145](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1145)
* **bénéficiaire:** améliorations UI de la gestion des partenaires ([1744557](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/17445577d49884bd933af7874403f45dbcca7d46)), closes [#1145](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1145)


### Bug Fixes

* **bénéficiaire:** suppression champs structure d'orientation et type d'orientation dans l'UI ([f58306d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f58306d113db9adc5b180a1b6054e88266f134db)), closes [#1145](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1145)

## [1.62.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.61.0...v1.62.0) (2026-07-29)


### Features

* **accompagnements:** afficher le nom de l'agent qui a créé/modifié l'accompagnement ([ad5f1a2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ad5f1a299341e369d138a35ec2f64911fb8ebc39)), closes [#972](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/972)
* **accompagnements:** afficher le numéro de dossier sur la page d'impression ([7679ed6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7679ed636b1e849d3bcfcf3afa96bc4684c17fdd)), closes [#972](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/972)
* **accompagnements:** ajout d'un champ Fin d'accompagnement ([80d45e0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/80d45e0c976f4e25f2691e5c0a411e624b46be29)), closes [#972](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/972)
* **entretien:** ajout entretien en permanence ([665c96d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/665c96d850a05141799eba41b489c934f202e2c7)), closes [#1135](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1135)
* **entretiens:** ajout du type SMS ([ce22e0b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ce22e0bf0cb722bb726637be6eb56eae7e9eecfe)), closes [#972](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/972)
* **entretiens:** nouveau type Gestion administrative ([ff18c1d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ff18c1de79c055465819f769c951083ef9d9dede)), closes [#972](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/972)
* **entretiens:** nouvelle durée moins de 15 minutes ([314c9ed](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/314c9edbd9cc3e425f3849707adcc0b7ead26254)), closes [#972](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/972)
* **statistiques - ministères:** nombre d'accompagnement par bénéficiaire ([8df06f8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8df06f8b4ace3f376e94cdb23512ff37cac4d44a)), closes [#1133](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1133) [#1140](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1140)
* **statistiques:** ajout d'un filtre QPV ([45ab0f7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/45ab0f731a7fa3811c5cbc832e16959289e863aa)), closes [#1140](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1140)
* **statistiques:** ajout d'une carte Établissements REP ([50cb4a8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/50cb4a849e64771aabd9c0ccad1800ca40437aec)), closes [#1140](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1140)
* **statistiques:** ajout motifs réorientations à l'export ([d2afc90](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d2afc908df6502c5b1eceb4fea59cbb4df5601bb)), closes [#1071](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1071)
* **statistiques:** carte classe fréquentée ([f7433db](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f7433db882870437a502da86276422ee3096fb9a)), closes [#1140](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1140)
* **statistiques:** filtre établissement scolaire ([a83aed4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a83aed477b069e3f0c79be1a1307dd82a3ab29a5)), closes [#1140](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1140)
* **statistiques:** motifs de réorientation ([d58e0fe](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d58e0fe206f038b354b56068c8f1edc0928b5f74)), closes [#1071](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1071)
* **statistiques:** ouvre les statistiques à tous les rôles ([1fab418](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1fab418dda3b51ea05ece26fc6894ac7bed85989)), closes [#1134](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1134)
* **statistiques:** réordonne les filtres et ouvre stat nombre de suivis à tous ([655cfc0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/655cfc094da4fd884ed210d95404545866608f66)), closes [#1140](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1140)


### Bug Fixes

* **accessibilité:** amélioration des formulaires avec adresse ([597664a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/597664a9431887557ec34ff1bc4b9cdf181575c8))
* **accompagnement:** désactivation temporaire de la case Fin d'accompagnement ([7d9cd88](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7d9cd88d22ea8a24a5fbe1ab5d0398dd94b871e1)), closes [#972](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/972)
* **accompagnements:** précisions sur la date d'échéance ([6e68ac2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6e68ac209d3f085dda6baf25219f8ba3f46a8676)), closes [#972](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/972)
* **bénéficiaires:** amélioration de l'affichage d'historique ([e8ac29b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e8ac29b20d2f6515582d8e17277e86b6b372308e))
* **bénéficiaires:** correction des labels catégories socio-pro ([15fe603](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/15fe60335dff5954b7156de92786380c9fb5fa91))
* filtre qpv dans les accompagnements ([32e3db3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/32e3db3d8f312c1c68964bcaac69cb005cef673f)), closes [#1140](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1140)
* labels bénéficiaire et redirection vers panneau de configuration ([5e13393](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5e1339371b9bf3feef4c1c6992a8c7210eae3702))
* **statistiques:** réinitialisation des filtres ([3a511d5](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3a511d560cc8a6e16c164eafc737ae4f05df1703))

## [1.61.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.60.3...v1.61.0) (2026-07-09)


### Features

* API des établissements scolaires ([f059560](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f0595605dee9d1afcebbf1161512fbed75091d28)), closes [#778](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/778)
* **bénéficiaire:** ajout champ type de contrat et items CSP (PublicEmployee, Apprentice) ([440b0b4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/440b0b454de87ef37eeb72030a898f3da79668a1)), closes [#973](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/973)
* **bénéficiaire:** migration de données CSP::Disability/SickLeave vers ActivityStatus ([2f7405c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2f7405c48e4f87d3d38f45b441e785eea068af35))
* **béneficiaires:** recherche de QPV à partir d'une adresse ([98b3be4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/98b3be4f3af3766667ceff1a3e33e30c9ea43496)), closes [#1116](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1116)
* **bénéficiaires:** résolution de quartier QPV sur le formulaire complet ([d4f3670](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d4f3670821f6af6a1f8052f7cce853940b7d45c7)), closes [#1116](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1116)
* **document:** simplification ids S3, impact suppression multiple ([df54dbf](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/df54dbfb65b5e7df0f13d5af5a9dd3a34dffee99)), closes [#937](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/937)


### Bug Fixes

* ajout export document S3 à l'archivage ([5663486](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/56634860b338833324cb06389b3b047631aada87)), closes [#937](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/937)
* **bénéficiaire:** fusion migration pour ajouter champs Invalidite/ArretMaladie ([cc66dd9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/cc66dd9b3b51c6ddc3ee216d013fd67d7830d78c))
* corrections de layout sur l'historique bénéficiaire ([63ee0aa](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/63ee0aa27b8778b0d28d4ee95cf19dab8c5be31a))
* resolution de qpv ([e1b6cfa](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e1b6cfadd15f8bc01bd2dc4c6af1ebd8bb5aa566))

## [1.60.3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.60.2...v1.60.3) (2026-06-25)

## [1.60.2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.60.1...v1.60.2) (2026-06-24)

## [1.60.1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.60.0...v1.60.1) (2026-06-24)


### Bug Fixes

* **bénéficiaire:** utilisation du numéro de dossier dans l'export bénéficiaire ([fa1c56b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/fa1c56b47027820d4ef86235c07f9274c4e297b3)), closes [#1128](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1128)
* désactivation temporaire de la désindexation de l'app ([f2385a7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f2385a7e6997486e9ed5a67e432260c03a96bd2a)), closes [#1131](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1131)

## [1.60.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.59.3...v1.60.0) (2026-06-18)


### Features

* **ateliers:** dupliquer les participant.es ([b2e3adc](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b2e3adc3cf2e3b2a604b01747ec59b81fbfde5c7)), closes [#1061](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1061)
* **bénéficiaires:** ajout de la classe scolaire ([3732b75](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3732b75e6844533d10166495cdc206be0a059da8))
* **document:** adaptations Open Bao incub ([c210191](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c2101919acb10603c513753172b11e0d0c5d72a7)), closes [#937](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/937)
* **redirection:** ajout d'un motif ([eebeb4b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/eebeb4b76b8647b79430450f4ac259063532c26b)), closes [#1071](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1071)


### Bug Fixes

* **ateliers:** dupliquer la limite de participants ([4ea3550](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4ea355092ee76b72ee3f24c25b5599f294fd6ee8)), closes [#1061](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1061)
* **auth:** suppression des pii dans le jwt ([0adf290](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0adf290d6e4a5fe1b0c216ee0b726ae3d1a59788)), closes [#605](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/605)
* backend autorisations de suppression d'utilisateur ([9bfbe5b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/9bfbe5b50060c6daa1979e1c4cefde5bc8a8ba34)), closes [#1118](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1118)
* **bénéficiaires:** ne pas exporter les colonnes vides ([68cc754](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/68cc75418f3994fe073edec0c7949b48df98379c))
* bug de redirection modale formulaire ([a879712](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a879712a53f2c405c16857c9a91f165876e19ea5))
* **documents:** date d'expiration des documents sur S3 ([4eef849](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4eef849e27cb7d14fd2ad10477818610283002c6))
* **foyer:** navigation entre membres du foyer ([ac5610a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ac5610a9ecce37d9d1945b1629c9f2f2449e71b9)), closes [#1120](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1120)

## [1.59.3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.59.1...v1.59.3) (2026-06-01)


### Bug Fixes

* **atelier:** filtres sur les statistiques des ateliers dans l'export ([4259238](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/42592384a3aead66f806476ba7bfb7a1f07f0ad7)), closes [#1099](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1099)
* **ateliers:** modification du nom d'un atelier ([81092ba](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/81092baa8f507e7c262af965ecac629f2140a074)), closes [#1110](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1110)
* **bénéficiaires:** corrections UX page 'transfère d'agents' ([051f321](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/051f32170ab49deffd2cc297a7b7c175bf50299c)), closes [#1106](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1106)
* **bénéficiaires:** format attendu nir ([20e5b0b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/20e5b0b44f6220e43d1c25ad982ebaa54c22c5ca)), closes [#1087](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1087)
* **bénéficiaires:** gestion du genre et civilité ([c52f912](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c52f9126aab55d07f7d8b3468c7f2e5aae5f52b0)), closes [#1027](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1027)
* **db-anonymizer:** restauration des clés étrangères sur le schéma cible de la base anonymisée ([8db4cfa](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8db4cfa09d9c4ee90c8da46aed35ecd7fb7b9f6d)), closes [#1110](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1110)
* **db-anonymizer:** typo ([bae4ee2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/bae4ee28b6af4096af805f22891e83634eafb323))
* **dossier:** modale détruite après ajout d'un membre au dossier ([7e67891](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7e67891d5c007811fb52514eb2a9c7c92e0c4119)), closes [#1112](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1112)
* **partenaire:** création de partenaires personnalisés ([14af167](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/14af1674dd8f6a616df30680dc627a02285d0c3f)), closes [#1108](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1108)
* **statistiques:** correction nombre de bénéficiaires accompagnés ([d3a86fa](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d3a86fa242e93f5ec484c20b5316d52b59db46d1)), closes [#1081](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1081)
* temporaire, modale doit être initialisée au setup ([72d208e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/72d208ed7b74f08fa65b52cfb2bc1432ed1952a9)), closes [#1109](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1109)

## [1.59.1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.59.0...v1.59.1) (2026-05-20)

## [1.59.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.58.0...v1.59.0) (2026-05-20)


### Features

* **annuaire:** ajout site internet ([394bc78](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/394bc78d07a3e8a674857f2dd127db2281c694be)), closes [#975](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/975)
* **annuaire:** migration vers l'API data·inclusion v1 et gestion des partenaires "legacy" v0 ([76a70b1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/76a70b13130adfe00e82f611643d1b8892ea2344))
* **bénéficiaire:** duplication section adresse/hébergement dans un dossier foyer ([b361070](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b3610709abc0b53c6b78c4a2eae207ff71854a89)), closes [#1025](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1025)
* **bénéficiaires:** transfère massif de dossiers d'un agent référent à un autre ([b040a53](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b040a5300d71fcd061cd64a46d92d1df7991d535)), closes [#1050](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1050)
* **data-inclusion:** script de migration des données de l'API v0 vers v1 ([ef2f644](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ef2f644711e7fb1eef39a56fb35635db9e93bb82))
* **documents:** afficher une mention 'consulté' sur les documents ouverts dans la session ([aae5b67](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/aae5b67b238202291894c71c9cc23c49332cf92e)), closes [#1035](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1035)
* **dpo:** suppression de la modale DPO ([cf61ae6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/cf61ae65927fa6b85e687d3deffa43987e8020e4)), closes [#1100](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1100)
* **export:** ajout du niveau scolaire dans l'export bénéficiaires ([42f3416](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/42f3416e84316c5ee0ad6cb32546a2a6b6199507))
* **exports:** suite améliorations des exports xls ([7cd7433](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7cd74332694753e62d26eea7e6f6e7ddeb89cb29)), closes [#1017](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1017)
* **notifications:** ajout d'un flow de notifications pour tous les agents référents ([b061294](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b061294a1d7e1a83b5260282c3052aca017f6f69)), closes [#1062](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1062)


### Bug Fixes

* affichage et valeurs par défaut des booléens optionnels dans UI/exports/impressions ([c0b5dc3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c0b5dc3c74cb3b6dcbb30bbe87297ff9f44d1347)), closes [#1088](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1088)
* **annuaire:** suppression UI partenaires legacy ([0479c4d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0479c4d4b6053307a8ba0e5425a566923de750c7)), closes [#975](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/975)
* **archivage:** labels aide remboursable et 1ère demande ([d75e095](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d75e095982259f765545b958117119d6667fcc81)), closes [#1088](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1088)
* **backend:** mutualisation des vérifications des identifiants cross-entités (*Id) ([26d3668](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/26d366896a5690499d8d6bf943b24456b17f47f0))
* **backend:** rendre sentry optionnel lors des appels captureMessage ([07269c2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/07269c2efd6176b53a9160f0b144949145f0ab98)), closes [#1066](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1066)
* **bénéficiaire:** corrige le nombre de bénéficiaires dans le transfert de référents ([c422add](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c422add6a2a69584ad30966a3ba8576fa711d3a8)), closes [#1050](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1050)
* **bénéficiaire:** limite transfert référent ([0055e7e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0055e7e72297b8fba26174b8e1c2736651e6d6a3)), closes [#1050](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1050)
* **bénéficiaire:** retours UI sur le transfert de référents ([f866f4f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f866f4f1feafaec64dfed336f6de6c979a883f8c)), closes [#1050](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1050)
* **beneficiaires:** ajout des objets d'accompagnement ([58b0b6a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/58b0b6a5b7fa169378c892df989502c7cb955596)), closes [#1098](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1098)
* **bénéficiaires:** améliorations ui du transfert de référent ([007ea82](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/007ea8263f9980bfeebb1085dd2deeec65e64026)), closes [#1050](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1050)
* **bénéficiaire:** validation des données d'entrée à la création de bénéficiaire ([8171f54](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8171f54b2ddd9e7a06eed9182a9e9ec8505de9ff)), closes [#1085](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1085)
* **bénéficiaire:** valide la structure des référents dans update-general-information ([b69b46c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b69b46cabd10008aabe49843dbd1fe2e962bbecb))
* **budget:** restriction d'accès à l'api selon les rôles ([0585c1a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0585c1a83ccf199706f2995c5cf037bfa6f03ce3)), closes [#1064](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1064)
* **historique:** afficher instruction externe ([e7b7a5c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e7b7a5c8bde2726f28f738ca8911d3b37cec9fd7)), closes [#1089](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1089)
* **notification:** ajout du rôle Référent aux notifications d'écheances ([73601ae](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/73601ae70be26356e9ea439023dfbe5465544b82)), closes [#1062](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1062)
* **RDVSP:** tracker le changement de statut d'un rdv ([1aa6257](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1aa62572deaa638e80e5d0029ec251fcb8362bcc)), closes [#1082](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1082)
* **scheduler:** tâches prenant en compte le jour déplacées après 2am ([126f538](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/126f53888c6a082f1babf00e595427e1df6d9784)), closes [#1105](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1105)
* **sso:** évite redirection inutile après login ([a2d1eb2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a2d1eb201a53251f8b8b8d567657e86f22dfe593))
* **sso:** suppression variables par défaut dans la configuration de l'auth ([b77a39d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b77a39dd7c86a2c930dece74c0197c83ec562f8d))
* **sso:** validation de l'url de redirection à la connexion ([5d9ea2d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5d9ea2d15729fa92308ebaaa065c3ef485a55ee2)), closes [#1066](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1066)
* **ui:** fuite mémoire de la modale ([03544f6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/03544f63aa3ef53b380a54af8b9b43bd27731d67)), closes [#1033](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1033)

## [1.58.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.57.0...v1.58.0) (2026-04-21)


### Features

* **data-inclusion:** ajout doublons à l'import v1 ([9dbb9d3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/9dbb9d3dc353de1ae15639ada0389cd781e049c4))
* **data-inclusion:** migration vers API Data Inclusion V1 (1/2) ([eaa9d8a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/eaa9d8acddbdeae885c453096db3bb624bee8ebf)), closes [#975](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/975)
* **db-anonymizer:** ajout du champ employeur du bénéficiaire ([c33778d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c33778d285032277ab3b883c9a9de82d12469039))
* **export:** ajout nom/prénom et n° de dossiers dans exports accompagnements ([8770eb3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8770eb30db420b639e8859696052368cfd5997ef)), closes [#800](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/800)
* **scheduler:** désactivation automatique des structures inactives < 10 dossiers ([6f5cad3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6f5cad35024b321040c2f3e9afb8f112a589ee91)), closes [#1072](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1072)
* **structure:** interdire la désactivation de structures avec activité dans les 6 derniers mois ([91c827f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/91c827f77af805b0880f973c5af463deef8dc4b3)), closes [#1069](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1069)
* **tableau de bord:** afficher une alerte sur les navigateurs Safari ([d883a41](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d883a41ccb0ec4d12d6c47d9db23d3c09d7c4b05)), closes [#1056](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1056)


### Bug Fixes

* **bénéficiaire:** ajout d'une sécurité sur les utilisateurs avec droits de modification partiels ([f1cb6ab](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f1cb6abecccfc318894008c3dda5980980726b02)), closes [#1065](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1065)
* désactivation auto des structures : config ([61ff5a0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/61ff5a0cd562b257c3818d3441e55ffd4ae9e0fc)), closes [#1072](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1072)
* **export:** supprime dayjs des modules d'export ([702e738](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/702e738ebe111626fae8613fda04920c1744dbf5)), closes [#1605](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1605)
* **MINISTERES:** nettoyage des anciennes enum ([cb82694](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/cb82694059b1c14bee499249ec367c5eb243f532)), closes [#1077](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1077)
* **scheduler:** optimisation de createAccountReminderMails ([ad74678](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ad74678009c4dc81984cc71d7212c7163a1ec175))

## [1.57.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.56.2...v1.57.0) (2026-03-31)


### Features

* **accompagnements:** ré-orientation des bénéficiaires ([493721b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/493721bb614f82d726568469681e3e7040e254e9)), closes [#480](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/480)
* **accompagnements:** ré-orientation des bénéficiaires (2) ([a31c97a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a31c97a16f28978197728aae368956ffe2217e71)), closes [#480](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/480)
* **document:** ajout variable d'activation du stockage des documents sur S3 ([e484936](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e48493692c3b0038bd5626aa962cb54e5e3cfa11)), closes [#937](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/937)
* **document:** introduit le chiffrement et le stockage des documents sur stockage objet ([64f1c27](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/64f1c27c2d5b5c35fad96b73ae2c6860cc748604)), closes [#937](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/937)
* **document:** préparation migration S3, initialisation env, dépendances et DB repo ([48f46bf](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/48f46bfd88e431501e3f0f02ff79d6ecf57d412c)), closes [#937](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/937)
* **redirection:** ajout redirection à l'archivage des bénéficiaires ([6818f9a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6818f9abe91539bfa76675cb163ba82b21016c22)), closes [#480](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/480)
* **redirection:** impression des redirections dans les accompagnements ([5f6ec79](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5f6ec798641119eceaef3d279b866228388a3505)), closes [#480](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/480)
* **réorientation:** ajouts dans les exports des accompagnements ([e4bf694](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e4bf694f20870c07ace67bc8f91f8bd9fd26fd60)), closes [#480](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/480)
* **statistiques:** ajout de sous titres aux entrées des stats ([75a2bc6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/75a2bc6c2499e8f2ff16ad1d71d9a5e65738478b)), closes [#480](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/480)
* **statistiques:** ajout nombre bénéficiaires concernés par réorientation ([7020aba](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7020abaeeebfcae275d3817d20897c0913355938)), closes [#480](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/480)


### Bug Fixes

* **accompagnement:** impression des accompagnements sans synthese ([c87363d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c87363d3abb4b61c6ee0c7ade6f10b8816c59ad0)), closes [#1049](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1049)
* **accompagnement:** nettoyage des retours de requète Prisma ([20303c4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/20303c4f2b0089a740dec38e6b3ea5f01757dcf4)), closes [#1048](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1048)
* **réorientation:** amélioration de l'export ([e70afe4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e70afe4e9a4a32b36521fa3721b48784bc263b0e)), closes [#480](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/480)
* **réorientation:** amélioration des messages d'erreurs formulaire ([bd8b119](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/bd8b1195199346a5e3d50dc9a48d65b6dbe39ce1)), closes [#480](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/480)
* **réorientation:** quelques fix mineurs ([a9e2c98](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a9e2c9878d15991f02554069f6870022133e8e6b)), closes [#480](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/480)
* **router:** corrige la redirection dans onLeaveFormComfirmation ([b0d8494](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b0d8494f63d3fb2eded7c6c23c9d92da1ef12429)), closes [#480](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/480)
* **statistiques:** améliore performance requête des redirections entretiens & instructions ([f79b80d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f79b80dc01867d66bf96fe5b6d274b2f27c6b89b)), closes [#480](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/480)
* **statistiques:** bug. Filtre objet d'accompagnement non appliqué ([302066e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/302066ebd4aa6dd0f5c39e606aa23715281c2eb9)), closes [#1052](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1052)

## [1.56.2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.56.1...v1.56.2) (2026-03-11)


### Bug Fixes

* **document:** ui formulaire de modification du document ([a017db6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a017db6845700cee6c9107e186c8cf7096ed3e6a)), closes [#1022](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1022)
* **document:** UI notification documents ([08ca85b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/08ca85ba0f4e8e77988a31554e1a8af3281a068c)), closes [#1022](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1022)
* **rdvsp:** corrige redirection vers page de connexion à la première création de rdv ([633bb38](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/633bb383eaeb2305e569a1e1062def5ef5e378c7))

## [1.56.1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.56.0...v1.56.1) (2026-03-09)


### Bug Fixes

* **rdvsp:** meilleure gestion erreurs ([6b2b9be](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6b2b9be8f0a31610a95521c74eaf04f5ee66c6e9)), closes [#1040](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1040)

## [1.56.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.55.1...v1.56.0) (2026-03-09)


### Features

* **document:** ajout date d'expiration des documents ([5d0ac1e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5d0ac1e942bb42aa77189a4af020634e17f6c11a)), closes [#1022](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1022)
* **document:** meilleure ui table des documents ([3afe95a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3afe95ab375cf606277a982a63b20e25a2a011f9))
* **ministères:** composant recherche de ministre ([6944320](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6944320258e679ff82648478c7d01eed977b2dea)), closes [#905](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/905)


### Bug Fixes

* **document:** ajout d'un message informatif sur le champ expiration ([4087df3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4087df3a473fe1609c936b570bdfbee00451fab0))
* **document:** alignement bouton ajout documents ([d5e6f71](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d5e6f71e0723cccf02d3e585092a5cb00396964a))
* **ministre:** améliorations du composant Ministre ([c5dfaf2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c5dfaf2d2b8b40e5ab515dfedf152c1bb5d30c0d))
* **utilisateur:** corrige formattage des emails lors de l'update et venant de Proconnect ([893e65e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/893e65e85ba8b124a0fb9b9f9a6ac46229645c4a)), closes [#1037](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1037)

## [1.55.1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.55.0...v1.55.1) (2026-02-23)

## [1.55.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.54.2...v1.55.0) (2026-02-23)


### Features

* **brevo:** envoyer un événement lors de l'activation de RDVSP ([ea94458](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ea94458bee0c09aa79b7429f53ae55a423fff503))
* **ministres:** création d'une table ministres et opération CRUD depuis admin ([d989508](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d989508cd502f9c82336c00964d996fcc65e8a6b)), closes [#905](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/905)
* **notification:** ajout notifications pour date de fin de prise en charge à M-1 ([d71c6de](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d71c6de62f02d806c9162c54c51b55b8fb395d61)), closes [#1030](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1030)
* **search:** ajout de la recherche par numéro Pégase ([6e80b68](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6e80b6808844a36321339e4f4d20ea6e612cb1a8))


### Bug Fixes

* **notifications:** règle pour les dossiers conserver 1 an supplémentaire ([60f2760](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/60f2760bcbd1ee7a27c1685ce694d613e00d8f31)), closes [#755](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/755)
* **structure:** fix focus sur les erreurs dans formulaire utilisateur ([287107b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/287107bfb2636d92e15f2b260f327cd23950e105))

## [1.54.2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.54.1...v1.54.2) (2026-02-09)


### Bug Fixes

* **bénéficiaire:** recherche de commune dès le premier caractère ([840deef](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/840deefc73ecbb6e8b39e2b054ebbba830892aa8)), closes [#1031](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1031)
* geo api ([dd51f3f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/dd51f3f4df4e8e7ec4a7a4502df8986aa4173f60))
* **scheduler:** inactive structure email message ([d9c82c0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d9c82c0ee29c89c4ef5f98045092777c9cf6ac4d))

## [1.54.1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.54.0...v1.54.1) (2026-02-08)


### Bug Fixes

* **scheduler:** errors in queries and import ([a864ea9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a864ea90895af0570ab81edddf1932521b258f4d))

## [1.54.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.53.1...v1.54.0) (2026-02-06)


### Features

* **cgu:** ajout date de dernière modification ([aff0d01](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/aff0d0104f178a16c91354feb98695ddb8627479))
* **cgu:** maj 2026 CGU et PC ([dfdfca0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/dfdfca082c1560dd1c7d96ba500915c22aad301e)), closes [#678](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/678)
* **logs:** add logs on admin actions ([c065625](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c06562514724d7ec07f07194b8014fcadb4fcb88))
* rechercher un bénéficiaire par numéro de dossier ([074a999](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/074a9992a5fbedb098e8baea6c669fe8228b65a6))
* **scheduler:** initialisation serveur tâches planifiées ([8b47bd4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8b47bd4ac196ecb064d4282a6974b607feb9c4cb)), closes [#959](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/959)
* **scheduler:** transfert des tâches planifiées (hors notifications) vers le serveur secondaire ([6402581](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/64025818bc02a361dee45ce48584aba290a8c8e8)), closes [#959](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/959)


### Bug Fixes

* **auth:** rétablissement fonctionnement initial du middleware skip auth ([b6d702f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b6d702fd090f7dcec3c2d397de0ec8ad7caca2f8))
* correction des tests ([2456b0a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2456b0a5f2128bdfd6c60a2f1f68c0d2b7bff7b8))
* **document:** vérifie l'accès suivant la structure, le rôle et le statut confidentiel ([ceba3dd](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ceba3dd13b04dd385c37a86e48816b4b7a97d750)), closes [#1019](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1019)
* **notification:** liste des recepteurs de notifications d'archivage ([828bd49](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/828bd4964a5a5f0a759501f87ba951d007cbef00))
* **recherche:** autocomplétion sur recherche par numéro de dossier ([301a1da](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/301a1da7945c40c92afb28d858a57ec5716e5777))
* **scheduler:** chargement par défaut des variables d'env déployé (NUXT_*) ([a75ad3e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a75ad3eccc58b3466150b553979a0b2c9513cd40))
* **scheduler:** déploiement en échec car compilation en esm ([a3604b7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a3604b78fd203d78519fbbbabe0fc1a695175df2))
* **scheduler:** déploiement en échec car compilation en esm (procfile) ([d8a0472](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d8a047218cc8b1f074e0e09ea8044c5b5c54c528))
* typo cron ([59d0596](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/59d0596469e576e2080affd12f43b281b89af48d))

## [1.53.1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.53.0...v1.53.1) (2026-01-28)


### Bug Fixes

* **auth:** déstructuration incorrecte mène à des erreurs 404 lors de l'expiration du token auth ([9fb41b9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/9fb41b9e51f07b0dd2595505a4f7be6cac0e74ab))

## [1.53.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.52.3...v1.53.0) (2026-01-27)


### Features

* **rdvsp:** affiche le type de rdv ([f0221d3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f0221d35697bf4e609293c174b9767237aff2595))
* **rdvsp:** afficher le créateur d'un RDV ([4bc667b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4bc667bc41eba3aea279bcfc741df62c382662b0))
* **rdvsp:** amélioration ui de la carte rdv ([eb907ae](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/eb907aea6c1f7593f10f847a3b5fb5092fe39b82))
* **rdvsp:** mettre à jour les infos bénéficiaires sur rdvsp avant de prendre un RDV ([38803e0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/38803e0edb30debbc0a75ca1afaf2702e691fbd7))
* **rdvsp:** refonte de l'intégration ([84af401](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/84af401691d1b6c2042b68ba58aab7cc048b6828))
* **rdvsp:** un utilisateur sans org rdvsp est redirigé vers une page d'erreur après connexion ([7935a8f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7935a8fc3acca2cb5eb35992d36839ab7b59f0ae)), closes [#734](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/734)


### Bug Fixes

* **archivage:** supression de la mention de conservation du nom et prénom ([0224569](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0224569be14bb870644549824da8162e36e6cdac))
* **atelier:** éviter le rechargement de la page lors de la mise à jour d'une présence ([d66732b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d66732be3cfea3f07eaf748b097d507fd66e93bb)), closes [#1010](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1010)
* **auth:** add app host to redirect ([8903b74](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8903b744368acab3f9b7df228245624723597e9b))
* **bénéficiaires:** ajout de la nationalité kosovare ([69636fe](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/69636fe313b033a19fe57043d65e240314f0b7c4)), closes [#1012](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1012)
* **bénéficiaires:** amélioration du fichier d'export ([ce70e94](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ce70e944d32899208b1cbfd770625362fb8da1c0)), closes [#1007](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1007)
* **export bénéficiaires:** colonne numéro téléphone 2 ([a420844](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a420844a3413a3b93528d3d308554770026a8a43)), closes [#1007](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1007) [/gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/1007#note_3019319856](https://gitlab.com/incubateur-territoires/startups/monsuivisocial//gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/1007/issues/note_3019319856)
* **fileInstruction:** fix handling date's display ([abf69e6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/abf69e6fbb92bf42753eebe61cefd098b528e48e)), closes [#970](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/970)
* **filtres:** erreur safeParseAsync ([446b717](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/446b717214906d42ca8f1f248038d3d0a89e4c26))
* **historique:** gérer le cas où l'utilisateur est déconnecté de RDVSP ([67d054d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/67d054d5224d9839de694027d98d0e194097a613))
* **historique:** pouvoir fermer l'alerte RDVSP ([40babf4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/40babf4cc3133cbbb5fe8326ba3dc065826f7579))
* **notification:** Date de fin de prise en charge des Demande de logement ([4390385](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/43903852b5ee5926dae1caacc0c7a0f54805834a)), closes [#1008](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1008)
* **rdvsp:** afficher le nom complet  ([c16853b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c16853b86f430699782ec47b46dd540dd3061147))
* **rdvsp:** alignement des buttons d'action ([cd8d67e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/cd8d67e75a651eed24abebf17ee1a7494a113c1c)), closes [/gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/merge_requests/1450#note_3019199638](https://gitlab.com/incubateur-territoires/startups/monsuivisocial//gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/merge_requests/1450/issues/note_3019199638)
* **rdvsp:** check organisation validity even if the rdvsp connection should work ([0e62215](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0e62215f7dc8e0a65986e3e96dd9b5f3cea2d9d5))
* **rdvsp:** corrige la MAJ du statut des RDVs collectifs ([32abc98](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/32abc98c8f8759ac6a0e53a6acec09ecba1493ec))
* **rdvsp:** erreur 401 en cas de compte external_account inexistant ([99bd951](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/99bd95113a60bc8ee7ac142a494c314a26010380)), closes [#734](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/734)
* **rdvsp:** gestion fuseaux horaires formatte les dates des rdv en utc ([33152ee](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/33152ee165574ff65a06bc7df02698b79e787854)), closes [/www.notion.so/incubateurdesterritoires/Commandes-utiles-1f9744bf03dd8041aeb4d5f151082040#240744bf03dd80799df1e3bf625](https://gitlab.com/incubateur-territoires/startups/monsuivisocial//www.notion.so/incubateurdesterritoires/Commandes-utiles-1f9744bf03dd8041aeb4d5f151082040/issues/240744bf03dd80799df1e3bf625)
* **rdvsp:** ne plus stocker le champ expires_in des tokens ([b718964](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b71896465c2fe5eb33801bfe76bb8844b1192725))
* **rdvsp:** permet la reconnexion en cas d'invalidité du refresh token ([ae7e2fd](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ae7e2fdb791c019c94530358846c857819d80004))
* **socialSupports:** corrige le filtre sur les types d'accompagnements ([31b27e6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/31b27e6a8d0f08a3a3965fbc416723178d90cc8c))
* **user:** permissions de création et de lecture d'utilisateur dans la configuration de la structure ([e84d7c8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e84d7c8ed893a00472a7b65f24f8f56e53c2ed82)), closes [#1011](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1011)

## [1.52.3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.52.2...v1.52.3) (2025-12-15)


### Bug Fixes

* **document:** ajout d'une zone de versement ([e794c55](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e794c557980c95228a2db105634c9adab5056546))
* **filtres:** ajout de règle de vérification des tranches d'ages personnalisées ([3ae02e7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3ae02e75f6da040e634eec2c89f9b8dad8bd1f9e)), closes [/gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/974#note_2947525890](https://gitlab.com/incubateur-territoires/startups/monsuivisocial//gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/974/issues/note_2947525890)

## [1.52.2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.52.1...v1.52.2) (2025-12-08)


### Bug Fixes

* **db-anonymizer:** correction de la suppression des tables en production ([d885bed](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d885bede26b7382d93ad7b7825edeeee0398ddfb))

## [1.52.1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.52.0...v1.52.1) (2025-12-08)


### Bug Fixes

* **db-anonymizer:** ajout activités utilisateur et nettoyage base cible avant import ([57f4a05](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/57f4a05d17770b1060e91a5dc2921c47479f81f0))
* **partenaire:** limite la longueur des champs data inclusion dans le formulaire ([3c9079c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3c9079cd4c66218b6b648d13118e3e5e37562688)), closes [#999](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/999)

## [1.52.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.51.0...v1.52.0) (2025-12-03)


### Features

* **archivage:** afficher les objets d'accompagnements ([2274ed8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2274ed890266e2800b20075238b6381f70387d7c)), closes [#943](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/943)
* **ateliers:** ajout d'évènement Matomo pour chaque atelier dupliqué ([fa30d26](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/fa30d26d6ff8db1fd46be83fa9d4173d18ba2e40)), closes [#980](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/980)
* **db-anonymizer:** script d'anonymisation des données pour export mb ([6bd9bce](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6bd9bcead0bea26b26ceb110f1623fe1fd8aed38)), closes [#698](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/698)
* **logs:** suppression logs activité utilisateur vieux de plus de 12 mois ([107ee05](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/107ee05a1b7232b6ceb723426ce6447164680aa3)), closes [#969](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/969)
* **rdvsp:** ajout du type rdv brouillon dans les accompagnements ([40a837a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/40a837a423baafb04772e0760b914746820b99f3))
* **structure:** modification des informations et suppressions des comptes utilisateurs par RS ([2b7e0ae](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2b7e0ae3901e98e2e21c59f373b9d696d14a39e0)), closes [#785](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/785)


### Bug Fixes

* **accompagnement:** Suppression d'un compte-rendu privé par un autre utilisateur ([ea96ad8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ea96ad8a61b6388975ddcbf37c74296a1ecabef6)), closes [#966](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/966)
* **archive:** baisse la limite des objets d'accompagnement à 3 ([3795935](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/37959355dc1b36d4329cebe3ee6d8d79a1cc87b2)), closes [#943](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/943)
* **ateliers:** switch payant sur page dupliquer ([ce8fc20](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ce8fc20be855fe4d2191f3add8d2a66de4d1113e)), closes [#978](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/978)
* **ateliers:** tri des participants de l'export par nom de famille ([6862326](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6862326e7dc3f9e7542af242e524775a93569b6c)), closes [#945](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/945)
* **budget:** ajout d'un budget d'un autre membre du foyer ([6d4a1a5](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6d4a1a5e0a45aa42f94cc96f07832602f8f9c0c0)), closes [/gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/950#note_2899676378](https://gitlab.com/incubateur-territoires/startups/monsuivisocial//gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/950/issues/note_2899676378) [#950](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/950)
* **configuration:** améliorations ui et textes ([da62efc](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/da62efcce7c2aa82a5ac11aab2b39ff5a90be62d)), closes [#992](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/992) [#991](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/991) [#990](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/990) [#989](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/989)
* corrige la couleur principale des boutons radio & checkboxes ([e84e7ef](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e84e7efc53e39d7abc0693dfee48a202cdd8e318))
* **db-anonymizer:** rajout FKs et dernières tables ([3e35e2b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3e35e2b4d7ea2a47e140a334a820ad8f231cbf0a))
* **db-anonymizer:** utilisation de psql pour le dump des données anonymisées ([f9be661](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f9be661c84837fe93b95494002ef0d339c6bc4fc)), closes [/www.postgresql.org/docs/14/sql-copy.html#id-1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial//www.postgresql.org/docs/14/sql-copy.html/issues/id-1)
* **documents:** Renommer facilement un document au moment de l'ajout ([72d57f8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/72d57f85dfcfc388155857281cb79e7196b7d167)), closes [#904](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/904)
* **document:** suppression astérisque champs renommer le document ([b305799](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b305799767c8f457c122c7de59940cc7f1332056)), closes [#904](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/904)
* **export:** Amélioration de l'export xls du module budget ([eba9553](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/eba95537004c5204e335adc8a5a3da164254bd90)), closes [#950](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/950)
* **filtres:** déplacement du tag 'non-rensigné' en dehors de la zone cachée ([47d2509](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/47d25098dcfb10b074fb206800937333069e58da)), closes [#988](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/988)
* **filtres:** rétablit le résumé des filtres cachés ([a9b9437](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a9b94372f81f4b62d3562724c1b70f6ad9aecdc8))
* **foyer:** empêche le bénéficiaire principal d'un foyer d'être dissocié ([698720a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/698720a4991c8b01c3cb9fa55499986a24d6c076)), closes [#962](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/962)
* **historique:** masquer le filtre type d'entretien ([4c6f100](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4c6f100ab543a91e26a215f70522b18e8eb61a6d))
* **logs:** suppression sentry ([925d44f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/925d44fa239ef1765e6e621482a48b42b6c8a35c))
* **menu:** renommer les éléments du menu utilisateur ([f750064](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f750064dfb78e392359a526a858eff067f8222ce))
* modification des permissions vue détail des agents ([6342c2a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6342c2ab8daff1a3e6f53214eac2a962fc19f12f)), closes [#986](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/986)
* **permissions:** l'instructeur ne peut voir le détail de l'entretien que s'il l'a créé ([54da617](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/54da617b1ad5e2b5a983654199b9b78017f09baa))
* **permissions:** maj des permissions sur les instructions pour instructeur ([5a98dd1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5a98dd153a91f076e1e7f615e5d0b747f492ae5d)), closes [#951](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/951)
* **role:** maj tableau des rôles et accès impression ([fe536de](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/fe536dea69ab389024791d0983dcbd7ab8d9aa56)), closes [#951](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/951)
* **stats/workshops:** utiliser des queries en POST pour les stats des ateliers ([ff445d7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ff445d7ea4ab6a2a22236c2e49f381c6f61b4d8d))
* **stats:** utiliser des queries en POST pour les stats bénéficiaires et accompagnements ([afa052a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/afa052a5dd3effb148e857f63e31c4f0bb9db788))
* **ui:** ajoute largeur minimale navigation ([0fa893f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0fa893f7f3b81c4bd5da0aeb5e5a3b4a6426bf58)), closes [#954](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/954)
* **ui:** remplacement du composant combobox dans l'ajout d'un membre au dossier ([45d280c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/45d280c4167ce62226b944ebc3324368a2fa7324))

## [1.51.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.50.0...v1.51.0) (2025-10-28)


### Features

* améliorations des vérifications d'autorisation ([9ab9b89](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/9ab9b8957d0dd7f75b2dbb5e0b3a0405d14e0dee)), closes [#907](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/907)
* **ateliers:** ajout des ateliers payants et somme perçue par participant ([f571704](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f571704c1688a9fae88f8fea6f49ef2171b858ab)), closes [#929](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/929)


### Bug Fixes

* **ateliers:** ordre des conditions dans formulaire atelier ([ff19bab](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ff19babdcb330015687024c484cd16848c2f25f0)), closes [#940](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/940)
* intégraton de la dépendance tsx au runtime pour la gestion des schedulers scalingo ([4353f4c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4353f4c1c0d9a8308be59df28868f363f52ea893)), closes [#936](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/936)
* **ministre:** fix typo ([1d37d6d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1d37d6df5c53a8cd801869bec05994c39e43377b)), closes [#905](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/905)
* **ministres:** maj 2 octobre 2025 ([2f96bfc](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2f96bfceb630bcd3d627c796f5455ec837009fb1)), closes [#905](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/905)
* **ministres:** Mise à jour de la liste ministres oct25 ([14709b0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/14709b0098266c837a95f6b2a02e9257bb027143)), closes [#905](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/905)
* **sso:** suppression rafraichissement token changement tab et allongement durée token MSS ([abfea5e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/abfea5e4b4302be9bf56b4052d1ae6491eeb59da)), closes [#941](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/941)
* **workshop:** améliore tuile participants extérieurs anonymisés ([72d0aec](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/72d0aec3b25157f16177ce3896467470ad5c2821)), closes [#936](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/936)
* **workshop:** majuscule nom participants externes ([8cbdb8f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8cbdb8fd874141794b33cff1e26717dac6ddafce))

## [1.50.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.49.0...v1.50.0) (2025-10-09)


### Features

* **ateliers:** modifications des infos d'un participant ([7711627](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/77116276c5b4ec7328c6c560fc6ac495d7920e16)), closes [#929](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/929)
* **statistiques:** export des statistiques d'ateliers ([945c723](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/945c723c5cb3012c271bc6f887028b01432499b7)), closes [#911](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/911)
* **stats:** ajout des ateliers ([85a791f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/85a791fa692e34957a2c38a626e1d5a33b8dbb10))
* **workshop:** planifie exécution archivage des participants externes via scalingo scheduler ([f697e21](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f697e213b3e3127efd3bdf7bd9fd6e3ac8e57a26)), closes [#791](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/791)
* **workshops:** tooltip participant anonymisé ([5600487](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/56004871a267fd73157624dcd3949c64a0e8216e)), closes [#791](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/791)


### Bug Fixes

* **api:** corrige les codes postaux dans l'api indicateurs ([d41a91d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d41a91d147ba14b2f6efaa1051075b22c6e24ddd)), closes [#921](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/921)
* **atelier:** ajout d'un titre sur export d'émargement ([c206b9a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c206b9a3e610488b8dadc17e7d0beb9169b640d1)), closes [#894](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/894)
* **export:** message de la modale ([d048447](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d0484471b63842a31b932c9f579ba7414fc618c6)), closes [#886](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/886)
* **modale:** correction de la hauteur minimum ([db20f69](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/db20f697dbaa4c6ca30060b89b5c14f5067a0c03))
* **statistiques:** corrections sur l'ui ([5f0f568](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5f0f568c9cd598aa0e90de9a14aa2371f9a244a5)), closes [/gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/merge_requests/1349#note_2790621520](https://gitlab.com/incubateur-territoires/startups/monsuivisocial//gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/merge_requests/1349/issues/note_2790621520)
* **statistiques:** met à jour le graphe chartjs lorsque les données d'entrées changent ([9cd63ac](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/9cd63acf5b3667361abe89e8ef57e2a34602e739)), closes [#930](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/930)
* **stats/workshops:** corrections sur les calculs de stats ateliers ([53a0745](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/53a074504d30cf5dc8896010107459cf3411d08c))
* **stats/workshops:** harmoniser les requêtes groupBy ([b338d99](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b338d99c887c7c064a5a751d49f62d09b67e707e))
* **workshops:** correction affichage carte statistique vide ([c638a2e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c638a2eca03841821c0c4985d063a2212dfdb668)), closes [#911](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/911)
* **workshops:** filtre carte Partenaire quand on filtre sur les organismes partenaires ([ace1675](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ace1675933d5a340ba03052f06a43c99728f4a02)), closes [#932](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/932)
* **workshops:** filtrer les noms d'ateliers vides dans les stats ([518b20e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/518b20ecb53253982c03cd17eaacda0965f335dc)), closes [#933](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/933)
* **workshops:** ordonne cartes statistiques dans l'ordre décroissant ([cd89f90](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/cd89f904ad3f25abd8b7d66aef6b5c86eea0adce)), closes [#931](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/931)

## [1.49.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.48.0...v1.49.0) (2025-09-30)


### Features

* **api:** ajout info activité utilisateur API Métriques ([d99123d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d99123dfe06a2a3b174db3328aa4df49954a89f4)), closes [#921](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/921)
* **api:** fusion des résultats pour les structures ayant le même siret ([7ad7f63](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7ad7f63769d6a8fab242567222fee56f7f8f06ee)), closes [#921](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/921)
* **atelier:** dupliquer un atelier ([0af3099](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0af30992429e0c61db77448f4c743f3ee1a487a1))
* **atelier:** gestion de la liste d'attente ([63b6c94](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/63b6c9435b45dc6604c0f90694da5dab1963d9e5))
* **ateliers:** ajout de bénéficiaires à un ou plusieurs atelier depuis page bénéficiaire ([b29a9cb](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b29a9cb0c80f53597659bbf06d1a3fbeb3d4cb0e)), closes [#897](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/897)
* **ateliers:** export des ateliers passés ([7588406](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/75884062b6e53ad099ea07b14b1e82e27a467327))


### Bug Fixes

* **admin:** ouverture des pages structures dans nv onglet ([88f3d33](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/88f3d331f03098a88381724714f4a6d71baffd3a))
* **api:** correction timeout api indicateurs ([544ac3b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/544ac3bd1dc11b0a3c67d69bccd0045a49432613)), closes [#903](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/903)
* **atelier:** Info participations de la page atelier ([7c743f9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7c743f96016d8d18717ff10c2e2b247afb5bedd8)), closes [#913](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/913)
* **beneficiaire:** redirections cassées des tabs du foyer ([76ba9dc](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/76ba9dc069fa24a710e87f3b35123a2b3083afa5)), closes [/github.com/nuxt/nuxt/issues/22663#issuecomment-1680734388](https://gitlab.com/incubateur-territoires/startups/monsuivisocial//github.com/nuxt/nuxt/issues/22663/issues/issuecomment-1680734388) [#908](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/908)
* **layout:** aligner les boutons des tuiles historique à droite ([61f4346](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/61f43469f5eb2a05c9c20f159069181684a1eaee))
* **sso:** réapplique corrections et revient au rafrachissement de sesion antérieur ([36833d0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/36833d0a307f9216d97abd8cd28356513ecddad1))
* **ui:** correction de priorité css sur icone option de participant ([a5f474e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a5f474e9e6e04349c9445cbb4b55393864db4d4b))
* **workshop:** ajout bénéficiaire unique à un atelier depuis la fiche bénéficiaire ([5ed9f91](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5ed9f917c6e22f2c061b67e98ff1d0b7d0e99fea)), closes [#917](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/917)
* **workshop:** désactivation export ateliers passés ([b5cd542](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b5cd542497b0e29b3e4c6659824f2948b9a2cc81))
* **workshop:** diverses amélioration de l'ui ([ad54042](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ad540420edb3b5c4ef88bd9b5831c60fbbc8d96d))
* **workshop:** fix attendance status badge ([ac8a8c1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ac8a8c1af8a81be45e84d892569c16cbc58dcdc1))
* **workshop:** fix attendee count db constraints ([a4f1c51](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a4f1c5183dc79187688ef9132afeec3860deaef9))
* **workshop:** fix attendee limit deletion ([f96461c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f96461c9dd95b172aaed444cfdfaa9a81239971e))
* **workshop:** fix list date filtering ([6a53aae](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6a53aae7aaf248df5ab576e839e0b9ab1ba6d325))
* **workshop:** fix success messages' typos ([26a5a0f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/26a5a0f09c4f598d847ce1f648f5a41cfe347b86))
* **workshop:** fix waiting list display ([69fc7ff](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/69fc7fffdb1f3e8acf72ea1088a37bab37a48fe9))
* **workshop:** supression du nom d'atelier à la modification si nom d'atelier devient orphelin ([69c2796](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/69c279640c1341927cf85fedf980fa79d6783e8c)), closes [#910](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/910)

## [1.48.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.47.0...v1.48.0) (2025-09-01)


### Features

* **accessibilité:** ajout d'un plan de site ([e9f7f2e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e9f7f2efcf7e77bb44b24898d3694118306ce8af)), closes [/accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#12](https://gitlab.com/incubateur-territoires/startups/monsuivisocial//accessibilite.numerique.gouv.fr/methode/criteres-et-tests//issues/12)
* **accessibilité:** ajout de zone d'entête et pied de page ([1da67fa](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1da67fa4e5d493a64316a0341b15ae157627b84b)), closes [/accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial//accessibilite.numerique.gouv.fr/methode/criteres-et-tests//issues/9)
* **atelier:** ajout de la page Ateliers au menu et plan de site ([30ffee2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/30ffee25192ea20943b641bc39c7ec8c773fee14))
* **atelier:** ajout des filtres sur la liste des ateliers ([f9b883f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f9b883f00fd108d39c6345f9d8fce5692c69a2ed))
* **atelier:** archivage des ateliers et mise à jour de la date de dernière activité ([f1ce120](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f1ce120f9c2d21c72f2bff018296f27f06e1c035)), closes [#885](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/885)
* **atelier:** badge d'info présence à remplir ([75102d4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/75102d49e2a5806e4b5ac906cf8a0e29e04fe004)), closes [#883](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/883)
* **atelier:** mise à jour de la présence des participants ([221ba3c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/221ba3c839d7c37b8d91203a9357ba41cb059c02))
* **ateliers:** téléchargement de la liste d'émargement ([f48ac76](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f48ac76e50cf284814fbddc8af09b8d782d7696f))
* **combobox:** composant combobox plus générique ([83dd4df](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/83dd4df31ff7a190582ab9451476a531571a574f))
* **workshop:** ajout d'un participant externe à l'atelier ([538011f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/538011fd25c36100400690f95f6483c914abc797)), closes [#791](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/791)
* **workshop:** modification nom atelier courant ou tous ateliers ([884d006](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/884d006648970465447b18ee6ea02f0c34953971)), closes [#865](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/865)


### Bug Fixes

* **accessibilité:** ajout d'attribut aria manquant ([01f8b07](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/01f8b07fca1ab8e48abfe26e6b3cdf0de5259313))
* **accessibilité:** ajout d'une navigation configuration ([23abc6d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/23abc6dcff15331611e7518f7546c7e8a26d215c)), closes [/accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#12](https://gitlab.com/incubateur-territoires/startups/monsuivisocial//accessibilite.numerique.gouv.fr/methode/criteres-et-tests//issues/12)
* **accessibilité:** amélioration de l'accessibilité des pages Ateliers ([ab35dcb](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ab35dcba993fcfa20cee5061e5b61a9590bfab1f))
* **accessibilité:** amélioration titre de page des dossiers d'instruction ([5d94937](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5d949375aeffb95f098910ed334719b1473a925c))
* **accessibilité:** améliorations de la visibilité des éléments sur petit écran ([c18e0f5](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c18e0f56439184d6efd73c5e21caae8fa846ab89)), closes [/accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#10](https://gitlab.com/incubateur-territoires/startups/monsuivisocial//accessibilite.numerique.gouv.fr/methode/criteres-et-tests//issues/10)
* **accessibilité:** amélioraton de la navigation clavier ([e556289](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e5562894c363c86882f3905fcd1e9f7400702419))
* **accessibilité:** bouton Créer une synthèse accessible au clavier depuis combobox ([a09fed8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a09fed81bbe19e513a0c92edd9adde7a34170218))
* **accessibilité:** corrections des erreurs sémantiques ([6172766](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/61727668dfd862049dc73c42bee3b44897907eef))
* **accessibilité:** diverses amélioration d'affichage ([5937164](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5937164083b999621a4ded1e5055213864d0a2b9)), closes [#1281](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/1281) [/gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/merge_requests/1281#note_2710401701](https://gitlab.com/incubateur-territoires/startups/monsuivisocial//gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/merge_requests/1281/issues/note_2710401701)
* **accessibilité:** logo MSS plus lisible ([f34bdff](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f34bdffbd3476a96c4f2d5e49ee21718036ab2b1))
* **accessibilité:** supprimer repetition de texte des boutons ([e09bc70](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e09bc701a8375798c4cae9e468c1fb1adff1a01d)), closes [/accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial//accessibilite.numerique.gouv.fr/methode/criteres-et-tests//issues/6)
* **archivage:** Marquer comme "lu" les notifications d'archivage après conservation du dossier ([201115c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/201115c3ddaf8f18bd1d0d41e79aea5a4d39a18b)), closes [#850](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/850)
* **atelier:** bouton d'inscription sur page bénéficiaire ([095098f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/095098f53532dc90b474622473c1a65e4fdb5c58))
* **ateliers:** date des ateliers des DROM ([937e311](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/937e3116b3cf7595b1526dceb616678951d5f9e6)), closes [#866](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/866)
* **boutons radio:** les boutons doivent être accessibles au clique souris ([4819c90](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4819c90823ad50fe9ef8955e4b7f8aa8dcce5719)), closes [#887](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/887)
* **layout:** mise à jour du logo MMS ([abfc134](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/abfc134d493c3de0c98e93dd8a013732f7a59de2))
* **multiselect:** éléments cliquables sur le texte et case à cocher ([a9515cf](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a9515cfd234f58be310c1c4c0c776493f10897bf)), closes [/gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/881#note_2714732167](https://gitlab.com/incubateur-territoires/startups/monsuivisocial//gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/881/issues/note_2714732167)
* **notification:** supprimer les notifications d'archivage quand un dossier est conservé ([cbb5e81](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/cbb5e81aa5d28476fd7c02e7a829b6ccf0770af3)), closes [#850](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/850)
* **partenaire:** ajustement de la limite de caractères des horaires de permanence ([c4ffdbd](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c4ffdbd97811c42050d9b767ee36030e05930e48))
* **plan du site:** ajout d'éléments au plan et gestion des droits ([659d9da](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/659d9da3aca53c1e98955f3bbc61f12c9f41a22e))
* **socialSupport:** rendre possible la modification de casse d'un sujet d'accompagnement ([60f42b3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/60f42b3c8b9b9fa30c0ae1fda8c94326cc11fc93))
* **sso:** correction apparition modale inactivité ([982dc73](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/982dc73b5a98acde4571808d7a8dc355c2a293c0)), closes [#815](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/815)
* **workshop:** rend obligatoire le mode et le nom dans le formulaire de maj ([fd6f1e5](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/fd6f1e591b88e9ce59c14b7a20e0add94d1f348a)), closes [#865](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/865)
* **workshop:** restrictions pour le rôle référent ([7c75f44](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7c75f446e3464efe6bb40290ee8a43b6db5d3aea))
* **workshop:** suppression du nom d'atelier lorsque plus aucun atelier n'y est relié ([c7a933f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c7a933f6ab3c47f16ca51ca03c617edb0ec9b99c))

## [1.47.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.46.0...v1.47.0) (2025-07-29)


### Features

* **ateliers:** page liste des ateliers ([2b75801](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2b75801f5a26c49e8ba32e82174953fb442d6d19))
* **brevo:** active les MàJ auto pour toutes les structures ([694b611](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/694b611d41b6fc40d796deee13abf3b292e6d123))
* **export:** ajout téléphone entourage export bénéficiaire RS ([eb76408](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/eb764080a14ffdd74adb82120fff3b67106bb6cf)), closes [#867](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/867)
* mise à jour auto des attributs Brevo ([9b3fae3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/9b3fae363d33281e9ab0706d15e2470a0a37dd47))
* **workshop:** add type check constraint for workshop attendees ([ef3fdec](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ef3fdecccec3f8094baa8aa88f2517068eb3bd8b))
* **workshop:** ajout de la liste de noms d'ateliers déjà existants ([63b5f1a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/63b5f1a37d340f7920dc9ab4a4e61c3e8afa2bde))
* **workshop:** ajout du modèle de données pour les ateliers ([74778b6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/74778b67866bab1d402272afb9c711818009ec39))
* **workshop:** ajout permissions à la création et tests API ([368b1f3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/368b1f3dc6a28151433d8ea82a6147c73690af86)), closes [#791](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/791)
* **workshop:** ajout résumé erreurs formulaire de création ([57e52e4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/57e52e4605a33f507ff4c7eddb1153256a90d15d)), closes [#791](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/791)
* **workshop:** intégration front de la page Atelier ([cc6e6a4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/cc6e6a4ad859ec0e9f25e6d646c804c201fc46d0))
* **workshop:** modale de modification du nom d'atelier ([e41af54](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e41af548b50c004d77b696b2e2168fbdc81512c8)), closes [#791](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/791)
* **workshop:** modèle de participant atelier et API ajout suppression, maj statut participant ([ca2f62f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ca2f62fcf72534479fcdc0329347f6a5ebaf7fcb)), closes [#791](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/791)
* **workshops:** affichage de la liste des participants ([2aebf87](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2aebf87b0f9e601e3ea53f249742966e1ce317e0))
* **workshops:** modifier un atelier ([f242d23](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f242d23f6bdbaaa14dd279651e5c056c09d71428))
* **workshop:** suppression d'un atelier ([f0c10d6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f0c10d6490ccc00eaf018746b39eb1542e6331ac))
* **workshop:** suppression de participant ([c84d9cf](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c84d9cf678b8a942e719fed3bbee45385284055d))
* **workshop:** update workshop name (backend) ([ba072b9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ba072b99768233dd3466d4794c058879103b2829))


### Bug Fixes

* **accessibilité:** diverses améliorations techniques ([b212104](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b2121046bae013fc1e506520c8bf2cb5569a2025))
* **accompagnement:** lien des demandes de logement dans liste accompagnement ([7927008](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7927008a61a0908b92c90477d064234903bd2604))
* **ateliers:** amélioration de l'affichage des tuiles ateliers ([8898997](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/88989972278ee2fbdd6a4e16cbb76dac6422f002))
* **ateliers:** badges en fonction de l'heure des ateliers ([4ed1a53](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4ed1a531852dcdcbcf1455e03c13b8ce13be733e)), closes [#862](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/862)
* **ateliers:** Contraindre l'heure de fin en fonction de l'heure de début ([9b7541e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/9b7541e7770e78374409913df966106a3b43b870))
* **ateliers:** les ateliers du jour passent dans onglet 'à venir' ([c306fe3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c306fe3acf2cc2aca26b440a05cde6e86641947e)), closes [#862](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/862)
* **atelier:** suppression des liens imbriqués ([c9a02ee](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c9a02ee4714edada896cdf4221d12c2eebf1ee28))
* **brevo:** correction du calcul d'un attribut utilisateur ([3b1bdcb](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3b1bdcb213fd10bed13232d61e9bd1b08387e755))
* **Brevo:** use runtime config for API key ([4d4db4e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4d4db4e50866d6ac51b04b3b4f29f1ba46a2e782))
* **budget:** fix delete income mutation ([e15518c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e15518ccae593aa378187396b85a174238ba9d0b))
* **budget:** La suppression d'un revenu compte dans le calcul de la date... ([96554fc](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/96554fcf281a00e977c7c7317ed1b9f582e385cc)), closes [#659](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/659)
* fix Brevo API key not set ([f47829f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f47829f0156ad3cc863fd81df1632dd060605479))
* **formulaire:** sélection recherchable corrigé ([54b1f50](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/54b1f502f333df895ba0adac73800054f542a8ee))
* **historique:** la page scroll jusqu'à l'accompagnement séléctionné ([d430579](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d4305792c486c1cab8090bbe3ebc3a39c3c2d127))
* **recherche bénéficiaire:** ajustement visuel des résultats de recherche ([a16c345](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a16c345a732e9f3cb536f9495fae0e1225264677))
* **workshop:** corrige le filtre date de la query des ateliers ([8dcea55](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8dcea55452ecf469fdc5a7dff50dcb5093929d96))
* **workshop:** désactivation de l'émargement ([b4121cd](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b4121cd720e27f801e5e8b32b4039ac060f35939))
* **workshop:** filtre les participants pour le rôle référent ([228000a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/228000a3b058d113166c1a619f51ec6f71666a0b)), closes [#791](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/791)
* **workshop:** gestion des noms partagés ([639ff7e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/639ff7e80f8a5b34817cf6bea94916bb9cd20974))
* **workshop:** mise à jour nombre d'inscriptions ([082b89b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/082b89bfde4390ab7d362b56eda25a3929b4b59e)), closes [#856](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/856)
* **workshop:** prendre en compte le startTime dans la liste des ateliers ([461b46a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/461b46aa23e6fcd5dab6f172a3b700ad7d1a9108))
* **workshop:** réinstaure l'encart de recherche ([fbd8b7b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/fbd8b7b59baac36579103be9047927e69b0190ed))
* **workshop:** rôle référent ne peut accéder qu'aux participants dont il est référent ([4bf7f95](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4bf7f954740f4c4b396ae43855c765bafc616a47)), closes [#791](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/791)
* **workshops:** amélioration des pages front ([988ff79](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/988ff79043b8087aec316f47fc1522c780f35392))
* **workshops:** déplacement de suppression dans form de modification ([cbceb9a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/cbceb9a1c82e824ae37796bba35c7c898172ad4d))
* **workshops:** diverses améliorations front ([15e40bb](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/15e40bb2c735c68d02a6287ec0bccc9a37a7afad))
* **workshops:** intitulé sous-titre ateliers ([7c92987](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7c92987078efbaf80da77f454e9821524aee2f31))
* **workshops:** le retour vers la liste des atelier affiche le bon onglet ([bc52af6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/bc52af6f1183d8ba1c1ef4c89ed4dc0d3779365d))
* **workshops:** premières corrections après tests internes ([3dfbbb0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3dfbbb0149a11ca64cfeea053665307326222a74))

## [1.46.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.45.0...v1.46.0) (2025-06-19)


### Features

* **bénéficiaire:** amélioration de la recherche (tolérance aux fautes de frappes) ([14711c5](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/14711c5b22b0986c1646089699d3a9246bd2d3a6)), closes [#691](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/691)
* **bénéficiaire:** tri des résultats de la recherche bénéficiaire ([465dcce](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/465dcceb517ab8841cf7ae47883813538648141b))
* **matomo:** ajout de tracker matomo sur les liens du formulaire synthèse d'entretien ([342ed78](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/342ed7818b662bc082d05b9cdb74e6c8671bb7da)), closes [#826](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/826)
* **matomo:** nouveaux trackers sur formulaire création bénéficiaire ([fd6b09e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/fd6b09ed594e0187a06c5cc8eba8bbec3e76dfcf))


### Bug Fixes

* **accessibilité:** amélioration de l'accessibilité de la page partenaires ([8d9aa19](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8d9aa19be06e02edc8bc604b2b521e45a1ba9194))
* **accessibilité:** amélioration du menu principal sur petit écran ([8937ec5](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8937ec5012885c7e52c7a2e2071c9bf5d36f1161))
* **accessibilité:** Refonte composant SearchableSelect ([af0743b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/af0743bc74c3a6bf805d5671898a403898907829)), closes [#828](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/828)
* **accessibilité:** repositionement du focus sur modale ajout de document ([1b00a73](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1b00a7314472a15d895610282d190efdc036535a))
* **accompagnement:** résolution des liens du tableau et améliorations d'accessibilité du tableau ([a766bb6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a766bb622bcf165434d45b6aabe1976060949d88))
* **bénéficiaire:** supprime la réactivité des titres des tabs ([59e35ee](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/59e35ee24c0bc2b7073ced83fb14e8ef40104c25)), closes [/github.com/dnum-mi/vue-dsfr/blob/43e228d6b20c751b1af36eeda6f0b49840c7c65f/src/components/DsfrTabs/DsfrTabs.vue#L88](https://gitlab.com/incubateur-territoires/startups/monsuivisocial//github.com/dnum-mi/vue-dsfr/blob/43e228d6b20c751b1af36eeda6f0b49840c7c65f/src/components/DsfrTabs/DsfrTabs.vue/issues/L88) [#844](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/844)
* layout de la page d'erreur ([935fc40](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/935fc40d19a25281f056a88f5f60330c6bb7556d)), closes [#679](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/679)
* **notification:** correction des liens vers les bénéficiaires ([6220213](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6220213224083e0f1ce459a821fd55bd139f73b9)), closes [#847](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/847)
* **rdvsp:** passer le paramètre page aux appels rdvsp ([771fa3b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/771fa3befaaff5306f617d2781d893d4a3a4fda7))
* **statistiques:** supprimer la limite du nombre de filtres maximum ([47e2686](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/47e2686232a3ff68ade152225d5f801cd972eb7c)), closes [#740](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/740)

## [1.45.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.44.0...v1.45.0) (2025-06-02)


### Features

* amélioration des logs en mode développeur ([d6b8b00](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d6b8b001a1fb9142ab3565c93be5080e5f0a0805))


### Bug Fixes

* **bénéficiaire:** suppression du mode brouillon ([f8debdf](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f8debdf224ca9b54ce3d99aa3d9c79d95a216552)), closes [#798](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/798)
* **beneficiary:** amélioration visuelle du formulaire court bénéficiaire ([e98dd81](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e98dd8147c4c317b8ab3d24a9f0cc8717e6ac3e0)), closes [#798](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/798)
* content height ([6f38c34](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6f38c34006a197aff00225d120592cdec86b1b49))
* correction sur le layout ([9b1e985](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/9b1e985dfbf30adabb8d90cea48656e0ae3b2e21))
* décalage date de notification ([8c143aa](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8c143aad2ecf8939d052a649aa5f9fc86055238e)), closes [#822](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/822)
* fix status badge label ([6d5b0c7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6d5b0c7c48a1e5659781d8be96c40a9d1e9cee1a))
* **followups:** correction des liens de la page Accompagnements vers un dossier foyer ([57d558e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/57d558ef06f56f6178b59df5bba119484beb484d))
* **permission:** permissions des exports en back pour les ministères ([c2e6e16](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c2e6e16db43af27d68bbeff67bf150ac69417f9e)), closes [#818](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/818)

## [1.44.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.43.1...v1.44.0) (2025-05-22)


### Features

* **statistiques:** si ministère retirer accès stats pour TS et instructeurs ([2ba82f5](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2ba82f5855bac5ac4029e4b8450931f9c2ac691b)), closes [#818](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/818)


### Bug Fixes

* **bénéficiaire:** correction du bug d'affichage du statuts bénéficiaire ([7bea286](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7bea28672cde9659a0dc2b7c9646fcebeceb0d6b)), closes [#823](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/823)

## [1.43.1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.43.0...v1.43.1) (2025-05-20)


### Bug Fixes

* **accompagnement:** les dates des accompagnements sont décalées dans les Antilles ([45fdc9a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/45fdc9a95e20ba046437268f7f93e4440c637835)), closes [#711](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/711)

## [1.43.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.42.0...v1.43.0) (2025-05-19)


### Features

* **accessibilité:** ajout de sections ([4b22bf1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4b22bf1ba3e431004bdb71677555cd7683b49801)), closes [#545](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/545)
* **accessibilité:** ajouter un lien d'évitement ([0637455](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/06374555a5f06b6aa8980bc45c873ec21b27ee94)), closes [#340](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/340)


### Bug Fixes

* **accessibilité:** Amélioration de l'accessibilité des barres de progression ([d9c27a7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d9c27a7fe683f63a28f33de10fd7a2617961ebdc)), closes [#554](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/554)
* **accessibilité:** amélioration du tableau de bord ([abb6363](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/abb6363928ec35b4d9495568bb298ac91f3a70d1)), closes [#801](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/801)
* **accessibilité:** diverses améliorations ([f386fce](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f386fcea93eba75a410fbe9f57709d5177663f42)), closes [/gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/724#note_2501704591](https://gitlab.com/incubateur-territoires/startups/monsuivisocial//gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/724/issues/note_2501704591)
* **accessibilité:** Mise à jour de la déclaration d'accessibilité ([7265086](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/72650866c46c6d9bc7151b68aea915f963481932)), closes [#809](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/809)
* **accessibilité:** reset du focus lors de changement de page ([94eb488](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/94eb4887ac72831b4b84bcd197e0b313aa9030da))
* **accessibilité:** Retrait des points médians ([f94c8fa](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f94c8fae668c272a5b75f6857277741ece22d99d)), closes [#807](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/807)
* amélioration des modifications d'accessibilité (1/n) ([467ed73](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/467ed736ab70d15443883a4a98f5bfbc57548a4c))
* beneficiaire infos ([e9ac0e4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e9ac0e4db6b92c3b824f79efefa00259d68f8ab6))
* corrections sur la recherche bénéficiaires ([98beff4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/98beff435f9c0f54255769d68e9d77029c21fb99))
* **emailScheduler:** ne pas exécuter d'action lorsqu'il n'y a pas d'emails à envoyer ([7cea64a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7cea64ab973eaa3512ef57b5d272c7690a332576))
* extend node memory ([a38e5f2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a38e5f2da089d277ae28a66dfc37e5c9a8a13194)), closes [#802](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/802)
* **global:** Control flow erroné sur transactions Prisma conditionnelles du backend ([a669074](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a669074d2ab676798cbaf755133e0f897817aff1)), closes [#797](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/797)
* **rdvsp:** erreur de chargement de l'historique lorsque l'utilisateur n'est pas connecté à RDVSP ([b02a37c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b02a37cac927f35c707fb77881a5c5ac47740099)), closes [#802](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/802)
* **rdvsp:** sync des rendez-vous plus récents que l'avant-veille uniquement ([be03ff6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/be03ff67c3ece2e187fb71ec7fa4bb9c75f44554)), closes [#802](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/802)
* **sso:** autorise adresses admin en ext.anct.gouv.fr ([3fb7231](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3fb7231aa616732a32f0a275103b2d77114e7733))

## [1.42.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.41.0...v1.42.0) (2025-04-28)


### Features

* **admin:** ajout d'un attribut Brevo acces_MSS ([f0dfd0d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f0dfd0d30b0a3c5a9f2b92f53faf2a59162a7364)), closes [#789](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/789)
* ajout panel d'info dates erronées DROM ([84c2cab](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/84c2cab18f7c59f56ce5442955fd6fd28583f7e1)), closes [#711](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/711)
* **beneficaire:** ajout de filtres pour les structures type ministères ([913d17a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/913d17a2322885b9424eddc695717d3b771f7913)), closes [#766](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/766)
* **beneficiary:** ajout d'une tranche d'âge 18-25 ans et moins de 18 ans ([7d6a04b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7d6a04b2236fa708f35b8262da3a3d6674dd8d14))
* **budget:** afficher la date de dernière mise à jour ([b5b8b30](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b5b8b301ef409f6e60fdcb20cc6f30e893c9ed4f)), closes [#659](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/659)
* **email:** renvoie un e-mail 'création de compte' après 2 semaines d'inactivité ([0492776](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0492776c2bccb4a703fdbd2da782a283e5b69870)), closes [#686](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/686)
* **ministère:** ajout ministre avr 25 et typo bando info DROM ([8b45b22](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8b45b222d7e4e07faf853a477713920b4d45f546)), closes [#777](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/777)
* **sso:** authentification / connexion à l'espace admin ([6f0579b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6f0579bec14d524079330ac528f2c7d4bf6ddd97)), closes [#604](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/604)
* **sso:** autorise tout type de 2FA et améliore texte page d'erreur connexion ([46ff56d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/46ff56df06adb8558d336d9a700be34a4579c496)), closes [#604](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/604)


### Bug Fixes

* **annuaire:** augmentation du nombre de caractères limite dans champ 'nom du partenaire' ([7cc9e51](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7cc9e51acd59d93b4779a08c63867985aa002203)), closes [#783](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/783)
* **auditLogs:** corrige la valeur de targetId pour certains activités ([f6f4e4f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f6f4e4f39793ac885608580be744802b0cd2bc4d)), closes [#748](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/748)
* **beneficiaire:** Détection de doublon, ne pas envoyer le référent s'il est inactif ([c9093c9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c9093c963f1c28fbc3406a3d771175161f574745)), closes [#784](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/784)
* **beneficiaire:** détection des doublons sur tous types de statut de dossier ([cbe5ca3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/cbe5ca3885cfab08820ed1c7abf8505ba475de5a)), closes [#784](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/784)
* **beneficiaire:** permissions de la fonction delete-draft ([862f874](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/862f874aa04f1f927a791477b0d72dc12e10b6a6)), closes [#751](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/751)
* **beneficiaire:** Pole Emploi devient France Travail ([db64825](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/db648258d1a503d0b0ba635ca005e7cf83afe843)), closes [#735](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/735) [heads#L133](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/heads/issues/L133)
* **Beneficiary/documents:** make table not scrollable ([6951ca9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6951ca97060ecbd49efb2b67c0917dba8693e2d7)), closes [#768](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/768)
* **beneficiary/documents:** réduction légère de l'espacement des icônes d'action ([9ff73ec](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/9ff73eccd44a14e6be210937e51ed35a24d0ef7e)), closes [#768](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/768)
* **beneficiary/fileInstruction:** rendre le champ contacts d'organisation... ([a1421a7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a1421a7ff6c5b2107787245c5f00312ac331718e)), closes [#712](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/712)
* **beneficiary/info:** affichage de la date de décès du bénéficiaire le cas échéant ([6d9f3d1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6d9f3d1a7e5eea9f93a40ee7ad6d49c192072556))
* **Beneficiary:** transformation du filtre d'âge en multiselect ([859eb13](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/859eb13bab7dbf81bd25a9af8d0b321969ecb77e)), closes [#736](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/736)
* correction d'une typo sur le prepareFilters des fileInstructions ([9845494](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/9845494b42f4dc5babcb2f9e3737b46193ec346d)), closes [#770](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/770)
* corriger les mismatch d'ID pour le SSR ([9e0847a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/9e0847a22a21a18f60bea4cb6dc6c426e4c6f421)), closes [#796](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/796)
* **fileInstruction:** disable the contact field for the instructorOrganization if relevant ([d480644](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d4806448178cff4b9f350829934624dfc0a40f75)), closes [#712](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/712)
* **matomo:** corrige l'envoi d'événements pour la fonctionnalité de lien d'un bénéficiaire à un foyer existant ([3dfd551](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3dfd551754059b363442ad8478c8955a009a5593))
* **navigation:** rendre le menu visible sur petits écrans ([a50d75a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a50d75aef3b28eede1e001b43e4c3ea43aea173e))
* Retirer le badge 'beta' de la LP ([4f153fe](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4f153fe4fd066020103814cf9178fa16a9d83c40))
* **socialSupports/fileInstructions:** ajout du filtre par période sur les dossiers d'instruction ([55bb945](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/55bb94561d1701caf064b2aab9064c3a73bdac97))
* **statistiques:** arrondi sur les montants en euros ([ac53e93](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ac53e932dc62c539901f091feb46e7fd74b7c882)), closes [#758](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/758)
* **stats:** rendre le filtrage par référent disponible pour le rôle travailleur social ([ab9e0f3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ab9e0f38ea517bfcc2b12276f81fe4ec2ddbda19)), closes [#767](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/767)
* **structure:** anonymisation des structures désactivées restantes ([04634f3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/04634f3fecd1e32ed2a66d53311cad3dbb35847a)), closes [#762](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/762)

## [1.41.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.40.1...v1.41.0) (2025-04-08)


### Features

* **archive:** envoi des notifications de rappel J-7 et J-0 des bénéficiaires à archiver ([201c7a2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/201c7a2e25c74b65c41b989f733b80dd0ca9cb8c)), closes [#755](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/755) [#741](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/741)
* **beneficiaire:** ajout des champs dans l'archivage, l'export, la supression ([2cd82bd](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2cd82bd1ae7379d4925be6fdeace2d1009e07613)), closes [#750](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/750)
* **beneficiaire:** ajout des champs schoolName & isSchoolInQPV ([b2c3207](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b2c32072c7aa2ebb23794a929db1ccf6019fce7d)), closes [#750](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/750)
* **export:** ajout code vérification à l'export des bénéficiaires ([b8f557c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b8f557c6517064feb6af205d252d74c846f96119)), closes [#559](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/559)
* **export:** export des bénéficiaires pour tous les rôles ([3af6208](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3af62082c2e63f6c9b6d8469c636719d249f7722)), closes [#559](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/559)
* **familyFile:** lier un bénéficiaire existant ([e6435a4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e6435a4f4b8952bd4a2c360f6e1dff139a38c540)), closes [#720](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/720)


### Bug Fixes

* **admin:** empêche de créer un administrateur à partir de l'espace admin ([02dffe8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/02dffe8fe1b3172954155c99af09998642dda6a7))
* **archivage:** ajout d'évènement matomo ([fd2e5cd](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/fd2e5cdbc4101958452066fd5ec7b1bc023c324a)), closes [#752](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/752)
* **archivage:** mise à jour du tableau des rôles et habilitations ([2e8ba99](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2e8ba99bfd9344f281d3d5d63e51a5726070d83e)), closes [#746](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/746)
* **archive:** archivage possible après 1 an 11 mois d'inactivité ([a7b50a7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a7b50a7199daa3d8e1279db694bf907939bf9f20)), closes [#741](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/741)
* **archive:** envoi rappels uniquement pour archives à venir et modifie labels... ([6e1fd83](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6e1fd83c59c7768e1c01548487b186bc13cb18e2)), closes [#741](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/741)
* **archive:** simplification de la requete des bénéficiaires inactifs ([ddf6a0e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ddf6a0e246786b9b23ea3e0b81510f4086ac9a5c)), closes [#771](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/771)
* **archive:** suppression doublons dans la modale des bénéficiaires à archiver ([8583109](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8583109992de7900df9a8dfd42320bd8fd4e0b15)), closes [#771](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/771)
* change student label ([fa07b5c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/fa07b5c9108b2c4e6fbbaaa10ce536cd80162cea))
* changement de wording sur l'ajout de bénéficiaire ([98c6d0a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/98c6d0a0e6ac43a80a30355320917822d8496467))
* corrections UI mineures sur l'ajout/lien de bénéficiaire ([e530227](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e5302279063bfa22e4095e430feb8426b9a35fab)), closes [#720](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/720)
* **export:** 8 caractères dans le formulaire du code de validation ([959e1e0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/959e1e0fb5cab86a214ae4d902b07b3ce5c6de0c))
* **export:** ajout log d'activité pour les exports d'accompagnement ([63057d7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/63057d77f8be9aa1a844a2dcaa7e865294e130a7)), closes [#559](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/559)
* **export:** suppression colonne entourage et améliorations UI ([7733787](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7733787fd3da1529519be0957f16a15b3bdd5730)), closes [#559](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/559)
* **notifications:** message d'info pour les agents dans onglet archivage ([850d863](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/850d86304586b0df2368b66dde25d4d5c60667ca)), closes [#719](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/719)
* **rdvsp:** change le formattage des dates en backend ([62e2f2b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/62e2f2b67c28906809736ff6071379a513f9f14d)), closes [#741](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/741)
* **rdvsp:** suppression de la conversion de fuseau horaire de l'heure du rendez-vous dans la BDD ([91a5896](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/91a589600277a55e7882f530d669f78e3e8647e0)), closes [#764](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/764)
* **rdvsp:** suppression des statuts des rdv dans le filtre de l'historique ([a66a69c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a66a69c5ccd1ac4f1040477df60181ca9e5ef08f)), closes [#764](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/764)

## [1.40.1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.40.0...v1.40.1) (2025-03-07)


### Bug Fixes

* **archive:** Modale s'affiche une seule fois à la connexion ([93202b2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/93202b2e733fd4020aa519ee9589e45315eba369))

## [1.40.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.39.0...v1.40.0) (2025-03-06)


### Features

* **api:** ajout de la ville à l'api indicateurs ([f12fb4b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f12fb4b711bc0696b720110b01a1c96b29185e55))
* **archivage:** notifications ([e9d1e88](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e9d1e88ba4abd5f01eb131192bcb7b95cdec622f)), closes [#719](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/719)
* **archive:** ajout du bouton archive sur page bénéficiaire ([6a3494d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6a3494d10abb83c3f5967b020aff24f6676b5f33))
* **export:** journalise les exports bénéficiaires ([687069c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/687069c59c94a36123f1c81f1adeee9c0583b21e)), closes [#559](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/559)
* **rdvsp:** trace la modification du rdv dans matomo ([1a3746f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1a3746f12d85db68246fc98664a1454f470f21b9)), closes [#744](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/744)
* **sso:** suppression d'inclusion connect ([90119f7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/90119f71df40dcffb273cf3d820f8bcfc65ab2ea)), closes [#727](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/727)
* **sso:** suppression du menu mon compte à la suite de la suppression d'IC ([b40c4f7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b40c4f783b048081ab7970d834334831a23ae65b)), closes [#727](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/727)
* **structure:** anonymisation des données relatives aux utilisateurs d'une structure désactivée ([52d2d9c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/52d2d9cd48bbbe2c59e8c4f5eb059b8119afe779)), closes [#745](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/745)


### Bug Fixes

* **archive:** ajout d'éléments manquants dans l'export ([0d508e7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0d508e739df8b52ac726326f3d8a032b1646ef08))
* **archive:** ajout des champs manquants à l'export du bénéficiaire pour l'archive ([d767569](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d767569a5dd66c2631b9e53967cfa082afc3e67b)), closes [#725](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/725)
* **archive:** exclue les rendez-vous de l'export du bénéficiaire ([a789e64](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a789e64e04f5a158172d911757b5d2441143e2f1)), closes [#725](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/725)
* **archive:** exclusion des agents d'accueil des notifications ([8768c45](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8768c454a1ac90283bb7052ae8c300f107a26e58))
* **archive:** fix des permissions de l'export d'archive ([8dab91a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8dab91a99ce7ab2a6c8e4db8799e8970a76ec8bc))
* **archive:** n'affiche pas la section Actions si non nécessaire ([34081bc](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/34081bc28f43b76d3f28629b71af9b8dfed5bd01)), closes [#725](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/725)
* **archive:** permissions de l'export ([2904cc8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2904cc866abd62b901f6e39881775fa0fd894cd5))

## [1.39.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.38.0...v1.39.0) (2025-02-20)


### Features

* **archivage:** pas d'option de conservation nom et prénom pour Ministères ([0ae1160](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0ae116034595d867d1318fc00e33cf4cea15f3ba)), closes [#730](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/730)
* **rdvsp:** ajout squelette de modale dans le cas d'un foyer de plus d'une personne ([ef74ae8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ef74ae83fc64a68514df8483f5d437f9d8de505e)), closes [#526](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/526)


### Bug Fixes

* **documents:** ajout de plusieurs documents à un suivi ([5a5897d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5a5897d1321344fb6a3be21dcf84d06a7a7e1bda)), closes [#738](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/738)
* **rdvsp:** alignement modale de prise de rdv ([ee746d8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ee746d861cc95df8c07b704f90aca29e1974fae8)), closes [#526](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/526)
* **statistiques:** adaptation à la nouvelle version de l'export de données ([444d6f4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/444d6f46001d66d3f57a2d3885484879460ad4da)), closes [#739](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/739)
* **statistiques:** correction du copier-coller des images ([0ae7e01](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0ae7e015cfab3ec22154d6c99820e93d31ed5fd8)), closes [#739](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/739)
* **structure:** activation conditionnelle du bouton de désactivation ([d477215](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d4772157a19f03e4baf22b6ca6df5396764c6edd)), closes [#676](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/676)
* **structure:** corrections de l'action de désactivation de structure ([b526d85](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b526d8568eda7d63fa15ed5f2091befd2becef7c)), closes [#676](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/676)
* **structure:** permettre la désactivation de structure à tout moment ([5d38965](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5d389652602a884840baae1c4d77db895f10a7a6)), closes [#676](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/676)

## [1.38.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.37.0...v1.38.0) (2025-02-16)


### Features

* **archivage:** ajout des documents et budget à l'archive ([15757b2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/15757b29ebac1fad39c3251104c2d993528add42)), closes [#709](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/709)
* **archivage:** conserver le dossier 1 an supplémentaire ([6184189](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/618418982deef731be9c28d5a365464bcf51470d)), closes [#717](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/717)
* **archivage:** creation des permissions ([919a9d5](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/919a9d516574b1badf22707b66881baa74ed4931)), closes [#710](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/710)
* **archivage:** export des dossier en pdf ([9b6e410](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/9b6e41021fc14ea1645dbff9b9c5a95d513bbae8)), closes [#695](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/695)
* **archivage:** historique des dates de conservation ([789205f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/789205f0cb45913bf8245839aa44e4ba2e8519bf)), closes [#723](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/723)
* **archivage:** l'action 'supprimer le dossier' supprime sans archive ([ae44a58](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ae44a584b5dbe8d7fc941b8f11e0aa8b08438fa6))
* **archivage:** suppression du bénéficiaire de la bdd ([47580e8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/47580e8229d56b3ff3d27356127f8fbc3dd8f5b1)), closes [#713](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/713)
* **archive:** export des fiches en page HTML ([82b1987](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/82b19870a758871953b13e3d39c066e8420774c3))
* **archive:** garder des infos pour statistique dans table archive ([87dc2ca](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/87dc2ca4a2badc6f12d1d4aee6414abb0840a2fe))
* **bénéficiaire:** enlève les documents de l'export bénéficiaires ([5953c66](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5953c66789498f3c79e20f672955ddbceb44cd3a)), closes [#707](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/707)
* **rdvsp:** ajout de l'heure du rendez-vous dans l'historique du bénéficiaire ([af98fac](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/af98fac0a70d3e2cc57c124e937357dab17c104d)), closes [#526](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/526)
* **rdvsp:** ajout des rendez-vous à l'historique du bénéficiaire ([641f322](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/641f322ea091bd5e47b521701717443f91e4698c)), closes [#526](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/526)
* **rdvsp:** ajout du statut à venir ou passé du rendez-vous ([a53d662](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a53d662955b275a5463ea6b846450e943769fc46)), closes [#526](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/526)
* **rdvsp:** prise de rendez-vous avec RDVSP (V0) ([49efc49](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/49efc49eb01cb7ce4e5b026d8c90905aaf5e1238)), closes [#526](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/526)
* **rdvsp:** redirection vers l'historique du bénéficiaire à l'issue de la prise de rdv ([16c67a9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/16c67a982ee5db4ad545d3bfa4f8dfe6a764d23e)), closes [#526](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/526)
* **rdvsp:** ui de la page de redirection améliorée ([3821656](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/38216562cb450a3377d29ddb138f5c175e4769ce)), closes [#526](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/526)


### Bug Fixes

* amélioration de l'affichage des filtres ([c064d61](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c064d612657336057d4dc2df58c7d35e53543f63)), closes [#708](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/708)
* **annuaire:** champ libre du téléphone dans les organismes partenaires provenant de Data Inclusion ([7d1fbc2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7d1fbc2ea5bff0a3d0f01b779d4d75dbeb0266c3)), closes [#715](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/715)
* archive permissions + nvl fixture ([137b9b5](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/137b9b5e89ad46ba955a7062bb80eb63b762d20e))
* **beneficiaire:** ameliore formattage et validation du numéro de téléphone ([cff3e2e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/cff3e2e1988bd8e4a030fc571bef1041626b833b)), closes [#715](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/715)
* **beneficiaire:** améliore performances export bénéficiaires ([c4ecfc0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c4ecfc08db9e4cd3dbe87bc2a849308d00b81626)), closes [#707](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/707)
* **bénéficiaires:** amélioration du bloc filtres ([d65e704](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d65e7044a070c7321dd562fd6839666c9c27bd5e))
* **document:** enlève la possibilité de téléverser des svg ([3eaa1f1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3eaa1f1c44bcdfa76a7a5a7a988ecefe0b7cb57f))
* **email:** fix envoi mail à la création structure, utilisateur ([1f2e59c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1f2e59c67390d03460c07d493619ca3c002bb615)), closes [#706](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/706)
* **qpv:** le filtre QPV doit toujours être visible ([da7ab31](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/da7ab3162bd076b5c9bf09b5416f85eb46728539))
* **rdvsp:** ajout snackbar,matomo,correction typo ([1425344](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/142534432f2b563811dcfe14771fb50ad751e82e)), closes [#526](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/526)
* **rdvsp:** améliorations ui tuile rdv ([4218f47](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4218f47bd8cbc6b8e4aef48610a67796fcf2745b)), closes [#526](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/526)
* **rdvsp:** avant première connexion d'un utilisateur renvoyer une erreur... ([58d0a57](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/58d0a5750b30684dde21705b81a8338350fb3f88)), closes [#526](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/526)
* **rdvsp:** css de la carte de la demande de logement ([19c3dd9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/19c3dd9e9f020fee0a4924eccd0ccc815ebc446f)), closes [#526](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/526)
* **rdvsp:** déplacement du bouton de prise de rdv ([7835724](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/783572476e6afb72208ce7f15fedcd0f28b03a1a)), closes [#526](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/526)
* **rdvsp:** suppression de l'encart des rdv sur la page d'accueil ([c8cd775](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c8cd775d5812ac70d1c096d23391bce544a29c45)), closes [#526](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/526)
* typo objet d'accompagnement ([ec47c86](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ec47c86a2d4480a702ccd39aeb74f1b49a6238e5))
* **ui:** format du texte du bandeau d'info après migration dsfr 1.13 ([1756f8e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1756f8e91069eb94645dfb738a895fb682cdc666))

## [1.37.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.36.0...v1.37.0) (2025-01-07)


### Features

* **archivage:** création d'une page archivage et ses composants ([a49d6ef](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a49d6efe5d3407fd9d43d26ba8c5e23882a662a1)), closes [#687](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/687)
* **ministres:** mise à jour ministres jan24 ([081a368](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/081a36840641e4dbb3cd91c6880a8089d082c7b1)), closes [#700](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/700)


### Bug Fixes

* **brevo:** déasactivation de brevo chatbot ([fb8fa99](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/fb8fa995f5ba8d92c65a8a4813ebbf69ad24fd97)), closes [#696](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/696)
* migration ministres ([a4393d7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a4393d78d4f81cf9d3ccaae12d40291e48cd2d01)), closes [#700](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/700)
* **ministres:** rajout gouvernement et réordonnancement ([5f5d285](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5f5d285c6a22c2f0ccf2b97734871da0c84f06f1)), closes [#700](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/700)

## [1.36.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.34.0...v1.36.0) (2024-12-11)


### Features

* **budget:** ajout de charges et revenus personnalisés ([c53b927](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c53b927b0bf568ac2fef658e5f1944a4140e5902)), closes [#660](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/660)
* **budget:** défilement de la page vers l'élément sélectionné du formulaire charge du foyer ([1ba0215](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1ba02155f7082f34c39bef6acfd4fda8147f3f59)), closes [#654](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/654)
* **budget:** exporter le budget en doc excel ([6f972d6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6f972d6dcfe0f2140d0f7f94d0298b149d80522b)), closes [#504](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/504)
* **dossier:** amélioration des champs adresse du formulaire ([ebb67ce](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ebb67ce716892485612dfa881e24ed4885df17e9)), closes [#520](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/520)
* **statistiques:** ajout du filtre ministre ([7f15b70](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7f15b70f46dad825f5122dd49b7cb41b0bf80dbe)), closes [#672](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/672)
* **statistiques:** ajout nombre de foyers concernés pour les stats beneficiaire ([d85732a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d85732ad7e121cadb01e219324c7db3f0789d1f6)), closes [#661](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/661)
* **statistiques:** Carte durée des entretiens ([2c78a3e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2c78a3e6cf53fdb23d376c75b3ae89a4017d801d)), closes [#668](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/668)
* **statistiques:** carte durée moyenne d’un entretien ([14dd33c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/14dd33c48e077083ba4df7dc62100272a6b5c73f)), closes [#668](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/668)


### Bug Fixes

* **bénéficiaire:** ajout de permission au module budget ([125b3ad](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/125b3adc0a6cbee73ebd3ef234168b8f48750fe0))
* **bénéficiaire:** champs département et région visibles ([038fe80](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/038fe806653c7086ef8d15f737578812b186fad8))
* **statistiques:** ajout des nouveaux bénéficiaires créés au filtre période ([4b7b273](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4b7b273de26ca6364023b5d6f4db80e84d1a6cba)), closes [#661](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/661)
* **statistiques:** ajoute le nombre de bénéficiaires créés dans la période ([0f8198e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0f8198e8d710a96b031ae7dc5b9e206c4c03045b)), closes [#661](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/661)
* **statistiques:** corrections d'erreurs dans les exports ([556b406](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/556b40602e88ff9f9bcfc6ca31b5cf040935663a)), closes [#683](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/683)
* **statistiques:** filtre ministre pris en compte dans la requête d'interpellation ([f144612](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f1446121a348d1482dbf995a690f61aa5757b7de)), closes [#672](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/672)
* **statistiques:** le filtre période filtre sur la date de création des bénéficiaires ([5d2c570](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5d2c5708314fe8b187fd650291a8226b7cc0c70d)), closes [#661](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/661)
* **statistiques:** les filtres sont tous visibles par défaut ([4983736](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/498373615626e6712dd1ccbcb3441a703244148e))
* **statistiques:** pas d'affichage des stats si le nombre de bénéficiaires est 0 ([83ce4f3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/83ce4f3cc6597ee7917a5c84df71e96113b0fca0)), closes [#661](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/661)
* **statistiques:** requête d'interpellation sélectionne uniquement les ministres filtrés ([d7245a0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d7245a0bb0b52ad222e7226b5c07a0f4341ec4c0)), closes [#672](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/672)
* **utilisateurs:** correction ligne module budget dans tableau des rôles et habilitations ([27c9868](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/27c986808e9e02504db7b266417ab9bee1a61e7a))

## [1.35.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.34.0...v1.35.0) (2024-12-11)


### Features

* **budget:** ajout de charges et revenus personnalisés ([c53b927](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c53b927b0bf568ac2fef658e5f1944a4140e5902)), closes [#660](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/660)
* **budget:** défilement de la page vers l'élément sélectionné du formulaire charge du foyer ([1ba0215](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1ba02155f7082f34c39bef6acfd4fda8147f3f59)), closes [#654](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/654)
* **budget:** exporter le budget en doc excel ([6f972d6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6f972d6dcfe0f2140d0f7f94d0298b149d80522b)), closes [#504](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/504)
* **dossier:** amélioration des champs adresse du formulaire ([ebb67ce](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ebb67ce716892485612dfa881e24ed4885df17e9)), closes [#520](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/520)
* **statistiques:** ajout du filtre ministre ([7f15b70](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7f15b70f46dad825f5122dd49b7cb41b0bf80dbe)), closes [#672](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/672)
* **statistiques:** ajout nombre de foyers concernés pour les stats beneficiaire ([d85732a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d85732ad7e121cadb01e219324c7db3f0789d1f6)), closes [#661](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/661)
* **statistiques:** Carte durée des entretiens ([2c78a3e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2c78a3e6cf53fdb23d376c75b3ae89a4017d801d)), closes [#668](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/668)
* **statistiques:** carte durée moyenne d’un entretien ([14dd33c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/14dd33c48e077083ba4df7dc62100272a6b5c73f)), closes [#668](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/668)


### Bug Fixes

* **bénéficiaire:** ajout de permission au module budget ([125b3ad](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/125b3adc0a6cbee73ebd3ef234168b8f48750fe0))
* **bénéficiaire:** champs département et région visibles ([038fe80](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/038fe806653c7086ef8d15f737578812b186fad8))
* **statistiques:** ajout des nouveaux bénéficiaires créés au filtre période ([4b7b273](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4b7b273de26ca6364023b5d6f4db80e84d1a6cba)), closes [#661](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/661)
* **statistiques:** ajoute le nombre de bénéficiaires créés dans la période ([0f8198e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0f8198e8d710a96b031ae7dc5b9e206c4c03045b)), closes [#661](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/661)
* **statistiques:** corrections d'erreurs dans les exports ([556b406](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/556b40602e88ff9f9bcfc6ca31b5cf040935663a)), closes [#683](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/683)
* **statistiques:** filtre ministre pris en compte dans la requête d'interpellation ([f144612](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f1446121a348d1482dbf995a690f61aa5757b7de)), closes [#672](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/672)
* **statistiques:** le filtre période filtre sur la date de création des bénéficiaires ([5d2c570](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5d2c5708314fe8b187fd650291a8226b7cc0c70d)), closes [#661](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/661)
* **statistiques:** les filtres sont tous visibles par défaut ([4983736](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/498373615626e6712dd1ccbcb3441a703244148e))
* **statistiques:** pas d'affichage des stats si le nombre de bénéficiaires est 0 ([83ce4f3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/83ce4f3cc6597ee7917a5c84df71e96113b0fca0)), closes [#661](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/661)
* **statistiques:** requête d'interpellation sélectionne uniquement les ministres filtrés ([d7245a0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d7245a0bb0b52ad222e7226b5c07a0f4341ec4c0)), closes [#672](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/672)
* **utilisateurs:** correction ligne module budget dans tableau des rôles et habilitations ([27c9868](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/27c986808e9e02504db7b266417ab9bee1a61e7a))

## [1.34.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.33.0...v1.34.0) (2024-11-28)


### Features

* **brevo:** ajout chatbot sur la page d'accueil ([bd5ebfd](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/bd5ebfdf9f8ef415d818c6ddae2838e0c0056193)), closes [#669](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/669)
* **security:** ajout hook pre-commit de détection de secret ([8bead26](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8bead260e562977a38eeff3f7d01ca3f9c534c22)), closes [#667](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/667)
* **sso:** désactivation d'Inclusion Connect ([b30c915](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b30c915547e23b5cf6183c0d689d08cc057fb1de)), closes [#640](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/640)
* **statistiques:** ajout filtre tranche d'âge ([c1267a5](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c1267a5201496895389042da56bc7bf68d745ef7)), closes [#661](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/661)


### Bug Fixes

* **auth:** redirection pour comptes désactivés ([6a919f6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6a919f680e3a5aec2877ebe5076033790ba92ce3)), closes [#658](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/658)
* **statistiques:** nouvelle librairie d'export d'image ([66105c3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/66105c3a31aa37f10addf9b396999843d64c4787)), closes [#663](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/663)

## [1.33.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.32.0...v1.33.0) (2024-11-25)


### Features

* **brevo:** ajout date de première connexion & utilisateur/structure avec >=1 suivi ([0dac351](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0dac3517f9aa1a2ca5235ee6afd90535ec40d2ba)), closes [#626](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/626)
* **sso:** suppression d'inclusion connect ([c687cf3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c687cf3b8fc91df957dd3d2b93cc8effaf84d532)), closes [#640](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/640)
* **stat:** exporter les graphiques ([5eadb4f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5eadb4f9d717a37ea0c052df0c3be08b3ff98991)), closes [#629](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/629)
* **statistiques:** ajout des filtres non renseigné pour les entretiens ([cb12f05](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/cb12f05ff0100104999255fbdf7bb586d5df0361)), closes [#489](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/489)
* **statistiques:** ajout des montants des aides délivrées ([510293b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/510293b8c23def5a7d0af8d92669d82da08bce85)), closes [#517](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/517)
* **statistiques:** ajout filtre non renseigné sur les instructions de dossier ([79b725f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/79b725f6ac97b022e85f72656a7ba26d9e3f7c12)), closes [#489](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/489)
* **statistiques:** ajout montant accordé par objet d'accompagnement ([47cdd44](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/47cdd444ebec0dc42112d6b8bac94ef4b4cd703f)), closes [#517](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/517)
* **statistiques:** ajout montants alloués par organisme instructeur ([fac7737](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/fac7737df43626090c1a66568c0e94e1c251a8e1)), closes [#517](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/517)
* **statistiques:** filtre les dossiers non renseignés dans les statistiques bénéficiaires ([4376431](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4376431e278d30639903f3806a27e71db7b89fce)), closes [#489](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/489)
* **statistiques:** filtre non renseigné pour les stats ministère ([4eb4ee1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4eb4ee1afd0a99224c05d4deba67a5a09fd9f94e))
* **statistiques:** mode d'hébergement pour tous les types de structure ([2aa25cc](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2aa25cc4474d8fe89321aa79f4f4c56892b1c879)), closes [#648](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/648)
* **ui:** dissociation des onglets accompagnements, entretiens et instructions ([edc3aae](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/edc3aae876bf1dc9f5424569275222d44065fa59)), closes [#634](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/634)


### Bug Fixes

* **brevo:** suppression sur la page de login ([fd37587](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/fd37587470f033ec3b7a7e1878b5f9c9ef66767d)), closes [#652](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/652)
* carte instructions, le total doit toujours etre à 100% ([35e07b4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/35e07b4d3962925f4c51652d4b44192c01279b4e)), closes [#650](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/650)
* **emails:** cesse les envois d'emails aux utilisateurs désactivés ([fc789fb](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/fc789fbf9ec18180cb640fc702c6c4a0d4205142)), closes [#630](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/630)
* **security:** validation des types de fichiers avant téléversement des documents ([cbe400e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/cbe400e291fe5c437dfaad507dea64d732fcc9f2)), closes [#602](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/602)
* **statistiques:** cohérence filtres et hauteur minimale tabs ([d2db83c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d2db83c9394292a16af635da1c50d86fea145802)), closes [#517](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/517)
* **statistiques:** export aides financières ([7665452](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/766545273dd91fb9956b243084fba8d3cb8403be)), closes [#656](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/656)
* **statistiques:** filtre non renseigné sur les org prescripteurs ([bdf3698](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/bdf3698388094ae8054ee7d61c8283cbd0c53b8e))
* **statistiques:** inversion des abscisses et ordonnées des exports Excel ([ac13a09](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ac13a091db1663b58194f14bc68dfb62ed3041c4)), closes [#636](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/636)
* **statistiques:** Retours de tests ([118718c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/118718c021d3a122ade733d3ab3733ccce39f749)), closes [#657](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/657)
* **stats:** ajout demande de logement dans carte instruction/objets ([c713222](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c713222075a6f581efdb54c1317c547973ce6636)), closes [#645](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/645)
* **stats:** ajout des cartes manquantes à l'export ([b3c09e0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b3c09e068523f906f9a6c6587b1bc620c952931b)), closes [#517](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/517)
* **stats:** ajout du pourcentage d'instruction de dossier avec prescripteur. Suppression de la carte Organisme instructeur. ([8467b91](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8467b917f127ac76e3256812c0526d424d3ed944)), closes [#644](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/644)
* **stats:** ajout pourcentage entretiens avec prescripteurs ([2a8e783](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2a8e7837340e068e22e6db57915b801acfce1ae8)), closes [#643](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/643)
* **stats:** bug export des images coupées ([3e75cc3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3e75cc367015177beb1bd690491749e64d824131)), closes [#629](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/629)
* **stats:** objet d'accompagnement désactivé dans logement ([a6809c4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a6809c468572ea21e5a89b2d525ed5e8d0c65e12)), closes [#642](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/642)
* **stats:** résolution du bug d'affichage des icones ([abfe214](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/abfe214f1737fe2a0dbe013218451eb2081826a2))
* **stats:** téléchargement des images en zip ([d486966](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d486966bdb7bf042bca9bc9695d0378516d93b94)), closes [/gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/629#note_2199214738](https://gitlab.com/incubateur-territoires/startups/monsuivisocial//gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/629/issues/note_2199214738) [#629](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/629)
* **suivi:** ajout de documents pour un suivi sélectionne le doc ajouté ([d041367](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d0413672e5d09d4132e8a2be12a333e396eaf26b)), closes [#635](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/635)
* **suivi:** les agents d'accueil peuvent voir les commentaires des suivis ([22f9222](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/22f92220b03154a13a3f8d3df8e540200ce8c3dc)), closes [#619](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/619)
* **ui:** préserve les valeurs des filtres repliés ([645ada3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/645ada3d15c84a37f1b9a51cb883f6dba6ee80ae)), closes [#489](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/489)

## [1.32.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.31.0...v1.32.0) (2024-10-30)


### Features

* **brevo:** ajout du siret à l'export brevo ([8b511fe](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8b511fe99f8d8a2b97f6c40b231c2d668a489cf2)), closes [#624](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/624)
* **security:** nettoyage des noms des fichiers téléversés ([8211a35](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8211a356e66acfe125e809d08e87efbf78ce99e7)), closes [#598](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/598)
* **sso:** authentification possible avec Proconnect ou InclusionConnect ([30a9d1d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/30a9d1dcd6d6c4aad65ab40b509960d992d322c5)), closes [#485](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/485)
* **sso:** mails d'ajout de compte utilisateur avec ProConnect ([31972a5](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/31972a5ac4573e0aa59dabd774364fc9c1427af2)), closes [#485](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/485)
* **sso:** modification de l'annonce de transition ProConnect ([c1e6f67](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c1e6f67708d430118a55a6f0cc400102c1b4431e)), closes [#485](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/485)
* **sso:** supprime la possibilité de changer de mot de passe avec proconnect ([616618b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/616618b1f8d31dfd5e7da59953ffb183f962eea6)), closes [#485](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/485)
* **sso:** utilisation exclusive de proconnect pour la création de compte ([8b6892c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8b6892c044e4b6e170be634d044cf5040b3aba05)), closes [#485](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/485)
* **support:** ajout d'un chatbot de support sur la page de login ([d01cfe5](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d01cfe5e0e266fe4edfb8933e95b0007b807ae4d)), closes [#625](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/625)
* **ui:** refonte du design du composant filtre multi-sélection ([794a078](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/794a078df9a3533c8ca8a546d5401b1aeb95ad2d)), closes [#583](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/583)
* **wysiwyg editor:** création d'un composant de texte personnalisé ([3f8ff46](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3f8ff46c896a594db18b6c0dacc3561dcb8e5cdb)), closes [#539](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/539)


### Bug Fixes

* **accompagnements:**  Pouvoir désélectionner des objets d'accompagnements supprimés ([03a10ca](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/03a10ca713e1cceba74975a9b58c2544fecbf398)), closes [#596](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/596)
* **bénéficiaire:** la modale de doublon détectait le bénéficiaire courant ([adec00a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/adec00a6cc12e356cd3e97f20890c41ba200502e)), closes [#623](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/623)
* **champ multiselect:** amélioration de la navigation clavier ([e928fe1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e928fe12a50f5c5eef1d82bc5b3eb13732bd6f7b)), closes [/gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/583#note_2172883367](https://gitlab.com/incubateur-territoires/startups/monsuivisocial//gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/583/issues/note_2172883367)
* **éditeur texte riche:** amélioration du contraste des boutons sélectionnés ([8f6b8d6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8f6b8d60edb9305bdd16e8e6580cd404e240e8b7)), closes [/gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/539#note_2169582131](https://gitlab.com/incubateur-territoires/startups/monsuivisocial//gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/539/issues/note_2169582131) [#539](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/539)
* **editeur:** ouverture des liens au clic et formattage des urls externes ([f0467fd](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f0467fdd25e8ce141a784fd764bce8e7638f3569)), closes [#539](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/539)
* **editeur:** supprime les chevrons au copier-coller ([15504ca](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/15504ca48b53327cf7084946692f69ab45789368)), closes [#539](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/539)
* **editeur:** supprime les chevrons dans l'éditeur riche au copier-coller ([851a25e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/851a25e719cf81b539f99c1240ac15b02b7b65c7)), closes [#539](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/539)
* **impression:** afficher la synthèse avant de déclencher l'impression ([3b06ac9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3b06ac97a8712d63f03a8dc87673219a84fb33d3)), closes [/gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/539#note_2169371620](https://gitlab.com/incubateur-territoires/startups/monsuivisocial//gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/539/issues/note_2169371620) [#539](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/539)
* **multiselect:** le dropdown superposable devient une option ([888111c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/888111c8a537e58198dbff31dbead9493c05fe8f)), closes [/gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/583#note_2184363282](https://gitlab.com/incubateur-territoires/startups/monsuivisocial//gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/583/issues/note_2184363282) [#583](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/583)
* **security:** liens externes sécurisés dans le mailing proconnect ([75e2241](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/75e22419c8da8ab367f890c782799449f241785d)), closes [#603](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/603)
* **sso:** déconnexion proconnect lors de l'inactivité ([e6e91f3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e6e91f3a41ff6ce78bdf3b4c801ca0bb2de33179)), closes [#485](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/485)
* **sso:** redirection après connexion stockée dans la session serveur ([a0e3bce](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a0e3bce1d0653ba767c84ad778d71e2ac28f482c)), closes [#485](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/485)
* **sso:** redirection après connexion stockée dans la session serveur (2/2) ([5356f73](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5356f738d7451a0017b3e71752b386d242238f5f)), closes [#485](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/485)
* **stats:** hauteur minimale des onglets ([7c41723](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7c4172329db7e83f90747db3cdaf230e5a73f6dc)), closes [#573](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/573)
* **synthesis:** si pas de texte 'riche' alors on charge le texte brut ([fb5f1cf](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/fb5f1cfa5506010ac8b495a08ef3e7a7b4fc49ab))
* **ui:** ajout d'espace sur les contenus d'onglet coupés ([ca4763c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ca4763c757cf68c6e522adb9fb8baaffa8c6a977))

## [1.31.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.29.0...v1.31.0) (2024-10-03)


### Features

* **accompagnements:** ajout d'un filtre 'période' ([d7cb6a1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d7cb6a1e4ab31b5a5946b6c0fce13cd41312c15f)), closes [#572](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/572)
* **bénéficiaire:** détection doublon sur nom de naissance ([a3350d3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a3350d3416907f7cf3af48e764936287d9381f33)), closes [#488](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/488)
* **bénéficiaire:** les agents d'accueil peuvent voir et modifier la situation familiale ([f4a755f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f4a755fba969f72631a571335e79f99d853d680f)), closes [#586](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/586)
* **foyer:** finalisation de la dissociation d'un membre du foyer ([100461b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/100461bd9b8e4808b21252b0d83dd0848a0407e4)), closes [#563](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/563)
* **foyer:** première version de la dissociation d'un membre du foyer ([b8c282e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b8c282ef594e165cd6e407ceb3597e87f7ae18db)), closes [#563](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/563)
* **instruction-dossier:** ajout de nouveaux champ dans l'export ([b25ded1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b25ded1aac9c521ac9933b1aee2fb36cd89e5204)), closes [#552](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/552)
* **instruction-dossier:** ajout des champs organismes prescripteurs et contacts à la demande de logement ([ce5becd](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ce5becd63258b7348927eb7766077c5eae97df30)), closes [#579](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/579)
* **ministère:** ajout des ministres sept 24 ([971ae6f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/971ae6f3dc5da2b670cebebb254eb295ca918a6b)), closes [#585](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/585)
* **role:** mise à jour de la table des roles ([d69da3f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d69da3f645c1eb8b83af3fc2892910c46fd54ffa))
* **security:** double la limite de requêtes du rate-limiter ([d2ac8dc](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d2ac8dc58cc405902e76c022a126e20ac4dfe6eb))
* **sso:** migration de IC vers Pro Connect ([2ef79df](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2ef79df2512bf953a29380d0333511d23c681fd9)), closes [#485](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/485)
* **sso:** utilisation de la session ([4928f4e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4928f4e202615a8461238d58037f54b0c7e23817))
* **sso:** utilise le bon client ([c5c2e21](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c5c2e21709fb1e4f5c30e0f6d568a98b18639218))
* **suivi:** modification de la permission d'édition pour les synthèses d'entretien ([5024a18](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5024a186fa5b393a98ecfbc6f3b54445d763c8c4))
* **suivi:** modification des suivis par les référents ([6aa79da](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6aa79da458e858eebd8d3cf1c37d4c500b942e1f))
* **textarea:** remplace < et > sur l'évènement paste par * ([27be9da](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/27be9daaf0d68900718cc1e4107da9c18966c26b))


### Bug Fixes

* **add beneficiary form:** détection de doublon sur nom et prénom ([130e847](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/130e847f62af28772b50386b3da37c985d1c01c2)), closes [#488](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/488)
* **annuaire:** amélioration de l'autocomplete ([1446313](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/14463133fb0f5b37cb96c5cad12a06843eed5355)), closes [#571](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/571)
* **bénéficiaire:** ajout des valeurs manquantes ([a2b810b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a2b810bc9d07714bf30700e7fe0c908633d07663))
* **bénéficiaire:** ajouter la détection de doublon sur le formulaire complet ([630575c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/630575cfa338d8fd451775a72eba59a1acac4833)), closes [#551](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/551)
* **bénéficiaire:** le filtre sur les objets d'acc. doit être associé au bénéficiaire et non au foyer ([ba70d2f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ba70d2fa98101b9b6adb6b7fb6b2952f1b895b9b)), closes [#578](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/578)
* **beneficiaires:** chargement des infos bénéficiaire après suppression d'un accompagnement ([fb7330f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/fb7330f49c6c8226b10f9bed28eb6d1b78ed3f60)), closes [#581](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/581)
* **bénéficiaires:** filtre objets d'accompagnements inactifs dans les bénéficiaires ([48e0ce7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/48e0ce703e8aab0b5a581faf6f0dc8662571c188)), closes [#578](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/578)
* **beneficiary:** améliorations ui ([86a707b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/86a707be4da96313e9ca7d044cf77f78d04e93f7)), closes [#592](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/592)
* **beneficiary:** ne pas afficher d'erreur dans formulaire complet si bénéficiaire initial identique ([39a761a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/39a761aa3b41f8faa775446201229f04e9eb085e))
* **beneficiary:** ne pas afficher les sections 'Situation familiale' vides ([b24b21e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b24b21e2f76ff091533243f3f315940438d30a83)), closes [#592](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/592)
* **filters:** ne change pas d'état au changement d'onglet ([c6b443a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c6b443a7a359c262e68210f4f4813679d8d3adbe)), closes [#574](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/574)
* **formulaires:** les dates vides à la nav clavier sont transformées en null ([59ceb03](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/59ceb03df247b0a3d9f138e35718b93cb4ce3b93)), closes [#375](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/375)
* **foyer:** recharge les données du foyer après dissociation ([8516a3c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8516a3c03179bf4fef5888c08347fa863140f941)), closes [#563](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/563)
* **foyer:** statut du dossier manquant ([89aa572](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/89aa572726839046bb9012d7240cd763593f3e46)), closes [#576](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/576)
* limite les années à 4 chiffres dans le champ date ([c7ce5d8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c7ce5d8e9dbe79528a76f4653aee69ea74a5dccd)), closes [#375](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/375)
* missing types ([e91c779](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e91c77922e1dbecf3e0772e13793a3c87c5f1679))
* **statistiques:** ajout org. prescripteurs des aides logement dans les stats des accompagnements ([d88cfcb](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d88cfcbb7ba8fa3324c5ae6fa21b00b5d06ee475)), closes [#579](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/579)
* **suivi:** supprime des filtres un objet d'accompagnement inactif qui n'a jamais été utilisé ([78f504f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/78f504f7600e5d08510de05380b9686cde62480f)), closes [#564](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/564)
* **textarea:** remplace tous les < et > sur l'évènement paste par * ([7b75515](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7b755157ed3a5d7d1145f708e9da4db64f0f17d8))
* **ui:** copier coller dans le champ texte libre ne remplace plus le texte présent ([452465e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/452465e1b76511ec18e3a45ab131f7a3b5cf0037)), closes [#594](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/594)

## [1.30.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.29.0...v1.30.0) (2024-09-17)


### Features

* **sso:** migration de IC vers Pro Connect ([8d1b4c2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8d1b4c27c565b860b6f1d06db79a5d314f07458f)), closes [#485](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/485)
* **sso:** utilisation de la session ([10d22e4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/10d22e4a2cf709892edca582384d7b68daae46d0))
* **sso:** utilise le bon client ([78f3666](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/78f36667cd0420f4c96f823086b10924360f09cf))

## [1.29.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.28.0...v1.29.0) (2024-09-04)


### Features

* **admin:** ajout de la colonne création de la structure ([b1b567a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b1b567aa83d527bff59420c0dadc0ff3caed3d7c))
* **brevo:** ajout de données dans l'export ([e18690f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e18690f1dd1bb094838cd0ce1b11f299e23b0fa3))
* **foyer:** ajout filtre par membre dans onglet documents ([73ccd34](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/73ccd34b3b3a493ae81f4506b423e4595fcee2ce)), closes [#565](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/565)
* **foyer:** détection de doublon lors de la création d'un membre du foyer ([1776af9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1776af9c9532e4bce6f00ad326dceb62463d5c51))


### Bug Fixes

* **email:** Vérifie la date de création avant d'envoyer l'email de désactivation ([93a77e3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/93a77e3b3ca12a97d78bb76183cc8b6b68fad597))
* **stats:** filtre agent ([12c322b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/12c322ba1323c07587485142f859bb14f47cc7c6))

## [1.28.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.27.0...v1.28.0) (2024-09-03)


### Features

* **brevo:** export des contacts ([8b575b9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8b575b93ba3129677014b1f21700ebea0d213c40))
* **budget:** dissociation des revenues et de l'entourage ([4bbd056](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4bbd056b912a76bba7895860d43356c3e5b844ae))
* **budget:** possibilité de supprimer les revenus ([09d1d8b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/09d1d8bd66fdb62fba3f03b0f10fd7d73bb6996e))
* **dependance:** mise à jour de eslint ([d6bb86a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d6bb86ad6c5432bd934571e7da12f7a72271090f))
* **dependance:** mise à jour de nuxt ([eda5b75](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/eda5b75216ee570181a013b3594020def913e251))
* **dependance:** mise à jour de prisma ([3f92c90](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3f92c9096ee6ce5834d16cccba7bc98d818bf702))
* **dependances:** @gouvminint/vue-dsfr 5.19.2 ([2e6eeb5](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2e6eeb59be5363abb0aa530ae61ce6e04b9b26b9))
* **dependances:** @types/node 22.2.0 ([7218cec](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7218cecb2b80a38b56a6eed5c287a9cb27233bdd))
* **dependances:** prisma 5.18.0 ([71368e0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/71368e0c922ff297ccba99bf5d41f63492d5c6d3))
* **dependances:** sentry 5.25.0 ([1bfba75](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1bfba750a07d6d1f46f4a6759ed9c7c0d2546c02))
* **dependances:** styleint 16.8.1 ([e043e25](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e043e259527e5062814028f8b420f6aaf2086aa5))
* formulaire "Ajouter un membre au dossier" ([783a9ad](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/783a9ad4a819e2d7a6d3364ce858120e5e35100d)), closes [#508](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/508)
* Formulaire ajout d'un membre au foyer ([336ff6c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/336ff6c30fe98df8ba398d23af52494d1ed99055)), closes [#509](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/509)
* **foyer:** adaptation du budget au foyer (2/2) ([100f4cf](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/100f4cfa6a8e4867fe71a8a7cf921ea28574d4b3)), closes [#549](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/549)
* **foyer:** affectation d'une demande d'aide à un bénéficiaire d'un dossier (2/3) ([2bc4fc5](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2bc4fc5ed04e588cb8c62f338726a8e72e027d1e)), closes [#510](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/510)
* **foyer:** ajout breadcrumbs foyer ([fbab95d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/fbab95d2616fdeb064f14592a86936e254cb3d08)), closes [#537](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/537)
* **foyer:** ajout d'un membre au foyer (1/2) ([687836f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/687836fd5d30e1f67b4e8d122fb16dfebb7f2024)), closes [#509](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/509)
* **foyer:** ajout de filtres par bénéficiaire pour l'historique du foyer ([9541b56](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/9541b563650a697b95f0549baae913b0daff0c76)), closes [#510](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/510)
* **foyer:** ajout des fils d'Ariane du formulaire bénéficiaire ([9cae920](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/9cae9209d5fc269b79e5aefda376d20b6da7d575)), closes [#536](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/536)
* **foyer:** ajout des référents au foyer et du lien avec le bénéficiaire principal (2/2) ([8a1aef3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8a1aef30c08b30a8fbf0feb07fea02e3559580fb)), closes [#509](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/509)
* **foyer:** ajoute le lien de relation dans le foyer dans les infos minimales ([14ad8a0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/14ad8a0e43f2881e4191e52dbfca6ce17e49ae90)), closes [#505](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/505)
* **foyer:** associe le document du suivi au bénéficiaire du suivi ([8c3ad79](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8c3ad79f39ab3d99d074f92753c8ddd1b9e6cd46)), closes [#510](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/510)
* **foyer:** attribution d'un document à un bénéficiaire ([efedd0d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/efedd0d2da934bcdf49c510247e8fd5760343747)), closes [#546](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/546)
* **foyer:** finalisation UI de l'affichage du foyer et refacto du formulaire bénéficiaire ([060d5a0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/060d5a0378ca3e461da1b3d07d872ae816c9a596)), closes [#505](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/505)
* **foyer:** maj des routes et fils d'ariane pour les demandes d'aide ([a5cee4c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a5cee4cf51c08be0d698eff308943f568e6635c2)), closes [#546](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/546)
* **foyer:** mise à jour des routes et breadcrumbs pour les synthèses d'entretien ([b476205](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b476205342485e43261b22a2ff95a245149d6387)), closes [#546](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/546)
* **foyer:** première version d'affectation d'un entretien à un bénéficiaire d'un dossier (1/3) ([d6179ea](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d6179ea158e9c637c1e7d71047a4f818d59de83d)), closes [#510](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/510)
* **foyer:** pt d'entrée API pour les informations minimales du foyer ([7b450ed](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7b450ed66bd0e085e2eb7571507475f404a5dafd)), closes [#505](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/505)
* **foyer:** refactoring et ajout de fonctionnalités du formulaire bénéficiaire ([a55a932](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a55a9329fee9ba3744efe09b7ce2ac5336ce42a3)), closes [#536](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/536)
* Page dossier foyer ([7fc655e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7fc655eaeeb3c84e0e7341159caf7f8430c4824a))
* **stats:** ajout de filtre Ministrer ([64d1efc](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/64d1efc65ccbffd76f06d1fee91b1674ba2b8166)), closes [#518](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/518)
* **ui:** ajout contrôle segmenté pour les bénéficiaires du foyer ([a8632ad](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a8632adc356fc31e10b28a5ed34b6b6238d356ae)), closes [#544](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/544)


### Bug Fixes

* **accessibilité:** comportement au zoom ([b8b55ec](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b8b55ecef77b35623fd56262f5354f98e48d3aa7))
* **beneficiaire:** ajout d'erreur lors de l'échec de la validation du fomulaire bénéficiaire ([8a0eed5](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8a0eed55b50e7e060edbdf23f39c8bc6cd7ec764)), closes [#515](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/515)
* **bénéficiaire:** Ajout de la civilité ([2931404](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/29314046a6d1aabe0efbfc8d3e211de655051068)), closes [#519](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/519)
* **bénéficiaire:** amélioration de la page d'impression ([d16135f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d16135f7d8ae78965b05f5d60f2443da0b95ec10)), closes [#558](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/558)
* **beneficiaire:** rajoute le champ date de naissance dans l'entourage puisque fusionné avec foyer fiscal ([acbab70](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/acbab7010071ed15d9bc6d5afedc0148d910c76a)), closes [#541](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/541)
* **bénéficiaire:** recharge les données après suppression d'un membre du foyer ([2514130](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2514130debe2f2e2177e6e6c9635dbb54161185c))
* **beneficiaire:** réordonnancement des champs dans entourage ([e9aba52](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e9aba5265cf3859a10fc757b84c9008fef94c8db)), closes [#541](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/541)
* **beneficiaire:** sélection du segment à la création d'un membre du foyer ([83dfff9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/83dfff9ea51a55de55a45bdef57882b6bfa2c87f))
* **beneficiaire:** suppression du bénéficiaire était cassée après passage au foyer ([8060912](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8060912e8ec3397d376e5b0a65369ba14f4c08e3)), closes [#505](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/505)
* **bénéficiaire:** ville de naissance augmentation du nombre de caractères ([f847340](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f847340e99ac5b9eac7128e8fbf0d251a9b49ef8)), closes [#521](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/521)
* **budget:** affiche le label de la relation ([582e812](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/582e812d84426eb914244d29ed267251d1dfd0e6))
* **budget:** associe le bénéficiaire et les revenus à la création ([4e04b1a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4e04b1a373bf44f1fcfab656c2979bbd035246e6))
* **budget:** modale ajout revenu choisir un membre du foyer ([5c8fd5c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5c8fd5ccecf0980233b108c403207e7679c129ef)), closes [#567](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/567)
* **budget:** rafraichit le budget après l'ajout d'un membre au foyer ([737be7e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/737be7e9212d1325cb804b22964d0d73ccf61dd6))
* **document:** choix des bénéficiaires horizontal ([a809ec9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a809ec937dccd997a699bb08f4927c7920280a15))
* **dossier:** rechargement de la page après ajout d'une personne ([c8c61be](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c8c61be31d210b941a83032333d942bd31d38264))
* **entretiens:** redirection vers la synthèse à l'issue de la création ([cd2a97d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/cd2a97db1d3efd4e65ec741e964c59b94dfdebde)), closes [#522](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/522)
* **foyer:** retours de tests 1 ([9645c2a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/9645c2ab026522588459075c3125ada3decbdc19))
* **matomo:** suivi des impressions ([1415fd9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1415fd946b66bfe8abdb2cc5519c10ebfd2144e4)), closes [#527](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/527)
* redirections apres ajout/suppression beneficiaire ([7b04e9d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7b04e9dccde07fcea9016a10a1fbe83c06508288))
* **structure:** désactivation autorisée uniquement pour les structures anciennes ([526f177](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/526f1778863d7a25b39a3a0c885113ae4679570b)), closes [#547](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/547)
* websocket connection errors ([c4f8bfd](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c4f8bfdfab50e18e3c9b5b3f677e519d79ef98f6))

## [1.27.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.26.0...v1.27.0) (2024-07-22)


### Features

* **api:** ajout d'une api indicateurs des structures ([9aa033b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/9aa033be31c71f4d552fa43ba36ff5d4afd396f2))
* **creation beneficiaire:** ajout d'un bandeau info ([50a50e9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/50a50e9b60b4911d48d88bfb62c90bc27a5dca39))
* **dependance:** mises à jour des versions majeures des dépendances ([1be5f9b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1be5f9bc656fd79aec50d041a90ae18b42fc7d5d))
* **dependance:** revert nuxt version ([0f1a7d3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0f1a7d3178a3e185a0566d28ac8b0a08f801c6ee))
* **Dossier foyer:** Introduction du concept ([00ba156](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/00ba1569e45ea5e5a3bdc710384d18432856c70a))
* **dossier logement:** ajout des types de HLM ([5264b6f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5264b6f082c943e1e6ab6d87c9a8836f200120b5))
* **entretien:** impression d'une synthèse d'entretien ([76dc721](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/76dc721eedfb46e487a5d20eaedcabe25b779109)), closes [#358](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/358)
* **entretiens:** ajout de l'id de dosser dans le formulaire de synthèse d'entretien ([11f600e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/11f600e0baa2e6b8ab6d68068aed21239ec4050a))
* **historique:** imprimer un dossier d'instruction ([9a51c11](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/9a51c116aa02e8fa0ec4c21f11caa9242df8f854))
* **instruction-dossier:** ajout de l'id de dossier dans le formulaire d'instruction de dossier ([98c9dd3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/98c9dd39107bc54d033514be42546f9b79c34958))
* **instruction-dossier:** ajout modèle logement à loyer modéré ([46d0241](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/46d024122b208c284600a2203d3831f8f0155b8b)), closes [#502](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/502)
* **statistiques:** instructions de dossier ont plus d'un objet d'accompagnement en prod ([e1a5a38](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e1a5a38e22c77c4a888f343bc68c626c20a65a30)), closes [#495](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/495)
* **structure:** affiche une modale en page d'accueil pour ajout dpo ([debd460](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/debd460d594fa0dc2fbbee5acd19e810212aab7e))
* **structure:** ajout de dpo au formulaire ([d4ef795](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d4ef795d4252cd728ddedf5ce54c7a6b24e1c341))
* **structure:** ajout des champs du DPO dans la structure ([66b8de9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/66b8de962e3a98bca16555ecba05c1acd6acdd84)), closes [#500](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/500)
* **structure:** ajout du point d'entrée API pour le statut de remplissage du DPO ([5f42328](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5f42328f49f3a16cef9d1558ccf053a2fa0a72da)), closes [#500](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/500)
* **structure:** désactive modale DPO pour les comptes administrateurs ([51882ff](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/51882ff6896b45526f85f24985d70b84f2222cba)), closes [#532](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/532)
* **structure:** envoi automatique des emails avant désactivation ([b6cd21d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b6cd21d9b37adcec0f91607fd8d93e4dff412e3c))


### Bug Fixes

* ajout d'info de version ([ee4109e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ee4109e07742a39aa6aa311105d7826cd281c619))
* ajout enfant mineur dans bénéficiaire et futur nouveau breadcrumb ([07d4ace](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/07d4ace133eb452a8c2ac7ee9608c83a770971a5)), closes [#525](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/525)
* **beneficiaire:** amélioration des permissions sur les données de santé ([1f271f9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1f271f98526e7efd1389ed2eb05a5be470271056)), closes [#503](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/503)
* **beneficiaire:** bénéficiaires similaires et redirection du formulaire simplifié vers complet ([4e5c136](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4e5c136287c6af5935d45ee1062df7a96c81e105)), closes [#525](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/525)
* **beneficiaires:** rajoute la colonne des objets d'accompagnement ([c803b19](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c803b1963b0a1132f594f80b1a806d437db95015))
* **beneficiaire:** supression mention champ requis dans le foyer fiscal ([7c75c14](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7c75c14017e5a57ac25a7504c72dcbdc2130831f))
* **budget:** update routes for budget with new file structure ([7c6965e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7c6965e1ecfcb11404328596153bb97a353593b2)), closes [#498](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/498)
* **data-inclusion:** suppression des données à la fermeture de la modale ([5406c54](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5406c540dd9a0e3d19c1dc91d33b191c129071ce)), closes [#435](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/435)
* **data-inclusion:** supression de la recherche par SIRET ([a914141](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a91414115c850f3ecf1fa6132483368e753146b1)), closes [#486](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/486)
* **document:** encodage du nom des documents dans le header d'accès au contenu ([584cdfe](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/584cdfef1ab8ce714c6ab41b436e2eabaf806ef4)), closes [#525](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/525)
* **Dossier foyer:** Possibilité de gérer les documents ([9051494](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/90514943816ed48e37bef530cdd1ec66c5da97e7))
* **Dossier foyer:** redirection de la page foyer vers la page bénéficiaire ([f98d0c3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f98d0c3603d3d41a91cc34f5c1c47e7012511f86))
* impression de [RETOURS TESTS] ([3fe4e8d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3fe4e8d428726a06aa291eacc3524b84b9abb586))
* ouvre le bon item après avoir imprimé ([94d4ae9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/94d4ae9f07197ecbe1084ede005608ecf04fc8a4))
* **structure:** change la fréquence d'envoi des emails ([0e48078](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0e48078c233f3672f09a1a3a93bba09e3760b207))
* **structure:** désactivation d'une structure ([496d552](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/496d552736199f2a8a9c29ab9cc1ffece77d2f7e))

## [1.26.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.25.0...v1.26.0) (2024-06-19)


### Features

* **admin:** gestion de la désactivation d'une structure ([9fabff8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/9fabff8f1a0e71f0bdcede3ed2ab7cd39a1bc422))
* **cgu:** mise en ligne et activation des CGU et de la politique de confidentialité ([2c24eb6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2c24eb6dcfb515e8c9a88790190f662d2d5ad1d4)), closes [#100](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/100)
* **e2e:** ajout de tests d'authentification et intégration à la CI ([d9521d4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d9521d4daa4e885f8d6e88abe964b43790ffe8d3))
* **statistiques:** ajout des totaux dans les listes statistiques ([956a34a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/956a34a8ffc90c03e3ec89972def4d5a7ef132a5)), closes [#481](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/481)
* **statistiques:** tests API instructions de dossier - objets d'accompagnement & aides financières ([86c0349](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/86c0349c54b372aecaee378f2d21accbbfe9df23)), closes [#481](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/481)
* **structure:** gestion de la dernière date de connexion d'une structure ([c8785d1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c8785d1ff281dac6b997728ba28083ad5a260957))


### Bug Fixes

* **notification:** corrige la création de notification en tache de fond ([fff0586](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/fff058647fb8a9e33de514d6fba6e719325d3aba))
* **statistiques:** corrections organismes instructeurs et actions entrepriseq & ajout de tests d'API ([e2ae557](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e2ae5576b3f10dffeb424b3fb9a7dd67bf11d3d9)), closes [#481](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/481)
* **statistiques:** montant total des objets d'accompagnement incorrect ([913592d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/913592de4dc513fd21db456de37ba0ce775697b3)), closes [#481](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/481)
* **statistiques:** récupération des objets d'accompagnement manquants ([dcc6bec](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/dcc6bec36a963ab6b0137a5d6cf4e89bb3c73914)), closes [#481](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/481)
* **structure:** gestion de l'affichage du bouton désactiver ([27ceb42](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/27ceb425a7cbd60e95437baba5b5e49100dc246f))

## [1.25.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.24.3...v1.25.0) (2024-06-03)


### Features

* **budget:** ajout des catégories de dettes au budget ([d879d42](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d879d423b83bba09d3094a5a3f5c68f5d2c3d166)), closes [#456](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/456)
* **budget:** ajout du champ banque de France et calcul automatique du reste à vivre ([21eb393](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/21eb393d89f2f168ae5afdc7b3769893050bbc08)), closes [#472](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/472)
* **budget:** catégorisation des crédits ([060e105](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/060e1057d9765ff1f54b23286880f65f8f092235)), closes [#457](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/457)
* **budget:** création d'une section assurances dans les charges ([e098051](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e0980515ab70c554441c5b506b56eac73cfe03dd)), closes [#455](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/455)
* **budget:** maj de la visualisation des informations générales du budget ([d2fe39b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d2fe39b9d59655f1277b4544da20a06962b514b7)), closes [#472](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/472)
* **data-inclusion:** édition d'une structure importée par Data inclusion ([8408607](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8408607f36127fa36c9e1fcf3c162c234b674539)), closes [#435](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/435)
* **data-inclusion:** finalisation de la V1 de l'intégration Data Inclusion ([f20feaa](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f20feaa4f53dad5f92717d9cf54446ddf5f935e2)), closes [#435](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/435)
* **dépendance:** mise à jour de sentry ([3d94db7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3d94db79e5a6156ea410d6f6d314889a608b39e9))
* **statistiques:** ajout du nombre de bénéficiaires concernés par les accompagnements ([fa19295](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/fa192959571564f49a49d6022d7c741b36876b12)), closes [#468](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/468)


### Bug Fixes

* **budget:** correctifs budget ([1acca1b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1acca1bf577cede392c8af20b3058b305ec36bc9)), closes [#472](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/472)

### [1.24.3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.24.2...v1.24.3) (2024-05-25)

### Bug Fixes

* **ui:** uniformisation barre d'action & amélioration UI objets accompagnement ([e097315](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e0973150da79a411d1dff2f7b1c53a5dbb93547a)), closes [#470](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/470)

* **statistiques:** retrait du bandeau d'informations ([4754d3d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4754d3d5fee22e1d882c65f6b53b264cc2574d2d)), closes [#467](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/467)

### Features

* **data-inclusion:** ajout organisme partenaire depuis Data Inclusion ([b760900](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b760900a8915f1029fe5be84b5fd38c2c6a7c305)), closes [#435](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/435)
* **documents:** mention de confidentialité des informations des bénéficiaires ([3059176](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/305917690f02466ec962fae3f47b346767e48918)), closes [#464](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/464)

## [1.20.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.19.1...v1.20.0) (2024-05-14)


### Features

* **accessibilité:** ajout plan d'action à la déclaration d'accessibilité ([a1d5e1c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a1d5e1cbd3e3a867851a3bf9d32818d8b5ce8304)), closes [#454](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/454)
* **api:** ouverture API structure et mise en place de la table des secrets ([40c60a1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/40c60a102ef1b6bc6324edaa7c3f7a6448bd2777))
* **beneficiaire:** ajout des dates de séparation et de divorce ([97336ff](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/97336ff7421be931c97c035b70357262280e0a4b))
* **beneficiaire:** modification du formulaire d'activité ([6aabf27](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6aabf27dc681b59b55c946f1ee9fd9f2ddd2ea7a))
* **cgu:** Désactivation de l'acceptation des CGU en attendant le changement d'hébergeur ([5dfbde8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5dfbde88b79aa644e87a4ac2742021290e9d8ff5)), closes [#461](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/461)
* **cgu:** mise en ligne et activation module validation des CGU ([6f9983e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6f9983e37b71a1dde57d70721b6e9f12bb1aa954)), closes [#100](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/100)
* **confidentialite:** mise en ligne de la politique de confidentialité ([00dd5fa](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/00dd5fa6f53ec88db0debbaccd09e784db85b1b1)), closes [#101](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/101)
* **data-inclusion:** ajout de la page admin des intégrations avec Data inclusion ([cefaa2b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/cefaa2ba40652607787a743454265056f1086217)), closes [#435](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/435)
* **data-inclusion:** imports des données de structure de Data Inclusion ([7edb820](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7edb82007d21e2097ce01298c766a0d18c1cdef2)), closes [/gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/merge_requests/532/diffs#70fb162dae8ffe4611163cbf5d2a349cfdc28292](https://gitlab.com/incubateur-territoires/startups/monsuivisocial//gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/merge_requests/532/diffs/issues/70fb162dae8ffe4611163cbf5d2a349cfdc28292) [/gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/merge_requests/532/diffs#70fb162dae8ffe4611163cbf5d2a349cfdc28292_0_37](https://gitlab.com/incubateur-territoires/startups/monsuivisocial//gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/merge_requests/532/diffs/issues/70fb162dae8ffe4611163cbf5d2a349cfdc28292_0_37) [#435](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/435)
* **document:** limite la taille des documents à 20M ([242996c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/242996c3f3b6b05c4afabb9a722773c330a4a426))
* **document:** Stockage et migration des documents en base de données ([1e76a45](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1e76a45a45a9edc5ed1b8df756a693ddeb8b6d56))
* **notification:** ajout d'une notification de mise à jour des objets d'accompagnement ([b19fdd2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b19fdd2632b4e2693709909991dd9f9512bea301))


### Bug Fixes

* **app:** chargement notifications et synthèse sur tableau de bord défectueux pour agent d'accueil ([27e8bf8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/27e8bf832494080443103518ddccd63261349dd4)), closes [#463](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/463)
* **beneficiaire:** affichage de la date de séparation dans un champ en cours de modification ([c923cd7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c923cd775caafe7021bab5965ecf600bf3291292)), closes [#432](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/432)
* **budget:** arrondi des éléments du budget au centime ([7af3df8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7af3df85118fe2c5b10adcd95c3fe237f5cb4c90)), closes [#449](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/449)
* **cgu:** correctifs UI et typo ([4429097](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4429097f78d18ee0b0b60eae01db118ce1ff619d)), closes [#100](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/100)

### [1.19.1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.19.0...v1.19.1) (2024-04-16)


### Bug Fixes

* **annuaire:** affichage conditionnel des contacts des organismes prescripteurs ([6076a67](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6076a67b8e42d1a8b133dfc96353355e21546f34)), closes [#383](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/383)
* **beneficiaire:** amélioration de l'UI de la section activité du formulaire bénéficiaire ([d1e705d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d1e705dd103ea1b030b2aa82e7f160c58d5c4c3c)), closes [#165](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/165)
* **beneficiaire:** chargement des filtres de la page bénéficiaire apprès suppression ([1a016a9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1a016a945c07a2b15a588cd590fe22816ae01b6a)), closes [#427](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/427)
* **budget:** encart d'information sur le nouveau budget ([c052ac4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c052ac424c5ad58617fc5451093e3c33e62f3607))

## [1.19.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.18.2...v1.19.0) (2024-04-15)


### Features

* **annuaire:** gestion du contact pour les organismes prescripteurs et instructeurs ([afa1abe](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/afa1abe8dbddec098cab5cbca0479df325bdb529))
* **budget:** Affichage des revenus ([f72cb2e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f72cb2ee8494995e3ae40f93f28119e18c318554)), closes [#415](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/415)
* **budget:** ajout d'un membre au foyer ([40ade29](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/40ade29db6fc06785fde4c0883cccd0146ed4524)), closes [#415](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/415)
* **budget:** ajout de la permission d'accès au budget ([d9fb3c1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d9fb3c1a6d0daac6cd6056ab32e4daefce519202))
* **budget:** Ajout des couches techniques coté serveur ([7b56152](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7b561520cfc4cad6d7159d733d0f69f10bb7fcb0))
* **budget:** ajout des formulaires de revenus ([d951a36](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d951a3667fdf65424c2b1abc36073481af1c6e8d)), closes [#417](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/417)
* **budget:** ajout vue et modification des infos générales ([3508085](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/35080855ae70b946aeedc40436c2eaa23c0421be)), closes [#413](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/413)
* **budget:** correctifs sur les infos générales ([4f78961](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4f789616e0a5465e5ba974c54b7cd79fbe71b9b6)), closes [#440](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/440)
* **budget:** création du modèle de données ([70c4322](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/70c4322c05585fbba40e896f298e82923af6a28c)), closes [#411](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/411)
* **budget:** migration des données ([fe2cc08](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/fe2cc082d7391a328b62e27e639e9b308f90f3f7))
* **budget:** modification des charges fixes mensuelles ([9c52f6c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/9c52f6c7df19ed833ce5e951abaf9b0270a0e279)), closes [#414](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/414)
* **budget:** suppression d'un membre du foyer ([33214b0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/33214b072cb16a485f305ba5a2f7a03559f9b69e))
* **budget:** vue des charges fixes mensuelles ([2131320](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2131320b301c089846c43d7f97dca59e2825f2c9)), closes [#414](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/414)
* **dependance:** mise à jour de trpc-nuxt et nuxt-security ([f9d9c86](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f9d9c866842cf44c46ca31926cdc1a6fc9b7797e))
* **dependance:** mises à jour des versions mineures des librairies ([aae030a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/aae030a230a54828e9c4c63ecf6f7815f0e31b4b))


### Bug Fixes

* **budget:** clarifier message bandeau d'info anciens revenus ([0f7a094](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0f7a0946975ffdf06915162b6a4f3877671d6550)), closes [#446](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/446)
* **budget:** correctifs de finalisation de la fonctionnalité ([995907e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/995907e199cfc472c8eb766e9d041d41e5368a14)), closes [#417](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/417)
* **budget:** création de revenus uniquement pour les nouveaux membres du foyer ([d9be33f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d9be33f7c644a28149b50ebf8288e58bcf5e67cc)), closes [#441](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/441)
* **budget:** le total dans les formulaires de revenus et de charges est réactif ([ab103d3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ab103d3147854965d9c4ed7fbd41eedf84f8e9cc)), closes [#417](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/417)
* **budget:** renommage de la colonne BudgetIncome.beneficiaryRelative en BudgetIncome.householdMember ([8e92cf3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8e92cf3b827be3766d945d48f3ba5b1b705688ec)), closes [#434](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/434)
* **budget:** supression du bouton secondaire Enregistrer dans la barre d'action ([1a7657d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1a7657def05cbe4d67759eefad009e09ee9c877d)), closes [#439](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/439)

### [1.18.2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.18.1...v1.18.2) (2024-03-26)

### [1.18.1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.18.0...v1.18.1) (2024-03-26)


### Bug Fixes

* **structure:** corrige l'initialisation des objets d'accompagments ([e396d18](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e396d181aca85b4a98edd9226547d4ef2f1e4aed))

## [1.18.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.17.1...v1.18.0) (2024-03-26)


### Features

* **admin:** configuration de la structure dans l'admin ([e025a94](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e025a945320b23559259eee99fe35eea161dbb92))
* **admin:** limit à 10 le nombre de structures dans le tableau ([f469b79](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f469b79a3b82358aa338c67086dc723e7e3df1e2))

### [1.17.1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.17.0...v1.17.1) (2024-03-25)

## [1.17.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.16.1...v1.17.0) (2024-03-25)


### Features

* Affiche les pages avec un tableau ou des statistiques sur toute la largeur sur grand écran ([34a9006](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/34a9006b55da5235f023809002ec237fe863f73d))
* Ajuste les espacements dans l'application ([ca8eaa1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ca8eaa16bd920ebfd98673a7443f544dad9556aa))
* **beneficiaire:** Gestion du statut de brouillon lors de la création ([8db36fa](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8db36fa00ce5865cb081b068967200bf649e4b73))
* **beneficiary:** Affiche l'âge du bénéficiaire à côté de sa date de naissance ([7c7bf48](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7c7bf48a252e50dd6bd046693b2f5273cb0c19d0)), closes [#365](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/365)
* **beneficiary:** masquage des personnes vulnérables pour les associations et ministères ([6697354](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6697354669a6ad534d37dac82d227f223b45974f)), closes [#409](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/409)
* **document:** Coupe le nom du document pour éviter le défilement du tableau ([f8d3bae](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f8d3baef65e21de59738aa9638677e44e8e94621)), closes [#364](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/364)
* **file-instructions:** Affiche le filtre des thématiques de dossier sous forme de bouttons radio avec pictogramme ([778fb16](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/778fb16e738eebfc633960653ba482c2c3a5b723)), closes [#373](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/373)
* **habilitation:** ajoute les habilitations de la page structure ([99ce43b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/99ce43b4cf014475e86718496449418e4937d1cb))
* **history:** Affiche dans l'en-tête des éléments de l'historique du bénéficiaire si c'est son premier rendez-vous ou non ([a693d60](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a693d60a90dee04a7ed121b1a3506e9b65e95c02)), closes [#365](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/365)
* **history:** Améliore le design du tableau des dossiers d'instruction ([6954c8d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6954c8d069071378b649be7560c8920940335055)), closes [#372](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/372)
* **history:** Améliore le design du tableau des synthèses d'entretien ([f23e3ec](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f23e3ec5c259e4b25966e095c30d809c8df64767)), closes [#371](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/371)
* **landing:** Ajoute la page des statistiques publiques ([7bd8fe5](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7bd8fe59026cf359244d2a2b8367f71b874a736e)), closes [#351](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/351)
* Permettre de retirer un sujet d'accompagnement d'une structure ([1e8dfe1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1e8dfe133736a1d0ca29dec5625fa4c4f6a7b0c3))
* **social-support-subjects:** ajout d'objets d'accompagnements ([dd03f36](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/dd03f360c84233546808bd7ffc7ab0fc9be60ab5))
* **structure:** Accès à la page structure mode vue ([ca8aa61](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ca8aa618d093f1016700f34e3bd93a6e0e938ff8))
* **structure:** affichage des accompagnements proposés par la structure ([5f90f25](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5f90f256e52ac1be56e02532d8ed5a1814c11f8c)), closes [#380](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/380)
* **structure:** affiche le formulaire d'une structure dans l'admin ([ea4b56b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ea4b56bac18c2805bea1eff56178539fe2e965e3))
* **structure:** Ajout d'un objet - Champ personnalisé ([a727a64](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a727a64f968af68179a02f913d451207a7e576e6))
* **structure:** ajout de la modale de modification des informations de la structure ([e1f9b84](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e1f9b8406be610ecb7241d6acd202f315da1b2ab)), closes [#382](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/382)
* **structure:** ajout de la page structure contenant le résumé de ses informations ([66bdbbe](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/66bdbbe9a720d514537bd1833cb3af111a19f48d))
* **structure:** ne permet pas de modifier un objet du système ([7f4e4e5](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7f4e4e56355f37d2e81587ec05b01ce10ca6b946))
* **structure:** Non modification objets par défaut ([d2b6737](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d2b6737c00a5772de86af0b452f3f8ed7107746f))
* Valide et formatte correctement les numéros de téléphone français ([39208b2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/39208b2a3ee6481630aa87c0006ea1aa0c628c4a)), closes [#366](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/366)


### Bug Fixes

* **a11y:** Ajoute du contenu au libellé des cases à cochées, même lorsqu'il est masqué ([d7468a4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d7468a4d291d60d972b19c66e81785e994498f11)), closes [#253](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/253)
* **Accompagnement social:** déselection de l'organisme insctructeur ([0a55a2e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0a55a2e89ff446c64f52aee8c313d4b7a1a5a9f8))
* **beneficiary:** correction du label désignant les personnes vulnérables ([366a8e7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/366a8e7719da9b951dfe49f0e889f9ba8751e1ba)), closes [#360](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/360)
* **entretiens:** Filtres non fonctionnels ([691a5cb](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/691a5cbd37b12694598f493b1b228cbb35d94065))
* **instruction de dossier:** Objet d'accompagnements disparaît ([02f2255](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/02f2255cfbb97821aa703ea791d2bc5344b92079))
* **structure:** création des os par défaut ([67d3df1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/67d3df10248963f80355e236c551c5f00ef79f4a))
* **structure:** issue[#381](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/381) ([21156fc](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/21156fc2e5b4632a374c13dd1fb2fae8cc3e949c))
* **Synthèse:** déselection d'un organisme prescripteur ([1d4f103](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1d4f10310845b7e1e4d697252095cb71188b1eba))
* **tableau de bord:** Affichage entretien en cours ([5c552e7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5c552e77cd150d56cd0f288883b6ca0bab314f82))

### [1.16.1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.16.0...v1.16.1) (2024-03-04)


### Bug Fixes

* **stat:** Correction du ticket [#359](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/359) ([e6317e9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e6317e9570e1cab44b48d7c7a89ae3d886c5cb68))

## [1.16.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.15.0...v1.16.0) (2024-03-04)


### Features

* Ajoute une favicon ([c045eb7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c045eb77b9931046c353e48338fd8a43728aa582)), closes [#258](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/258)
* **Annuaire partenaire:** Amélioration de l'UI ([eca0932](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/eca09324115cf37948b36af0536724411c09da4a))
* **Annuaire partenaire:** Possibilité de supprimer un partenaire ([b0c4ab8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b0c4ab822ceebd4f070f96a5883cb347039c9c99))
* **Annuaire partenaire:** Reprise du style ([df575aa](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/df575aaa5f6ac88ea5a1aa5127d359a7713337a7))
* **annuaire:** gestion de la liste de contacts ([ed8902c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ed8902c748a1c97d4942d00cfad4289a9511508c))
* **annuaire:** possibilité de supprimer un contact ([309ad00](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/309ad00d04fe115c5c35bccfcae90831c4eb328d))
* **beneficiary:** Ajoute l'adresse au formulaire de création de bénéficiaire ([fb752b4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/fb752b479fcd5db08f8aee331e6a3ae4296000e3)), closes [#332](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/332)
* **beneficiary:** Ajoute la détection de doublons à la création d'un bénéficiaire ([4097f6c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4097f6c436d7b51286ae693628ad8a4c00e32f53)), closes [#331](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/331)
* **beneficiary:** Retire le champ Mandat Aidants Connect sur le formulaire simplifié de création ([2d20318](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2d203184b62561da98423afc2daa1fba625ab1b9)), closes [#332](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/332)
* **Catalogue partenaire:** Ajout de la page du catalogue des partenaires ([285b59c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/285b59c73cba11b1db986aa085b3b32eb94adc71))
* **file-instruction:** Rétablis le filtre par date de fin de prise en charge ([f032956](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f0329567085fc1bd28287e522c5ad8fa20c69935)), closes [#353](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/353)
* **followup,file-instructions:** Ajoute l'alerte lorsqu'on quitte le formulaire ([f1e10bc](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f1e10bc78e8380febdd55ac307c502408c797f20)), closes [#367](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/367)
* **followup:** Ajoute la durée d'entretien ([c151ce8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c151ce8ee2e71ff6daf0b588be9d2c5993955a84)), closes [#352](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/352)
* **ministere:** Supprime les signalements et les interventions ([6b45bb2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6b45bb211fce82ca1a099afc19af3a3c64569152)), closes [#290](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/290)
* **notifications:** Ne notifie pas l'auteur de l'accompagnement lorsqu'il commente son propre accompagnement et notifie les référents du bénéficiaire ([2d99ea5](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2d99ea5e7164493edaa74be1077db334cf5b5700)), closes [#312](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/312)
* **notifications:** Reprend le design du module de notifications ([fc0f837](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/fc0f8374560d470feac98e97d23941a7cc56a41b)), closes [#288](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/288)
* **overview:** Affiche les accompagnements en cours ([c174133](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c174133a067f69af5f11606aefa519d320747189)), closes [#336](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/336)
* **structure:** Met à jour les objets d'accompagnement proposés par défaut ([5143d00](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5143d002ba6316965ddec3f9dd8899d613938f1e)), closes [#350](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/350)
* Utilise le svg de l'annuaire sur le tableau de bord ([c0667d8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c0667d87fc1d3508ef57fcfa87240d3203ca5d7e))


### Bug Fixes

* Ajuste la couleur des pictogrammes ([f86a857](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f86a857448eaf87a7ccc28b5d2401544684a77aa))
* **followup:** Corrige un bug qui empêche de supprimer un objet d'accompagnement d'une synthèse d'entretien ([06c8fd4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/06c8fd432bb854577460cf7d61a14b66a73636a9)), closes [#363](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/363)
* **history:** Corrige un bug qui empêchait le défilement jusqu'à l'élément ciblé dans l'historique du bénéficiaire ([3e88674](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3e88674700170322d6ac984f91a29daf45646bd7)), closes [#354](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/354)
* Simplifie le texte d'aide des champs de numéro de téléphone ([625eca8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/625eca86707a361ea6f4d3ffd2dd10788566415d))
* **social-support:** Affiche le bon libellé pour le statut Traité pour les ministères ([f3b3a88](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f3b3a881cf93f2f09201654cd275ddc88b46acf2)), closes [#355](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/355)

## [1.15.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.14.2...v1.15.0) (2024-02-15)


### Features

* Ajout d'un filtre sur le type de dossier d'instruction ([da5fe7e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/da5fe7e6700039792a35ad8369dd29f46910a542))
* ajoute le code pays dans le format de téléphone attendu ([5556cf2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5556cf2b9d1f63c5a281acb1e2976890a3ffa199))
* Améliorations diverses accessibilité ([896aca4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/896aca4dd7affd62d18706eba33dbe029a8ad223)), closes [#340](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/340)
* **beneficiary:** N'affiche pas des filtres incompatibles avec le filtre de type d'accompagnement sélectionné ([736f3f6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/736f3f6e352a88419dd29ba8ed431cf5050bea05)), closes [/gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/249#note_1761862860](https://gitlab.com/incubateur-territoires/startups/monsuivisocial//gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/249/issues/note_1761862860)
* **dépendance:** Mise à jour des librairies nuxt ([a0ebde2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a0ebde25fa737ed6561fbf89d84725b7c01e87bb))
* **dépendance:** Mise à jour des librairies prisma 5.8.1 ([e8015e6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e8015e6b195bb0a38e4920e0636633dbb71b1403))
* **deps:** Mise à jour mineur des versions de librairie ([99ad515](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/99ad5156a86f90f6891769ec7c61980b2d2c650e))
* **help-request:** saving issue ([66067d9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/66067d985d94b422bac9ca35b5fc1e04e0de2268)), closes [#324](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/324)
* **history:** Affiche les demandes de logement dans l'historique de la fiche bénéficiaire ([dafb09b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/dafb09bbd705f73c10792eaced19161f84707d52)), closes [#249](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/249)
* **history:** Classe les accompagnements d'une même journée par ordre chronologique ([8d892ff](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8d892ffe68796d2eafaffd4d5f916e8220162891)), closes [#319](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/319)
* **housing:** Ajoute le formulaire d'instruction de dossier d'aide au logement ([e5e1bad](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e5e1bade4018c1437efc4183ba665ac33606bcee)), closes [#291](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/291)
* Introduction de la notion d'instruction de dossier ([c50a07c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c50a07c1cd621ed59f60b16e49cdc86e064f7dd8))
* **minister:** Ajoute les délégués du dernier remaniement ([f42455b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f42455b91618d28d5fe89ea30e6ba8d4ed77cfb8)), closes [#344](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/344)
* Mise à jour des patchs des librairies ([490fa8e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/490fa8e9d72eb87588d8595a4d54ab0320d28b37))
* Mise à jour des versions mineures ([f7259f4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f7259f4064c86c65dcd07cbf7750a2121a3d5ccf))
* Ne trie plus les options d'un sélecteur multiple suivant leur état de sélection ([ecaaa47](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ecaaa476aa59d27cf69047200b0931e8d48aaa1b))
* Reprise du tableau des dossiers d'instruction pour intégrer les demandes de logement ([c099d31](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c099d31c442e4615e8848a84e332d64b24bc53f3))
* **stats:** Affiche les statistiques relatives aux demandes de logement ([e2ce68e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e2ce68e4a46c6e5a1d2cc98705966dc9cb11a4fc)), closes [#199](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/199)
* **stats:** Ajoute le filtre par période ([ac315e8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ac315e8b786ddb9871831b0d574da642abfc58e7)), closes [#341](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/341)
* update stylelint-config-standard-scss 12.0.0 to 13.0.0 ([2be05ff](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2be05ffe761dca671671a933c160ea35aaff15dd))


### Bug Fixes

* **a11y:** améliore l'accessibilité du titre de la barre latérale ([8962598](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/89625983d81d56f1df9963635baf5f598a09a413))
* **a11y:** Améliore la découvrabilité des options d'un menu mise en focus ([4c9eac2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4c9eac26e2fcafaaa99dd550ae09144509503c63))
* **a11y:** améliore la navigation au clavier dans l'onglet historique de la fiche bénéficiaire ([b4488dc](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b4488dcc4df0cafa2565d47159480ef50475bdf2))
* Après la déselection d'un filtre à sélection multiple, celui-ci peut-être considéré comme aucune des valeurs proposées ([f45720d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f45720d445eea7f473c849301eef8df4c675c9f8))
* **beneficiary:** Corrige la réinitialisation des filtres aux valeurs précédemment sélectionnés ([d6aaa03](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d6aaa036d88db0491e1b54be04774b4d4fb248f3))
* **beneficiary:** Corrige un défaut de typo ([52c3517](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/52c3517b4d0573f61860478ee584ca5becd7bf08))
* **beneficiary:** N'affiche qu'une seule fois chaque objet d'accompagnement utilisé ([1304616](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1304616255b2e370894f0e9b5b55837c9cd02eec)), closes [#342](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/342)
* **beneficiary:** Ramène sur la fiche du bénéficiaire à l'issu de l'impression de celle-ci ([258d0ff](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/258d0ffa47ed82372cbd1c088b480b9af8227b22)), closes [#315](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/315)
* Correction de la modification du statut d'un dossier d'instruction ([d0c1253](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d0c1253726bf569045b0d627bdeaf8e7cfca0e30))
* Corrige des bugs sur les filtres ([cc31abd](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/cc31abd876266c8020d2c370f7380bb9a7d3393f)), closes [#250](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/250)
* Corrige la chaine vide dans une champs date ([6cc82e0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6cc82e0174ef2dbf37179352d9636b362a37ef65))
* Corrige un espacement entre certains champs ([478d6c9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/478d6c97aa39f37ce3fa3bda1d19d4da06a1da5b))
* **formulaire:** autorise les numéro de téléphones étrangers ([018d1c8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/018d1c8ee92db0169d1428c46263e209bf25327f)), closes [#320](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/320)
* Gestion de l'erreur de validation Zod à l'ajout d'un document ([1887ad4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1887ad42ed01edf4b66646c7b0b4a774123a5f13))
* **help-request,housing:** Corrige un bug qui empêche de modifier la synthèse privée d'une instructiion de dossier ([3a160ec](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3a160ec7c58c87e8a6020a36ed97bbcc2214f60b)), closes [#338](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/338)
* **help-request:** Corrige un bug qui permet de sélectionner plusieurs objets d'accompagnement ([385a5b0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/385a5b0636404b3d99d08164bcf2f4024ece8810)), closes [#342](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/342)
* **housing:** Agrandit la taille du chevron de l'accordéon ([aad71ba](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/aad71ba69940fff390cc8d44975d77c88dcf6af0)), closes [/gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/291#note_1764112491](https://gitlab.com/incubateur-territoires/startups/monsuivisocial//gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/291/issues/note_1764112491)
* **housing:** Corrections mineures sur le formulaire de demande de logement ([8cf5932](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8cf59324bf7402eaa7810d655b93d0e2d323e7eb)), closes [#291](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/291)
* **housing:** Corrige les motifs de refus ([6ca4e26](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6ca4e2646b3682d03224caaab72bf2eff41bc5f0)), closes [#245](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/245)
* **housing:** Corrige un bug qui empêche de ne pas renseigner s'il s'agit d'une première de demande de logement ou d'un renouvellement ([3ae0e2b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3ae0e2bc7570421e77bd50ecdca02b260ae28a30))
* L'affichage du tri ne se met pas à jour dans l'en-tête du tableau ([1785148](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/17851489d2adc4250ba095a6eebd5021f8ddf8bc)), closes [#319](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/319)
* **overview:** Améliore la recherche bénéficiaire en se basant d'abord sur le nom de famille ([9ff4db0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/9ff4db0f0adc672e03706145b1a88de4a3141402))
* **stat:** Corrige les filtres par date et par type d'accompagnement ([c8c596b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c8c596bb7217dd4783df9e5788d6da543b27b3b4))
* **statistique:** Calcule des aides financières: ([c690eda](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c690edad7db9e69fb56c26ee32af6c4ecedc103d))
* **stats:** Ajuste la date de mise en production de la fonctionnalité des demandes de logement ([441fba1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/441fba13b0811645449d50929d4d4b88a17cd2f5))
* **stats:** Applique correctement le filtre par période sur les statistiques des bénéficiaires ([baaa92b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/baaa92b14f34e5753ec60008c2d050c19168cfdc)), closes [#341](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/341)
* **stats:** Désactive les pourcentages sur les statistiquers de bénéficiaires ayant interpellé chaque ministre ([bf8d2e2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/bf8d2e2de588c0ab42ee36f98f131c4c879e7150)), closes [#199](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/199)
* **stats:** Masque les filtres incompatibles avec la thématique sélectionnée ([2cbb269](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2cbb2691c9bd30d96ad8e1473b20744c70143638))
* **stats:** missing social support type condition ([2224de6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2224de6b1385d503029a8bbef89db1916acb8018)), closes [#325](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/325)
* **stats:** N'affiche pas des filtres qui sont vides ([b8f9ddf](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b8f9ddf7c8df7caddd4f94ad02de94e555afb951))
* **stats:** Recalcule le nombre total d'instructions en fonction du filtre de thématique d'instruction ([ee35fc8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ee35fc823b6b42a6b9c5a03b8dce376b8551d1f4)), closes [/gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/199#note_1761990326](https://gitlab.com/incubateur-territoires/startups/monsuivisocial//gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/199/issues/note_1761990326)
* **stats:** Restreint l'accès aux routes de statistiques en fonction des permissions ([3f6d6c2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3f6d6c2122391c3ab2df53223ab6515c4180084d))
* **stats:** Trie les statistiques d'interpellation de ministre ([64a3732](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/64a373278966920cbadb493f682d6c026653c004))
* **structure:** Corrige un bug qui affiche en double un type d'accompagnement falcultatif créé une fois la structure modifiée ([ed5bf15](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ed5bf15cb038365c07a546a64c6943d2f6f2caa8))

### [1.14.2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.14.1...v1.14.2) (2024-02-12)


### Bug Fixes

* **stats:** Corrige un bug qui empêche de filtrer les statistiques entre deux dates ou en fonction d'un objet d'accompagnement ([d98fc0e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d98fc0e509f2fa1219584709a5f7d93f0454d47c))

### [1.14.1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.14.0...v1.14.1) (2024-01-23)


### Bug Fixes

* **statistique:** Calcule des aides financières: ([213a9ad](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/213a9ad0d711a371510de70032787d7e130249fc))

## [1.14.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.12.0...v1.14.0) (2024-01-22)


### Features

* Affiche la version du client dans le pied de page ([8f9da19](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8f9da196782389eb334fe31d08d6317da697ec1d))
* Affiche la version du client dans menu latéral ([c6a8223](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c6a8223841826e26f3801aec5d7c360117393fb2))
* Affiche une erreur lorsque les caractères < et > sont utilisés dans un texte libre ([c802e30](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c802e301cfefda118b130b45e6b81428f551a676)), closes [#202](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/202)
* **beneficiary:** Ajoute le champ département ([82fffb2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/82fffb2a23bc4a1be83cca4be3a3a6120306524b)), closes [#289](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/289)
* **document:** Affiche une erreur lorsque l'ajout d'un document échoue ([05f7683](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/05f76832b29fc6764fab6fae0d0e66b85c45634e))
* Gestion de la déconnexion après une mise en vielle ([6a46386](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6a463864227efcdb95549c904594a8f75413fb22))
* Gestion du rechargement de l'application après publication d'une mise à jour ([4b03b04](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4b03b044c134a51775967783b3befda5ca2d2fb4))
* **history:** Déplie l'élément visé de l'historique du bénéficiaire lorsque accédé depuis la page des Accompagnements ([f0cc30d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f0cc30dee278e0ea6c700babbdf9a370355b6936)), closes [#284](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/284)
* **instruction:** Ajoute une modale pour sélectionner le type d'instructions de dossier que l'on veut créer ([829c8d3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/829c8d3a9a2856e02268836acf6564542f0cfe21))
* **instruction:** Reprend la mise en page du formulaire d'instruction de dossier d'aide financière ([15bb1ac](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/15bb1ac645f1b34a521e099e5a4adc7779778d8b)), closes [#246](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/246) [#245](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/245)
* **logging:** Ajout de la journalisation des adresses IP ([093149b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/093149bd5f3311dcee343bc511d0f7457f7c7265))
* **matomo:** Ajoute un événement de suivi lors de l'accès à la page de création de bénéficiaire depuis le tableau de bord ([4dee2dd](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4dee2ddc890f126a63af669321be23c628185079)), closes [#280](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/280)
* **ministry:** Ajoute le nouveau ministre suite au remaniement ([13771b2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/13771b2ed3e6e072a9357516f74b0f26133583eb))
* Retire le droit de suppression d'un bénéficiaire aux référents ([b38912d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b38912dcad99a5a3e601e051294ab89609ed51d7))
* **securite:** Augmente à 300 le nombre limite de requêtes avant que le serveur soit saturé ([ab4eb51](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ab4eb51bf843c8003e17375aa09c07793e41ea71))
* **stats:** Ajoute le filtre par statut pour les statistiques de bénéficiaires ([32a4863](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/32a4863e076e49405abf0095dade0c92804f872e)), closes [#283](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/283)
* **stats:** Ajoute les statistiques par département et par ministre ([98b2df6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/98b2df6e8ac9ad9ab4a395c3fccfaafa40afa3e2)), closes [#282](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/282)
* **structure:** Supprime les types d'accompagnement associés à une structure lorsque celle-ci est supprimée ([45ae4ba](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/45ae4ba319e5d74fc768c5a9a416dbb3b5df662a))


### Bug Fixes

* **a11y:** Permet aux lecteurs d'écran d'annoncer les messages suite à la soumission d'un formulaire ([acb236b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/acb236b8ed607233cf560d00cef7076d2bcf2fd9))
* Agent d'accueil ne peut pas modifier une instruction de dossier ([67711ef](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/67711ef3ad2fc43c529be7dae4d79a8ce903db3f))
* **beneficiaire:** Corrige un bug du comportement déplié/replié des éléments de l'historique d'une fiche bénéficiaire lorsque l'onglet actif était changé ([bed69bf](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/bed69bfa959a94ec9eef30ee03abce577989383d)), closes [#273](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/273)
* **beneficiaire:** Corrige un bug qui empêche l'affichage des flèches de navigation en bas du formulaire d'édition d'une fiche bénéficiaire ([dfc5ded](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/dfc5ded6433f120f1b9e5c5d99d36424e99665f5))
* **beneficiary:** Corrige un bug qui empêche de filtrer les bénéficiaires par tranche d'âge ([10410ef](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/10410efc1e77b7690b7db61885469e8f2a6f90ca))
* Correction du calcul des statistiques des demandes d'aide financières ([3d385aa](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3d385aa53adabcc80a3d89a5cb589157379946c2))
* Corrige un bug qui empêche la création d'un nouvel organisme prescripteur ([82b6e35](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/82b6e35fd62c31131878ce8a456ffdc3e236b09f))
* **document:** L'état de chargement apparaît suite à la modification ou la suppression d'un document ([a4a8817](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a4a8817b544703e67276a72a68892460aa96eef9)), closes [#305](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/305)
* **foyer-fiscal:** Corrige la modification des membres du foyer fiscal ([9b9fdfe](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/9b9fdfeb43f7252faa3aa86470c719af743ea177))
* **history:** Un référent peut exporter les synthèses d'entretien et les instructions de dossier ([302882f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/302882fd1dfb026c59a80daa46341cfc9e9df1e6))
* **instructions:** Impossible de modifier le montant alloué depuis le tableau des instructions ([9a9904e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/9a9904eedd0c93d3cb8b219a6b450368aff80ad7))
* Corrige un bug qui empêche l'initialisation de certains filtres avec leur valeur précédemment sélectionnée ([2b923ed](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2b923ede228f86eec67204073d0441da7a9e1ab2)), closes [#254](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/254)
* **notification:** Corrige un bug sur les notifications de commentaire ([2b75ae6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2b75ae64ec5eaa2f27e8b7d29e08c75d9bc0c546))
* Présentation par ordre décroissant des stats de types de suivi ([f781a1a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f781a1a7e2aaa1e5ecc95ec80946295d5e4e1c2b))
* **security:** Consolide la configuration des Content Security Policy ([80128b1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/80128b18f40135d8a32e9fa4e028bb6e2f22d755))
* **social-support:** affiche le séparateur avec les commentaires dès lors qu'on peut ajouter un commentaire ([5a4a31b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5a4a31b40a1b82f505cee48dff297f5c902bb9b8))

## [1.13.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.12.0...v1.13.0) (2023-12-19)


### Features

* Affiche la version du client dans le footer ([2a10399](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2a10399de213bfd92c6f6e2636eb792c6af30b45))
* Affiche la version du client dans menu droite ([8f88640](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8f886400270480ba3cca2812853e0239814a7e16))
* **logging:** Ajout d'un middleware pour logger les adresses IP ([0ed7df1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0ed7df18110c6157908472ef01c46fe3487314b4))
* **securite:** Augmente à 300 le nombre limite de requetes avant 429 ([a55664e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a55664e508d09c1caec39aa4d4bd02cdd607afab))

## [1.12.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.11.1...v1.12.0) (2023-12-13)


### Features

* **beneficiaire:** Affiche des champs relatifs aux ressources des autres membres du foyer en fonction de l'ajout de membres au foyer fiscal de la fiche ([302745f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/302745ffd5f67f5b2c35abc2b0d13fa24e1983da)), closes [#241](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/241)
* Être notifié quand un.e collègue ajoute un suivi à un bénéficiaire dont je suis référent ([faafb10](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/faafb1045ed803c00e51d0a71de3246ca2fe882a)), closes [#239](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/239)
* Gestion de message d'alerte avant déconnection ([66a729d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/66a729d7056156c821dcdcc6ab0209b7f4c830fb))
* Gestion du rafraichissement du jeton de sécurité ([40257e4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/40257e49c5f238edc8aea07e4781185c1a5da372))
* **instruction:** Ajoute une modale pour sélectionner le type d'instructions de dossier que l'on veut créer ([52c5d90](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/52c5d901b07c511f580ac43327ee2910765ece4a)), closes [#243](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/243) [#247](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/247)
* **instruction:** Renomme instruction de demande d'aide en instruction de dossier partout dans l'application ([0e41e16](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0e41e168f6976fdae711f08a3fb7da7f65f5148b)), closes [#237](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/237)
* Marque le cookie en http-only ([1b70e0e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1b70e0e994f509144fa1de583fcf0f8890edf980))
* Mise à jour de nuxt-security ([11a138c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/11a138ccc519c10ac6436643f77635ad89327842))
* statistics contrast ([da65e55](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/da65e550ef63d8b209a1d492a29415f2dff47a5e)), closes [#251](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/251)
* **stats:** Afficher la répartition des bénéficiaires par villes ([7976819](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7976819bb806571e19d7c9f59733c4318fc953ad)), closes [#240](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/240)


### Bug Fixes

* **auth:** Renvoie correctement une erreur lorsque le retour de l'authentication d'InclusionConnect ne présente pas les paramètres attendus ([4a2d97b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4a2d97b7a6921b7241f3c8033afc17adef981d91)), closes [#262](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/262) [#265](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/265)
* **auth:** Reprise de la validatation du token pour éviter un freeze de la page ([624969e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/624969e3fd2d6a95182859143c47f2c5ac7fee9c))
* **beneficiaire:** Corrige un bug qui rendait cliquable le lien vers un document confidentiel auquel l'utilisateur n'a pas accès depuis un élément de l'historique du bénéficiaire. ([504ad5f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/504ad5fdd2bdbda55fcfdc7673e0e241d48cd36e)), closes [#272](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/272)
* Correctifs mineurs ([c21b5ca](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c21b5ca9ffb6af291b8e91a8a8ce9b4eb2f6913e))
* Correction et amélioration des vérifications de validité du jeton ([06d2a98](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/06d2a987b44b8330ff6582286c4a19b63c90c132))
* Corrige un bug qui empêche de retirer une date déjà saisie ([2b9d6bb](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2b9d6bb99a7f54737392518325c65002c1a0aef4)), closes [#270](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/270)
* Corrige un bug qui empêche de sélectionner une adresse dans un DROM dans les formuaires ([b6a44e8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b6a44e8c27e4311e71b2fd3eca9a8eaff0e896bf)), closes [#275](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/275)
* Désactive la modale de choix de type d'instruction de dossier ([3aee473](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3aee4731f941fd2afef1f663082de06343e4d738))
* **document:** ajout d'un documnt closes [#263](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/263) ([baba8d4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/baba8d404449a6a323225ee554f58ff8ef3b6807))
* **matomo:** enable matomo on dev environment ([0f48434](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0f484340cc008a016e2c3ec916566f4d989bc294))
* Modification de la durée de validation du jeton de sécurité ([dc9a04c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/dc9a04c0ff8331e63d0298cfb784bd57388af183))

### [1.11.1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.11.0...v1.11.1) (2023-12-11)


### Bug Fixes

* **admin:** Impossible de créer un type d'accompagnement facultatif sur une structure ([58c68c9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/58c68c9de1e42273e4953d18c5de4834e19ca2bd)), closes [#266](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/266)
* **auth:** Renvoie correctement une erreur lorsque le retour de l'authentication d'InclusionConnect ne présente pas les paramètres attendus ([79d42b7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/79d42b723a173b973a7eb33b777e5ef98d6fe982)), closes [#262](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/262) [#265](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/265)
* **auth:** Reprise de la validatation du token pour éviter un freeze de la page ([65799f7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/65799f7a26ab12091357e1355054de13834af8e9))
* **documents:** Améliore la mise en page des filtres ([94c11cb](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/94c11cb05c6c53137f077adeb270bbe6ef888948)), closes [#261](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/261)

## [1.11.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.10.2...v1.11.0) (2023-12-05)


### Features

* Cache les champs signalisations et interventions des suivis ([6a06fb4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6a06fb442b708be1f03c81783b78523254a72c1b)), closes [#234](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/234)
* Mise à jour de nuxt-security ([eca6ca9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/eca6ca9b9f141a0af0c61da0d347a9163257be7c))
* Mise à jour des versions mineurs des paquets ([534edf4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/534edf40c8b047aa301eec752df0ddfaf23e4564))


### Bug Fixes

* **admin:** Affiche un état de chargement lors de l'authentification à l'espace d'administration ([b8da168](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b8da16830a7d1a7b4f5a517a6adee21f0ee30578))
* **admin:** Corrige l'envoi de l'invitation à l'atelier premiers pas aux utilisateurs créés 7 jours plus tôt ([6937b4e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6937b4e0725abf37de2dde959ec019e15c7b400f))
* **admin:** Impossible de mettre à jour les types d'accompagnement des structures ([55dbe61](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/55dbe61ab8c6ebee78ca6f556bf471935e9519cf)), closes [#229](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/229)
* **admin:** La récupération de l'admin authentifié depuis les cookies génère une erreur ([4db97c1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4db97c108d6e834410db06840428458cc82306aa)), closes [#229](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/229)
* **auth:** L'application ne gère pas le cas où le jeton d'authentification n'a pas pu être récupéré auprès d'InclusionConnect ([46227d9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/46227d914727c886610a48d69c8b4127e102b0d7)), closes [#230](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/230)
* **beneficiaire:** Affiche toujours 3 filtres par défaut ([ec4297e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ec4297eeaf9f4c4d905c4215e1b18bfbd67a51f4)), closes [#92](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/92)
* **beneficiaire:** Lors de la modification du numéro de téléphone du bénéficiaire, l'information était effacée ([6276e27](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6276e2762520b13f0a87f7501f9ebc1945b0c48a)), closes [#226](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/226)
* **beneficiaire:** Quand le tri par date de naissance est appliqué, les fiches sans dates de naissance sont toujours triées en dernier ([1b29222](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1b29222b928c1ad1cb69d847e966ac52a436fd30)), closes [#92](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/92)
* closes [#227](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/227) ([23dd319](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/23dd3190354312f60767a648f259fdd2c3e45e42))
* closes [#227](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/227) ([94556ae](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/94556ae512a32acca2d10c940ad84d83d0360f2e))
* closes [#228](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/228) ([039ec23](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/039ec238a5ffecd87d87687469e705afe5082dff))
* Déplace la génération du contenu des emails coté serveur ([d504e45](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d504e45c3d71399f411eb11c5652632a2be84cea))
* Do not throw an error during trpc context creation if the user is not found ([d62d705](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d62d705efed40aa86e96284816159c71f040aa4a))
* **export:** closes [#233](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/233) ([711d84d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/711d84d5c36da6ce626a065bbf5c2b1a03617709))
* Gestion d'un utilisateur connu de IC et pas de MSS ([8bfd380](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8bfd380e8517db633c26fd00235e8506cf6cbc4e))
* Gestion de la contrainte unique lors de la création d'un type de suivi ([62aba47](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/62aba474da20c502781f06c80b1bd4bf97170256))
* issue[#252](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/252) ([17cc65f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/17cc65fa6d39e74c43babe9a0e39dac1fbf02f12))
* **matomo:** set cross-origin-embedder-policy to unsafe ([e9af7b2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e9af7b2423846ff12ea03c258b1f13b1b85a1845))
* **nuxt:** ptimizing dependencies configuration ([a2fe16a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a2fe16a75387aec7eb0675c6697486b24f0f0d93))
* Sauvegarde de Réorienté après l'entretien ([204c08a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/204c08a9c56e7ce38baee120313245cab114344e))
* **structure:** Corrige l'affichage d'erreur lorsqu'aucun type d'accompagnement n'est sélectionné lors de la modification de la structure ([0feb692](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0feb692cd7899dddf921244b231fdbe5bc74b20d)), closes [#229](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/229)
* Supprime les espaces et mets en mininuscule l'email de l'utilisateur ([f8e7a30](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f8e7a305c439003102ef396a4fd36c98779af5fc))

### [1.10.2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.10.1...v1.10.2) (2023-11-28)


### Bug Fixes

* **admin:** Corrige l'envoi de l'invitation à l'atelier premiers pas aux utilisateurs créés 7 jours plus tôt ([ecdca56](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ecdca5612071cbf33a4386fde0c702307709ab52))
* **admin:** Impossible de mettre à jour les types d'accompagnement des structures ([afdaef6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/afdaef6e93907a946a6d319ad7a60aeead18b214)), closes [#229](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/229)
* **admin:** La récupération de l'admin authentifié depuis les cookies génère une erreur ([1dff780](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1dff7806c6a4c532a7f6b3a7289b923169cae6e1)), closes [#229](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/229)
* **structure:** Corrige l'affichage d'erreur lorsqu'aucun type d'accompagnement n'est sélectionné lors de la modification de la structure ([8605bf3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8605bf357aa4f7f3edc1c1dd34e4ca738a294c1b)), closes [#229](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/229)

### [1.10.1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.10.0...v1.10.1) (2023-11-23)


### Bug Fixes

* **beneficiaire:** Affiche toujours 3 filtres par défaut ([be17a99](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/be17a99c6e6e0f6b77a35100328e8a67290c1b46)), closes [#92](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/92)
* **beneficiaire:** Lors de la modification du numéro de téléphone du bénéficiaire, l'information était effacée ([43a542e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/43a542e0fddd3fb4f4417e64617502fb88875113)), closes [#226](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/226)
* **beneficiaire:** Quand le tri par date de naissance est appliqué, les fiches sans dates de naissance sont toujours triées en dernier ([2c467fe](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2c467fe0ee0ddfce6bc9f5b7b5d825bd966c6c19)), closes [#92](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/92)
* closes [#227](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/227) ([4b1c034](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4b1c034d9d059718d92d1c41faee9c6cbccf10a3))
* closes [#227](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/227) ([3c7d7bb](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3c7d7bbc162f9228062441bd7d2782db947f5e14))
* closes [#228](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/228) ([af18045](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/af180459ddf2d9f2062e2a3dc68917df393bce33))
* Déplace la génération du contenu des emails coté serveur ([fec1b3b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/fec1b3b5bc04733107aea56fc9d0562f09ba8a93))
* Gestion d'un utilisateur connu de IC et pas de MSS ([e23fe3a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e23fe3a773ce73bec0f052dce382efc3461261e8))
* Supprime les espaces et mets en mininuscule l'email de l'utilisateur ([b424503](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b424503ed15e684f6f209479edddd61d7ef1af02))

## [1.10.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.9.0...v1.10.0) (2023-11-21)


### Features

* **beneficiaire:** Permet aux utilisateurs avec le rôle Travailleur social ou Référent de supprimer une fiche bénéficaire à laquelle ils ont accès ([dee2b51](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/dee2b513ae2184153bc8d1c4bea9368e152398a1)), closes [#211](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/211)
* **beneficiaires:** Reprend le design de la page qui liste les bénéficiaires de la structure ([ee856c5](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ee856c512b0826cb00200465fab29ccfe326f7b1)), closes [#92](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/92)
* **statistiques:** Ajoute un filtre par référents dans les statistiques ([4d7c5d1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4d7c5d18e4c42c8843cef1aed282cc8905ba8290)), closes [#213](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/213)
* **utilisateur:** Envoie aux utilisateurs créés il y a une semaine un mail d'invitation à l'atelier "Premiers pas" ([45a02bf](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/45a02bf548494a8db1a08551c45d29f4f9948421)), closes [#212](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/212)


### Bug Fixes

* **beneficiarie:** L'identité du bénéficiaire n'est pas affichée dans le fil d'Ariane ([e3628b2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e3628b26e943d027862675d02e9c695755fbf0c8)), closes [#214](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/214)
* Création d'un bénéficiaire avec un membre du foyer lié ([0ea892d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0ea892d51adaf52bcf110d455f5ef98d7eeb9c7b))

## [1.9.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.7.0...v1.9.0) (2023-11-15)


### Features

* Ajout d'un bandeau dans le formulaire de santé ([47038b6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/47038b6d73767add43a10adf9a97346c44cde66c))
* Ajout d'une API health check ([99b4b45](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/99b4b452d46af1fe92483bab49c9278063e59813))
* Ajout des constraintes d'accès aux données ([3ed6c02](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3ed6c0222f1f711264184415cf39855b8a4a6472))
* Ajout des permissions pour les documents ([1f95281](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1f95281a6f22c017bef4758236de3b0cd468f996))
* Ajout du type de structure EFS ([f7ded12](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f7ded120a43f73bdcb8141cbea3c7fc049fcf9aa))
* **beneficiaire:** Affiche une alerte lorsque l'utilisateur quitte le formulaire de la fiche bénéficiaire afin de préciser que les informations ne seront pas sauvegardées ([c0d0a97](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c0d0a974b0e060190c0367010c4d5ad327ed7b0c)), closes [#148](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/148)
* **beneficiaire:** Mets à jour le design du bloc invitant à compléter les informations du bénéficiaire sur le formulaire simplifié ([6fe8564](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6fe8564bc547493dc25d20f94997a2a8cb554c32)), closes [#191](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/191)
* design corrections for beneficiary page ([47ef8a0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/47ef8a0b5e85e3bd12b89f2ef63ff8a7d29b7996)), closes [#194](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/194)
* **formulaire:** affiche un bloc d'erreur qui résume toutes les erreurs présentent dans le formulaire ([2b8d1e9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2b8d1e90d91542f2f24c135ce979c9301ec1f5a1)), closes [#67](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/67)
* Gestion des règles de la page bénéficiaire via les permissions ([28c0769](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/28c0769d69f26c1e525ab70a7bbbf45e7429d4c9))
* **help-request:** closed by agent status ([44dca2a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/44dca2a7dcf670fec1a3a99ecaf3b5bb8dc18086)), closes [#171](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/171)
* Historique du changement des données ([1a4c6e6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1a4c6e6c383d01c6a7e4df582ec29bf3719f249b)), closes [#57](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/57)
* Introduction des contraintes sur les dépots des données ([d3d6d1b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d3d6d1b83e29bd9b118e384f908b0d2daab5a24e))
* Mise à jour de la règle de visibilité des informations de santé ([94a621c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/94a621c2db16736e972569ccfb5f061954741107)), closes [#163](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/163)
* **prisma:** Usage des écritures imbriquées au lieu des transactions ([3b98f2c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3b98f2cda225159270b66a409de974f09a398825))
* **security:** Utilisation des permissions pour la création d'un bénéficiaire ([72295d6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/72295d6cd4e4c1daca20c98428b77c2c4ede019f))
* **security:** Vérification de la permission de changer un champ ([4e7dc61](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4e7dc61d9ad9e851037f9213948680e953955b08))
* **structure:** ajoute un mail de bienvenue à la création d'un espace pour une nouvelle structure ([d9d7209](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d9d720964548e189db52ee9d8f02c78bf1b4d1f6)), closes [#203](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/203)
* Suppression des guards et ajout des permissions par type de structure ([f885723](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f885723764713fa62ee3e8f5a1ccc062bd8ca75b))
* Une commune n'a pas accès au NIR ([a4445ad](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a4445ad0dc977b87d1ce521dbf3c21af89fe762e))
* Utilisation d'une vue sql pour les types de suivi ([bb6ebf8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/bb6ebf8f296e2860172426ec46dcb3ba2fa49208))
* Utilisation des permissions pour la création du bénéficiaire et gestion des types de structures ([6d79df5](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6d79df5b46bc94dca72e67ecaec021dcf6632271))


### Bug Fixes

* Affichage d'un bandeau informant du problème d'envoi d'email ([faa7ad4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/faa7ad417ff981b54050620d071a1f99b50b59dd))
* Affichage des commentaires dans l'historique d'un bénéficiaire ([4990d47](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4990d47a3d3c7192e5a6a2064312188a2aef68ca))
* Améliore les erreurs affichées sur plusieurs formulaires ([a93d774](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a93d77479d4f4c530efee0eb5b3e7da4e9b91eeb)), closes [#67](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/67)
* **beneficiaire:** Affiche l'alerte de fermeture lorsque l'utilisateur quitte le formulaire via le bouton Annuler ([15c5afe](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/15c5afe7598c4ffffb4267c5f42aec5626d182a0))
* **beneficiaire:** l'impression de la fiche bénéficiaire génère une page blanche ([10fdce5](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/10fdce51b2c43d042f4e67bedd3a0930d79bb0d6)), closes [#181](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/181)
* **beneficiaire:** la navigation entre les sous-sections de la section informations générales recharge la page si le formulaire d'édition a été accédé depuis un onglet de la fiche bénéficiaire ([d7d028b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d7d028b9fda9dd7fd386324802f785af1dfdcb44))
* **beneficiaire:** la navigation vers une sous-section du formulaire ne fonctionne pas correctement sur chrome ([3db8d08](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3db8d0812bc34243e448759a3e2f5a4038cad936)), closes [#180](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/180)
* **beneficiaire:** Masque une section de la fiche lorsqu'elle est vide ([1896b6e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1896b6e3c7123bcb10cfc3d6d7fc4b5b4a2ab649)), closes [#209](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/209)
* **beneficiaire:** N'affiche pas l'alerte de fermeture si aucune modification n'est faite sur le ([06b978a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/06b978a77cd2ae40019fdbceb080a87b74a1e3db))
* Change la règle d'apparition du block santé ([35b9eca](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/35b9eca8cc0707d05b3457c7e1033f843c88e409))
* closes [#177](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/177) ([98c226d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/98c226dbae4f7a1d2a449345fedb6eb51ba41bc3))
* **connexion:** affiche un message d'erreur si la validation du jeton échoue ([18c296d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/18c296da062a10183256ce6fcdab86eb8f37ce25))
* Correction de la création d'un utilisateur ([9c73710](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/9c737100221181116fcb299947d80a0a5391359b))
* Diverses corrections mineures de bugs qui permettent de sélectionner une option désactivée dans un sélecteur multiple ([5a4b882](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5a4b882fd85ac3158b0a2f2ad4df23f745d9964f))
* **email:** Les retours à la ligne ne fonctionnent pas sur Gmail ([f85a7c8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f85a7c8ebd580c2e8be247282f4f25380d6ff5c1)), closes [#203](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/203)
* **filters:** pagination bug ([2139ad0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2139ad009166a6553367e0e2df9c5e497cab4f7a)), closes [#190](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/190)
* Filtre les données avant le traitement des requêtes ([a63ab49](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a63ab49c2213333795f8e9afd0c8d2230ae0a030))
* **formulaire:** affiche un message compréhensible lorsque la date saisie est incorrecte ([f51f0e2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f51f0e24f7c3f2b8cb866b4f6a927fcced3e3dd1)), closes [#67](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/67)
* **help-request,followup:** Corrige l'ajout de commentaires ([56978f7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/56978f7495b477898070199bf6d5e21f7c5d7014)), closes [#210](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/210)
* le bouton de fermeture d'une alerte temporaire ne s'affiche pas correctement ([b002a84](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b002a84fb32ebb2534ba77bc4645c4c002d2f943))
* lock file ([5f2885a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5f2885a01e748ab62fc1f0eb1e79f54d6b196960))
* Masque l'icône calendrier du DSFR sur les champs de date sur Firefox au profit de l'icône rajoutée par le navigateur ([250d75f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/250d75f7a58fc6b425034c18a8829b408db8c59c)), closes [#192](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/192)
* Règle d'édition des informations de santé ([fe51b01](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/fe51b019dcdefcd602cee755f5d9ed29ae37e63f))
* un champ de formulaire faisant partie d'un groupe de champs n'est pas focus s'il est le seul a avoir une erreur ([87fb347](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/87fb3478b5987c37c9e0ac831f6ee024d4dde794)), closes [#206](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/206)
* VeeInput automatic formatting ([01873d1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/01873d18004d27d8de7a0524fb0e80ae5e817d18))

### [1.8.1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.8.0...v1.8.1) (2023-10-31)

## [1.8.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.7.2...v1.8.0) (2023-10-30)


### Features

* Ajout du type de structure EFS ([c1eca2e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c1eca2e801a93fb2d740d022ab4cdc1e606a9cf3))
* Une commune n'a pas accès au NIR ([2d01169](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2d011693339819f970f06bede0f8c8cbe6b8c9d9))

### [1.7.2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.7.1...v1.7.2) (2023-10-23)


### Bug Fixes

* Affichage d'un bandeau informant du problème d'envoi d'email ([22a088c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/22a088ca0c9f892fca0f914b687e16d134e58ce6))

### [1.7.1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.7.0...v1.7.1) (2023-10-23)


### Bug Fixes

* Correction de la création d'un utilisateur ([fa11bfd](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/fa11bfdcab64d417ffe194f52da3faaed91bf52a))

## [1.7.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.6.1...v1.7.0) (2023-10-16)


### Features

* **accueil:** ajoute un bouton et un bandeau de contact sur la page d'accueil ([8c4cb05](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8c4cb05ac9b33f6723ffc26fb058ad32999c62b9)), closes [#143](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/143)
* Ajout de contraintes sur les entrées des formulaires ([4957334](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4957334f77b3b8a32ab6aef7c17f2f0fa8220e91))
* Ajout des vérifications des règles de sécurité pour les routes ([a5e6e00](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a5e6e00de0aa8dee3a3c1eacda45e68a9a10ce91))
* Ajoute la section Activité/Revenu du formulaire de la fiche bénéficiaire ([26ea759](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/26ea7597b2a2e76fa264cef8528a0fbc3e4146f0)), closes [#149](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/149)
* Ajoute la section Entourage de la fiche bénéficiaire ([00bdf22](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/00bdf22c97f88cb1e5097f297fdb77886ca095ae)), closes [#124](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/124)
* Ajoute la section Santé du formulaire de la fiche bénéficiaire ([330c4f5](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/330c4f58c1c09308534b88b2e1ba151213dcb6be)), closes [#125](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/125)
* Ajoute la section Structures extérieures du formulaire de la fiche bénéficiaire ([36a8481](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/36a84814fcecd19d9007a468980e00eb5b9fe7fb)), closes [#126](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/126)
* Ajoute les membres du foyer fiscal au nouveau formulaire de la section Foyer fiscal de la fiche bénéficiaire ([6ada3df](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6ada3df0338f65a14367ab9cb8e887d004b723d4)), closes [#123](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/123)
* Ajoute une étape Foyer fiscal au formulaire ([3f82008](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3f820080a8141eecd1191799d91389a18760f2ec)), closes [#123](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/123)
* Améliore la mise en page de la section Foyer fiscal du formulaire de la fiche bénéficiaire et rajoute le champ "Date de naissance" à cette section ([2e5848b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2e5848bf88dc42b915d40eebb3c3f6af66c85132)), closes [#123](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/123)
* **beneficiaire:** ajoute le menu latéral du nouveau formulaire de la fiche bénéficiaire pour naviguer entre les sections ([dac0251](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/dac0251f94fd47069868961838b710d1313b52e3)), closes [#127](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/127)
* **beneficiaire:** met à jour la sous-section active dans la section Informations générales au fur et à mesure que l'utilisateur défile ([e124307](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e1243077cd90e580911be20daa7aafabfd4d8bb4)), closes [#127](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/127)
* **beneficiaire:** retire le champ mandat aidant connect du formulaire simplifié et reprend la mise en page de ce formulaire ([545e56a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/545e56aab18d3183e16f8c35a8e290e2645356ba)), closes [#147](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/147)
* **beneficiary:** add quick action "add button" in sidenav and add required fields indicator ([bdf55f1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/bdf55f124e5a1ed100c0bb4d17537fa4031bc379)), closes [#135](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/135)
* Change l'apparence du système d'onglet de la fiche bénéficiaire ([c1fdabc](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c1fdabc8693d976e9d283beee84dc06a6851c456)), closes [#132](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/132)
* Change la présentation de l'en-tête de la fiche bénéficiaire et des boutons d'action associés ([9080776](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/908077664ae4c2d47ed4038551ca455157cf8aa0)), closes [#130](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/130)
* Configuration des En-têtes de sécurité ([d7383d0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d7383d00d4bc064469a579432249f71bfcc25142))
* **document:** affiche les étiquettes supplémentaires du document au survol ([43aac23](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/43aac239d3d64a2cc123b65fce8cdf748df12417))
* **document:** améliore l'accessibilité des boutons d'action ([e652f65](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e652f6513f41cda76faaaed0806824d2ccb45630))
* Enregistre l'onglet de la fiche bénéficiaire ouvert au moment d'accéder au formulation d'édition ([3c4fb4f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3c4fb4f723b8de76facf270c8004bab921705594)), closes [#128](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/128)
* factorisation de la vérification des règles de sécurité ([4acdedc](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4acdedc0829cb7723f9ea80d8423b43900432788))
* **foyer fiscal,entourage:** ajoute des statuts aux membres du foyer fiscal et ajoute les nouveaux status Entourage professionnel et Ami·e aux membres de l'entourage ([046b785](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/046b785cbc6995a8490b09eedc38833a57f24be0)), closes [#139](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/139)
* **Liste blanche:** ajout des permissions pour les statistiques et l'administrateur ([a9f9ec9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a9f9ec9044eca788c69250d43562dc508b40b690))
* Mise en place d'une couche d'accès à la base de données pour chaque table ([b908ed5](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b908ed503931fbad29c5e4fdfa6847f5dcb81135))
* Mise en place d'une liste blanche pour les accès API ([7ec0f6c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7ec0f6cdff69319cb1785cc3972de5cabca19c50))
* Nouvelle présentation de l'onglet information d'un bénéficiaire ([82dddba](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/82dddba6c775138d9e845f7e0d9524b94305cc52))
* Préparation à la mise en place de la liste blanche ([f548e72](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f548e72f3644c399c735d4700754cc764f4cd678))
* Reprend l'expérience utilisateur de la section Informations Générales du formulaire de la fiche bénéficiaire ([b43866c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b43866c16d6958619981d9fbbceaecfe83740147)), closes [#122](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/122)
* Reprend l'interface des documents dans la fiche bénéficaire ([fd4e961](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/fd4e96143c93116abb41b03a19014745817e51b3)), closes [#60](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/60)
* Reprend le design des systèmes d'onglets ([18d6d9c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/18d6d9c48c8c662834b73b4d4196bb48a957f427)), closes [#132](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/132)
* Retire le nouveau champ Lieu-dit, commune déléguée ou boîte postale ([d844eff](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d844efffaccf44a7c7fd3bf18d20995e09dba7a5)), closes [#122](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/122)
* **seed:** ajoute un compte administrateur par défaut pour travailler en local ([34c55b4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/34c55b4d761877b8327e4f2c0621e3da1fc20a23))
* valide la saisie d'un champ uniquement après l'avoir quitté ([1b2740d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1b2740d3ff53d171c4d81aa0315150aae5d6853a)), closes [#67](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/67)


### Bug Fixes

* **a11y:** améliore l'accessibilité des liens externes ([6bda729](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6bda72926cf8f73f54acb19b5614ff55f93fbe0b))
* Ajustements UI sur la nouvelle fiche bénéficiaire ([fbecc43](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/fbecc43f9312ae147dcb366e2d018fbd347cb5af)), closes [#131](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/131)
* **beneficiaire:** améliore la mise en page de la section entourage du formulaire de la fiche bénéficiaire ([4b6ef34](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4b6ef34d1f93b2b9cbbef04bc722f0d1a5f25653)), closes [#124](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/124)
* **beneficiaire:** corrige des libellés d'informations de la fiche bénéficiaire ([62e7b34](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/62e7b344a99f57e11aee7f2e5e19b5ad2c418ab4)), closes [#125](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/125)
* **beneficiaire:** impossible pour un agent d'accueil de charger les filtres relatifs aux demandes d'aide ([baf42e1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/baf42e16dab9eefc83a0655ccdc43955e6d1d74b))
* **beneficiaire:** le second numéro de téléphone n'est pas affiché ([a96a4fb](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a96a4fb11636c12d2e5f1f81791e7e6a70bba950))
* **beneficiaire:** lors de l'accès à la sous-section Mobilité depuis la section Informations bénéficiaire, celle-ci ne reste pas active dans le menu de navigation ([f3fa858](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f3fa85827610ccff29eba26e05dec6da2dfe0095))
* **beneficiaire:** retire l'ombre portée des blocs de l'onglet historique ([a19c5e6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a19c5e69f686f0bfad6c53a91591e0ddf66c95b9))
* **beneficiary:** améliore la mise en page de la section activité/revenu du formulaire de la fiche bénéficiaire ([ef24baa](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ef24baab8653a7ca79d5378c7f29d4348ee64d54)), closes [#149](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/149)
* **beneficiary:** file number in details metas ([5f5d36b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5f5d36bf01f0c697c2893d8a875db12f7f52ae29)), closes [#130](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/130)
* **beneficiary:** referent role can save beneficiary with complete info ([bac2104](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/bac2104fb7b54fee5884e5cec6b786d3a1c28e96)), closes [/gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/135#note_1545546050](https://gitlab.com/incubateur-territoires/startups/monsuivisocial//gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/135/issues/note_1545546050)
* Corrige l'affichage des onglets de la page Accompagnements ([196eba1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/196eba1c1df74dfa8b0fa78cf82c2ec90a86f19c)), closes [#132](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/132)
* Corrige le message d'erreur lorsque la modification d'une fiche bénéficiaire échoue ([dbe7760](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/dbe7760c56ea32e6584a7f9da20d13bfca579e43))
* **demande d'aide:** impossible de modifier une demande d'aide ([df127b2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/df127b2083cfc8c51a54230dd89d6d71fc5f338e))
* dépencance cyclique ([c06f90e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c06f90e61d01a9ee9a37f8abc63fa6a2d7de95f8))
* does not return handlers from route creation ([1d0670f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1d0670fa576a8589a116915e66c939d090d81d1a))
* **followup:** the success message after uploading a document to the followup is wrong ([63be16a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/63be16a815f8751c21331668e2aa0f5bb404d1ea)), closes [#136](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/136)
* **formulaire:** problème d'affichage sur les champs de type date lorsqu'ils sont désactivés ([d87bde6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d87bde65cda6441b1909ac39521613a31dcacec8)), closes [#164](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/164)
* Impossible d'accéder aux statistiques ([e4be399](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e4be3993e47422c570eb21be8325f0aebe37cfe7))
* Impossible de vider le champ Numéro Pegase ([132cd0d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/132cd0de45e4e4debdc035882dab4139d18d05db))
* impossible de vider un champ optionnel avec un schéma nécessitant une longeur minimale ([fc6a76f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/fc6a76f158141dd067a864b160ea23b7649ffccf)), closes [#107](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/107)
* **Inclusion Connect:** au retour d'IC, l'email est mis en minuscule pour faire la recherche coté MSS ([71eca89](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/71eca89288ffd5d12cbebc2a24d5408bbb7b8a9d))
* Lors de l'annulation du formulaire d'édition d'une fiche bénéficiaire, la redirection se fait sur la fiche bénéficiaire ([acc5c6a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/acc5c6a730ec1ea09cbbc2fba6e3eb05b736e1f1)), closes [#128](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/128)
* **seed:** beneficiaries does not have any referent ([1b05e18](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1b05e189f399b8d8123dc1028d5c57ebb19932ed))

### [1.6.1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.6.0...v1.6.1) (2023-09-26)


### Bug Fixes

* Impossible de saisir un montant de ressource avec des centimes et de saisir 0 enfant mineur/majeur ([9b68ce5](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/9b68ce5b91c5288600f79e30a5ff4bd3cb05c95a)), closes [#145](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/145)

## [1.6.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.5.2...v1.6.0) (2023-09-04)


### Features

*  beneficiaries export ([28cf1d7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/28cf1d7d17e8f80f1ac9219a849930c73519121d)), closes [#55](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/55)
* **a11y:** adapt title for each page ([1f0ba7e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1f0ba7e09a857da3253b9c8cfa011c2f872c1f38)), closes [#87](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/87)
* **admin:** améliorations espace admin ([9d200fa](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/9d200fafafeb939b8b3e340911cad8af37516d79)), closes [#103](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/103)
* **admin:** Problèmes de création d'un utilisateur depuis la partie admin ([b497867](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b4978671be9c1abd333919850f1b63f028e55604)), closes [#102](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/102)
* Ajout d'un ruban indiquant l'environnement ([f572be8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f572be89c90284de3ffe8833c3bc19e95f7e6ef2))
* **beneficiaire:** Gestion du formulaire complet de création d'un bénéficiaire ([64e3f69](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/64e3f694bac38b725b86364790a4e07e52f69ce4))
* **export:** add followup count, followup type total for followups and help request count ([d40f115](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d40f115841a428be68dc5ef8d357fa7fba1885b3)), closes [#56](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/56)
* **export:** Ajout de l'export des statistiques ([a7ea908](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a7ea908bcb8b407ce5593ccdc9fb19ea0a6763c3)), closes [#56](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/56)
* **export:** external organisation column name ([d81e1af](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d81e1af8a0272555cf3e82035637e3c9cc3e0214))
* **export:** Résolution des retours sur les exports d'historique ([76ff8ca](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/76ff8cab7b5599b22d93992aea656322ac73aee0)), closes [#54](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/54)
* **followup,help-request:** update ministers after the last cabinet reshuffle ([b6ba784](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b6ba784da23941dcfed990700ee50ab72e9ca90c)), closes [#99](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/99)
* **history:** add export to Excel sheet ([dd58721](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/dd58721557c7f01356ca2b56313468f8eb05d6a4)), closes [#54](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/54)
* **matomo:** add matomo events ([776c393](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/776c3937a25b0d6c0b64287445f6bd3ad7eb8bbb)), closes [#65](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/65)
* **matomo:** add tracking on the document edit button ([580c234](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/580c2342d9c4620f6cb8e920bcb17618bb33d653)), closes [#113](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/113)
* update roles table for history export ([0548ed7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0548ed78efa8c3e5193c10d37c3480c34107ffe1)), closes [#54](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/54)


### Bug Fixes

* **beneficiaries:** age group filter is not working ([8943335](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8943335ed3bd9549befdc06716442d9d22f23bd8)), closes [#117](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/117)
* **beneficiary:** the accommodation mode additional information input is shown even if the beneficiary is not hosted ([1e2ec05](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1e2ec05287c5180e745f7eebe9c6675eac21f2a2))
* can not edit additional information of beneficiaries ([64ab031](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/64ab0317d443f74eda45ed665847eef512f8daea)), closes [#105](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/105)
* death date error ([968718e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/968718e800d4e7b2df571f6896fb96a1d53d11bf))
* **export:** correct stats export permissions ([0a6a340](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0a6a3401663a97c6cf149cf8806ebb13e2c919ba)), closes [#56](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/56)
* **export:** minor fixes in the beneficiary export ([cb45cf8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/cb45cf8ec1f68dc00d71f50e9c4fdb21fc518009)), closes [#55](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/55)
* **export:** minor fixes on history exports ([9e67dcc](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/9e67dcc45b5471019ec6e6b6a7701656b8b9b027)), closes [/gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/54#note_1533726687](https://gitlab.com/incubateur-territoires/startups/monsuivisocial//gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/54/issues/note_1533726687)
* **export:** resolve beneficiary export issues ([d48c2e4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d48c2e4fb663268594238886714dffe553edc0f0)), closes [/gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/55#note_1533255992](https://gitlab.com/incubateur-territoires/startups/monsuivisocial//gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/55/issues/note_1533255992)
* **export:** use the dsfr button instead of a link ([c771f98](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c771f98b6e8bea64aac330d6421c427eb346c461))
* **export:** wrong column label for the followup referent ([12539b4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/12539b47f48d593e6c05d3624bc1a4d05af09814)), closes [#54](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/54)
* **filters:** examination dates and cities filters only includes accessible data ([880f9e0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/880f9e02c3ff20faaaedad69ab4961a9e0cbc602))
* **filters:** hide referents filter to referents ([289f704](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/289f704fcc3eefcfed97f60419ee179647927662))
* **filters:** referents can not filter based on referents ([7448195](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7448195ee3d465afbefb8f9bc107a03fcd54b3c4))
* **permissions:** stats export is wrong for referents ([f5c0f1b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f5c0f1baddd7487d93139f62e58bbf01a28d0d23)), closes [#110](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/110)
* remove dead link ([d2d06d4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d2d06d40cde40aa63d238489c342ebb65334459e))
* Sauvegarde du champs Mode d'orientation dans l'édition d'un bénéficiaire ([11708d6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/11708d6e48fadd10d7e5bf803f252a2000aa6b71))
* schema imports errors ([ce65ad3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ce65ad3ad5f9b5944c239d1ca5a8d7dbbb5204b9))
* **stat:** first follow up stat does not take into account the referent status ([6ce621a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6ce621acf3a3a211e99b277aa93cfb23c9f72a8c))
* stats permissions ([b91b9a7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b91b9a764ddb96bb151e2b14248b95fc61111f94)), closes [#110](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/110)

### [1.5.2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.5.1...v1.5.2) (2023-07-27)


### Bug Fixes

* **matomo:** add missing events to track beneficiary creation ([c4e3c94](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c4e3c949839398d2a57e7243581013c332a53bec))

### [1.5.1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.5.0...v1.5.1) (2023-07-25)


### Bug Fixes

* **followup,help-request:** missing current ministers ([dbd7263](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/dbd7263c0a7430b021c95997e90563958646840c))

## [1.5.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.4.1...v1.5.0) (2023-07-25)


### Features

* **followup,help-request:** update ministers after the last cabinet reshuffle ([5c0f6fe](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5c0f6feff72b3755dad6a8767faa1ad1f99a7bfd)), closes [#99](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/99)
* **matomo:** add matomo events ([6de414a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6de414a328f8b5cc1302333cbd9ab01024536f72)), closes [#65](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/65)

### [1.4.1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.4.0...v1.4.1) (2023-07-24)


### Bug Fixes

* death date error ([c43c363](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c43c363d0adaeebc8a45a48a6102b700ace75bbf))

## [1.4.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.3.6...v1.4.0) (2023-07-24)


### Features

* **beneficiaries:** sort beneficiaries by the usual name by default ([6c45830](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6c458303a1cb9a9c2831369c870c664344269f3c)), closes [#80](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/80)
* **followups:** add date column and remove medium column ([850d0e4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/850d0e4e6d11dd627c2ee02c0437fa835e28b2cf)), closes [#78](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/78)
* **help-request:** update the label of the accepted status in help requests for minister structure ([56b869c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/56b869c9b3ee3964ccbed17705e9b060f9ff454d)), closes [#83](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/83)
* **history:** add minister filters for minitry structures ([0cfcf80](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0cfcf8052f37e74f4ff01cf7155c7e924c3c491e)), closes [#83](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/83)
* **seed:** add minimal seed ([bef53e3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/bef53e3b222e39f0646e68268aa49a3dc573025e)), closes [#89](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/89)
* **stats:** sort stats related to followup types ([d57cdf2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d57cdf298d698d81e8f609dfe5a9a171c8708849)), closes [#79](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/79)


### Bug Fixes

* **admin:** impossible to create an admin user not linked to a structure ([1e141bd](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1e141bd55a93fcbb43f6107f5720e9f229c9c787)), closes [#88](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/88)
* **beneficiaries,help-requests:** filtering by age group fails and cities and examination dates contains other structure data ([7ed1934](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7ed19342b87173271b20a1301bc3cfaa94793650)), closes [#98](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/98)
* **followups:** the follow-up types row is too wide ([184ee1c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/184ee1c6c64a10b95df4f0c66b9cbca8b24430d1))
* **help-request:** status for ministry are mismatched ([831e059](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/831e0598464633ca6f62ba5afdfbe75fc248ee56)), closes [#83](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/83)
* prisma updated date not updated ([934b6b1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/934b6b16d8d0305b2217c5d47bd598ffde7d5ae0))
* **table:** change the label of the sort button for numeric sort ([f2a1752](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f2a17527c5f26ee80b993c4364c7ffad02ce0e44))

### [1.3.6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.3.5...v1.3.6) (2023-07-19)


### Bug Fixes

* **email:** remove the incident banner on top of the user form ([7d8fafa](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7d8fafa8806b44abeebfc0899bae5e27521fa0d2))

### [1.3.5](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.3.4...v1.3.5) (2023-07-18)


### Bug Fixes

* **email:** update the incident banner message ([381f2f2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/381f2f2b92180bc46f824ac63c5387bac1cffb97))

### [1.3.4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.3.3...v1.3.4) (2023-07-18)


### Bug Fixes

* **email:** add a banner on top of the user form to inform about the brevo incident ([735debe](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/735debe8ff4453f577710744a7ff2de7b7df30db)), closes [#91](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/91)

### [1.3.3](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.3.2...v1.3.3) (2023-07-12)


### Bug Fixes

* **admin:** tous les utilisateurs peuvent accéder à l'interface d'administration ([05e3958](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/05e3958c1c4b018470105400e9ee030d55aaa03e))

### [1.3.2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.3.1...v1.3.2) (2023-07-10)


### Bug Fixes

* **logout:** remove user from auth store ([9baa27d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/9baa27d04336deeaaf87973fe64019f99637f2e1))

### [1.3.1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.3.0...v1.3.1) (2023-07-10)

## [1.3.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.2.0...v1.3.0) (2023-07-10)


### Features

* **document:** set added document into followup and help request ([69ee23e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/69ee23ebd64c8485093d48383daea688a88c2511))
* **tax-household:** remove deletion action ([dc45960](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/dc4596013866aeac17e3d23293f04f30ea0fa968))


### Bug Fixes

* environment variable is not set ([bb9bff0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/bb9bff0c2503ee7d91ef54957090d6decd309a5b))

## [1.2.0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.1.1...v1.2.0) (2023-07-10)


### Features

* ajoute matomo ([c92afa8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c92afa83c7a271ca30fc50c048eb76392e10bff3))


### Bug Fixes

* **beneficiaire:** ajoute le numéro pégase au formulaire de création de bénéficiaire pour les structures de type Ministère ([0d3d7fc](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0d3d7fc4687fb2b7f0f7beac259efb8cac47549c))
* **beneficiaire:** corrige un bug qui empêche de vider le champ code postal ([132c281](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/132c2818d29f1f0c21de833977d7c1d142e6faa7))
* **formulaire:** Affiche des erreurs intelligibles sur les sélecteurs ([4509659](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4509659656b13ef8f308dd4201ca4b33fef7b8de))
* les tags de document ne sont pas correctement affichés ([bce44a8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/bce44a8c5f3457b0cf255ba081c03e9ec0cb74a6))
* **logout:** call inclusion connect from client ([4751305](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4751305a492e0c7115c966b531c95ebeda703f01))
* use custom validation for zip code ([d0fe83f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d0fe83f2e0c7243f28352cb41c629d30073d195d))

### [1.1.1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/compare/v1.1.0...v1.1.1) (2023-07-06)

## 1.1.0 (2023-07-06)


### Features

* add accommodation zone stat ([86a3389](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/86a3389a60bfc6231dd2d68954245a8974fe8f41))
* add account page ([5875a05](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5875a05bd0ef4bd60e7643a3673ecd666cb62153))
* add beneficairy button action with access to add a followup ([2a63c1a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2a63c1a2d5673f638cc606794c3ead3bc00b46be))
* add beneficiary and history item brute delete ([74394f1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/74394f1750bbb8b76b658cb53f3aa36f479e2438))
* add beneficiary history ([a186517](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a186517eed911feddaf986cefc0b8d0ce6096a6a))
* add collection mutation logs on beneficiary page ([3844a28](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3844a28a14c567f000c0f02980812952db2c2b37))
* add createby and updatedby on mutable models ([8b2a4fa](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8b2a4faf0538f811102f3a026ab6f60e128b9b17))
* add document ([3931e6e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3931e6e60741bcdb1ee99834a8bcb27c61457cc5))
* add due date and end of support notification generation ([c6fc73d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c6fc73d2a9cc3a65991f0bd69efdbfe4f87b4c78))
* add edit permissions to the help request table ([5e03655](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5e036557c79c1b8c8b2b48a0ab6ab2eda3baf70c))
* add followup tab in history page ([c9fd6a8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c9fd6a80e938bbd93ca63008e3c7ef3e2c55d46b))
* add help request tab in history page ([be2d293](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/be2d2935641dcf9e461791ec9093995681b64bf0))
* add instructor organizations to the help request table with sort ([d5aa4b2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d5aa4b2e33f6d85cfc478f3acfb5f68bb2bd0b2f))
* add license ([126a42f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/126a42f4bf658bcb49fad9150a3976e2f7287d23))
* add middleware to skip auth for authenticated users ([96074ed](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/96074ed8ff900576dfd3917638b528ec939b8da2))
* add ministere departement structure ac stat ([502fea8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/502fea817bc82a940312668be68c02e76ac508b6))
* add ministere structure stat ([24226c2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/24226c2a37f94a03fd10e915a59c73bdae00e05e))
* add missing instructor organization stats ([c12dc2c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c12dc2ca9b101d859eec5f026826724540b0a3ea))
* add missing rule ([63205f7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/63205f7ed5e6e3d7769fec13e077a960483d9d4a))
* add notification generation one month before a due date ([20300c0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/20300c0527427bf66975ce591ab7bd20e2e68009))
* add page for disabled accounts ([0c3ac62](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0c3ac62f662c1742d008379e3ef0631c12d32c1d)), closes [#13](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/13)
* add pages to create or edit a help request ([e4c003c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e4c003cc92d0b1a1e3dd89eed2c50f6158cc63cf))
* add print page and other information section in beneficairy details ([4171e96](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4171e96650c26c9568584e6264571e06dc83f059))
* add structure page ([046d0f4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/046d0f4e63e447f730a3698b28844b9978c5e5b8))
* add users page ([12a76d7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/12a76d74ffe8c0b30f2c2c3611abde56c48ffff3))
* admin pages for structures ([d015e57](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d015e5716517a9ba17e07636e871ffcd865ec58d))
* **admin:** add overview ([93455ee](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/93455ee2ee5fb0e5af73ecab6ab27a584a0e2663))
* **admin:** create admin space ([5c85ce2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5c85ce2f16d3336574c2a8222441a9be1d9c9b39))
* **auth:** implement properly auth store ([a85a3af](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a85a3af58430af980043ca82fef68c94aca0bd1a))
* beneficiary detail page ([9df5d2a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/9df5d2acb4312b3b3e8022e176328e4ac0c2b41c))
* beneficiary edition ([66f2b52](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/66f2b5229fe4d26b5cac21892254be00129b6329))
* beneficiary form edition ([dd4e985](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/dd4e9856b1c50b064a7bc1262e9ec0ec275e60ff))
* **beneficiary-details:** add followup types ([31b82b8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/31b82b81b2285de4873f32359617ffa176658816))
* **beneficiary-history:** add beneficiary history tab ([b1d89dc](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b1d89dc3dda540bf93b22b4ad5dfe7cebea5a8a4))
* **beneficiary:** handle creation ([1abcfbd](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1abcfbdde5c2de8fcc364030d5da270c33e3e8a5))
* **beneficiary:** start implementing beneficiary page ([8b8a2b4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8b8a2b49123ce02c77599f8587baa8f95e14241b))
* **cgu:** reccueil de consentement des CGU ([71fdf43](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/71fdf435233956a135a19f3110b16faf64e1a419))
* clean roles and permissions mess for beneficiary ([c0cc992](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c0cc992f5729d817178f2edfea9bbd8e77238f57))
* clean roles and permissions mess for stats ([3e9b4f7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3e9b4f7f0c7391023f19a910ee30de0a9d822f44))
* clean the whole roles and permissions mess for users, structure and beneficiary ([80a9989](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/80a99893b10c4c2852c26bacd11fa31882326d77))
* complete btn in beneficiary creation form ([5194048](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5194048583d54c858b3875e5c0b74174df03d4a5))
* **document:** add confirmation before deletion ([4b7a46c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4b7a46cc63575954c0149f5fca36d93da86525bf))
* **document:** display document list ([cf7bd3e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/cf7bd3eda092d506cae6c69b005f48bb4cea6675))
* **document:** handle filename disk to maintain compatibility ([dba7a20](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/dba7a2042b7dc7c5a02f6646a5389e2c81f3b992))
* **document:** upload and delete document ([1c19951](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1c19951be33ccc2e2d25472bc7e13229e09b78b6))
* dsfr js scripts ([1860f55](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1860f55aac686dca75336c969e9be8066466ff89))
* edit document ([17897ab](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/17897ab9c6f4be17121e61b46ab225ba74681998))
* **edit-beneficiary:** use vee-validate ([4d8210a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4d8210a66e455d47a19426263948d906945d9d07))
* **followup:** implement followup creation ([b001ca7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b001ca75bee00cb90ba00396bd0fe7f82c004919))
* format beneficiary names to a human-friendly format ([2c5b800](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2c5b80065ebb83646e98aa865325b06dca17abe4))
* handle relatives in beneficiary edition and update schema ([3420129](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/34201295a285820a32748c3855b4a6d70d440af9))
* **help-requests:** update help request status wording ([07895e6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/07895e6670e0286a73621f02d8be273715de5805))
* implement beneficiaries page ([08047eb](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/08047ebbe8079ff30b530b80b1a8fe0b41f9d299))
* implement page showing variables ([0f1e1db](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0f1e1db3ff16e4c929d0581f7ff605380eb30181))
* introduce page container component ([fcdb771](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/fcdb77104507801d680b0354ec64ddf4d181dff2))
* **jwt:** handle refresh token ([ade6e01](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ade6e01350a5bd24c746b3d2cbcdf884fe4399b6))
* lock access to different section in the beneficiary based on the permission rules ([4633d15](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4633d15bc8d539ea58adc57c2628914bc6987a0e))
* **logout:** logout after inactivity too long ([6be4d7f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6be4d7f001798a2c237ac36a4a45af1cae3864ad))
* make trpc protected procedure context safer ([8de8f19](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8de8f19825b2666b3648c4cd4b3ff16f2a84c130))
* merge two enums ([c708307](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c708307ab79d3c35a09b80a47c26be7b5e59479e))
* **notification:** display notification in dashboard ([2b73830](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2b73830d737fcb7bc93db04713da51abee54f5f4))
* **notification:** display notification in dashboard ([3c58976](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3c589767b568c53ef825e1448659af78ba5a71f1))
* **overview:** beneficiary search bar ([07eddcd](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/07eddcd269b418040049fe323516cdd3c7fce44b))
* redirect to the url the unauthenticated user is trying to access ([edc155b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/edc155b16a826bba847a483f5c6e91739865915d))
* redirect unknown user to an error page ([b107ce0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b107ce061531352b7e7dbed7e39e4641d992d376))
* **s3:** s3 lib and document handlers ([6729bce](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6729bcec73aa86e675e5fc9e840900a3d2968529))
* scroll to target element when navigating accross pages or tabs ([a47f3f6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a47f3f6af713ea61739198b73c9b1cd6b3334e34))
* **search-beneficiary:** search beneficiary input ([510dcb1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/510dcb1e6784b590b7844ef86b2a937980b0b97b))
* show linked documents in history ([07ffd87](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/07ffd873c9bf39f6b0eb56ae3a1a2fd266d0a52b))
* stats filters ([6e85147](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6e85147959d9b3f0a285a3c585bb58c343452bfe))
* stats history ([37e0b2d](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/37e0b2d4c6400fd13f5a9d6fcba732a290d5dc05))
* **tab:** use vue3-tabs-component ([597aee0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/597aee05ac080dbbed7cc4f199dea97c9be6b946))
* **trpc:** add transformer ([4f99885](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4f9988532561aed4c4810c16b5a34db27aff4932))
* update breadcrumb ux ([19e4510](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/19e45101cef1809d84c6774ab6cc59df01fa45a8))
* update token parsing and migrate to the demo realm ([4f48c8f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4f48c8f869a81a10a744d9942290fb77fde91517))
* update vue-dsfr ([5685102](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/56851021dd80e6c9608d0b0ffdb0a56dc26670ff))
* use security rules ([4a9ae48](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4a9ae488bf7bfe3e064911a7292d543650d09f09))
* use vue-tabs-component in history page and rename tabpanels for better genericity ([8ac129a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8ac129a0805282d76c2f59f45df20ad402370711))
* useMinistryAgent ([7fe3d8e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7fe3d8e7037e33d3e7ab093380c8da411069765b))
* **user-activity:** introduce user activity ([2ebeaa0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2ebeaa02e6f2e0851100ad13d99eabcc1da31e1a))
* **users-activity:** replace mutation logs by user activity and add pagination ([5324b4a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/5324b4af8b5da4d480acd0966d68c628b02f4d7f))
* **user:** send email at creation ([e4180b6](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e4180b61f1b4835912f0f87d27cc0b325a616cba))
* **user:** update email content ([ecc21bc](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ecc21bc9fd6375165f5a4a780e7b1bddcfd5eeb6))


### Bug Fixes

* add social security number input ([8427cbb](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8427cbb0f845d24c3c5c7de19fb8053a9eb0010c))
* adding structure follow up types ([7ad63c0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7ad63c002a68b467d0ce123cd6d94caa8f155c71))
* **auth:** fix conflicts resolution ([cc82c16](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/cc82c164cf64793c7d483c8047ec4398cec2d89c))
* beneficiary deletion - closes [#63](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/63) ([781e1b7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/781e1b75f9f8255e0f580c25048fd570b04f1216))
* **beneficiary:** extra spacing around the info alert in the creation form ([13e74fd](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/13e74fd470750a008ed8dee3d2fd1c1190222dda))
* cannot add a comment to help request ([a624214](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a624214bc78eeefcbe78d62edb06e9bb61933754))
* closes [#64](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/issues/64) ([cbb1ddb](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/cbb1ddbb59b663599e6178b42ed55e2c68525346))
* confidential document rules ([8ad62c9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8ad62c9efd5a9d1ed0dc2c2a7847b649ae499034))
* disabled agents in beneficiary add form ([342c8c0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/342c8c00ae4b016117f2e2a6e40b3b6d781fdeb9))
* **document:** use correct event ([f16e00b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f16e00b5a8bbc488b5363a1795153cccbaf52b67))
* examination date bug in filters ([9094fb5](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/9094fb50084554deb7a349f90fbde6609dfb188b))
* filters for supports stats ([52c7f2e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/52c7f2e29d5852d4aff4c2210b5143e8db2a40c0))
* force using stable pnpm version ([13e351f](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/13e351f8b3ff9a1be4d5443e0addc2973f8ad236))
* import ([f545d60](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f545d60049c23558be3c4d06eec9cbae1274a01c))
* impossible to access a beneficiary from the searchbar ([f886d70](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/f886d705dec5e4ba88b77201b6516e3c1d6b51d1))
* impossible to edit a help request ([45fb6b7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/45fb6b7a6fb442502a6796f6d00554daa13fb09f))
* **inactivity:** logout only if process is on client side ([4ef2499](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4ef24999570ec8a13e38701067536914521f6b0d))
* instability due to the client directly accessing to prisma ([ea38ab1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ea38ab1f263411264182fba146179b594219919c))
* invalid page file ([1d60bf9](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1d60bf933bceaef35eda9088ccafa007549befe7))
* javascript float number magic is applying to allocated amount sum ([cfa43ab](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/cfa43abf977de70449fb7f4de7a95d969dd4dbf9))
* logout success text ([192901a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/192901acfb4c7c6bf7e8d4ad20a3afa64b5e45e3))
* make linter happy ([1d028f2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/1d028f24195af2286bbe62dcb3c0644f9a3ddb7a))
* make skip auth working on a direct navigation ([c99b448](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/c99b448b2d94f1b9fccd00458829a96a05699e0b))
* middleware for editting a followup is based on wrong param ([8c5ddfc](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8c5ddfc84d13b4672b8b4202f3f938a5e185f63f))
* nuxt config ([e4d05cf](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e4d05cf3dbd91bd38df0c775b1f39ff498d0e293))
* prevent crash when user is unknown ([d470b78](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d470b7845db6a26ec6a932a4c637d36c34cf1752))
* **prisma:** prisma client workaround ([b007d96](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b007d96fa120d00fa9020d937c810e6bdf2f2204))
* reactivity issues and pagetopbar accessing user before authenticated ([4965040](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/4965040e6ad4fb35d98a957c6e86dbe6b657d629))
* redirect to the correct url after the token validation ([bf499ab](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/bf499abc61b29ff1d5ca2394d81c4f46d83b5e46))
* **refresh-token:** avoid infinite loop ([8493bfe](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8493bfeaa94727e78f183fc9df2023fcc4e0cc2f))
* relatives labels ([d922bc1](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/d922bc19cd326257b677721197b6113ec5c30271))
* required email alert on beneficiary creation ([2d06df4](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2d06df4e46e68ce7ff979d60431604dd62a39c62))
* return button from beneficiary searchbar is wrong ([39464f8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/39464f8829eb8ea2107bfc5ea6fc93b1fef53dc7))
* **route:** missing route rename ([b3bcd67](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b3bcd67ace2dadda1e2a68bc5b03ad022156bf76))
* sidenav ssr error ([6812fe0](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6812fe0b25bceeaccb3050df6d9617a15b763574))
* sort custom followup types in the get-structure  route ([e7b9278](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e7b92784e0074dcdcf405fa9ab6503197c80f264))
* sort followup types by name in followup pages ([e677075](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e67707521a7df06f25934df0184d6c892aaa03ec))
* sort legally not required followup types in the structure edition form ([2c19b3a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/2c19b3a1d6ed01227b1da8db052d87171dc9e162))
* sort mutation logs by date ([ac54f6a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/ac54f6a4f17826253830e35592e31a6b5c2c4166))
* stat access and requests ([0c2182a](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0c2182ad8520ac6ff09c2d600d172217565fd540))
* stats issues ([bf749b5](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/bf749b59741afc472230dc85ffbfe070109aa8ee))
* structure type is missing in the user in the session ([3f07304](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/3f073047accaa3caeb83adac94c591834a71249c))
* **tax-household:** select a linked beneficiary is not updating the value ([8918aa5](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8918aa533d0182ce84f72a5a1533f982b9b3c7c0))
* temporarly remove cgu middleware ([0b5718b](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0b5718bd6adfeb6f7702e7449328fb19d6c6fa9c))
* the user in the store has no structure id ([951b581](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/951b5814c42a511f4bf6f405fc698e21ba95b6e4))
* ts issue ([72741d7](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/72741d7796ab718e51c612377f5ad2757fc0855d))
* ts issues ([abb4211](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/abb421194772279970ecc1681a487667bd786aee))
* ts issues ([04e8412](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/04e8412cdf2b16d53917684bc6d5ee0b4f1dee06))
* type ([e393759](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/e39375962996c0214d377e1478f6552ce65cf515))
* type import issue ([7475be2](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7475be22817af4161d6082f1f7e483e02400108e))
* unwanted horizontal scrollbar on all pages ([7922d5e](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/7922d5e64be4ab331aa5e2c449ad529c2e55953b))
* unwanted notification on history items and documents ([8f72255](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8f722553e44ddd89853f2a9b59a1003feab064ae))
* useless first level in the breadcrumb ([a74bee5](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/a74bee589720cc93004b6286b8359c7a74a8e23d))
* user is still considered as login after inactive logout ([b8b6ea8](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/b8b6ea800160b96d12d29de71d04349a87c39537))
* users activicty not initialising properly when directly accessing the page ([6b29e96](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/6b29e969edf274dc2f5f0188c8899a419b1d85fa))
* users that can not access an added document are notified ([0f6447c](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/0f6447cfdf6c3671e6342be2b8ee1f88ed7888db))
* **validate-token:** validate token only client side ([064e0fe](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/064e0fe57df2cbc9f3dc0396f75ada7aaf081db5))
* wrong activity type ([8d83376](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/commit/8d833764465c433a5d883048667c4628bebe90bd))
