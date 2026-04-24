# TODO - Intégration IGDB API

## Objectif
Remplacer l'API CheapShark par IGDB API pour la gestion des jeux vidéo dans OmniShelf.

---

## Étape 1 : Configuration IGDB API

- [x] 1.1 Créer un compte sur [IGDB](https://api.igdb.com/)
- [x] 1.2 Générer les credentials API (Client ID + Client Secret)
- [x] 1.3 Ajouter les variables d'environnement dans `back_OmniShelf/www/.env`:
  - `IGDB_CLIENT_ID=...`
  - `IGDB_CLIENT_SECRET=...`

---

## Étape 2 : Service d'Authentification IGDB

- [x] 2.1 Créer le service `IgdbService` dans `back_OmniShelf/www/src/Service/`
- [x] 2.2 Implémenter la méthode `getAccessToken()` pour obtenir le token OAuth2
- [x] 2.3 Implémenter le caching du token (validité ~30 jours)
- [x] 2.4 Ajouter la gestion des erreurs et refresh du token

---

## Étape 3 : Endpoints BFF (Backend For Frontend)

- [x] 3.1 Créer le contrôleur `ProxyIgdbController` dans `back_OmniShelf/www/src/Controller/`
- [x] 3.2 Implémenter `GET /api/proxy/search` pour la recherche de jeux
- [x] 3.3 Implémenter `GET /api/proxy/details` pour les détails d'un jeu
- [x] 3.4 Implémenter `GET /api/proxy/scan` pour la résolution EAN-13 (si IGDB support)
- [x] 3.5 Normaliser les réponses en camelCase pour le frontend

---

## Étape 4 : Mise à jour du Moteur de Recommandation

- [x] 4.1 Modifier le service de recommandations pour utiliser IGDB API
- [x] 4.2 Implémenter la logique de recommandation par genres/themes
- [x] 4.3 Gérer le "Cold Start" avec les jeux populaires IGDB

---

## Étape 5 : Frontend - Services API

- [x] 5.1 Mettre à jour `front_OmniShelf/src/services/api/` pour utiliser les nouveaux endpoints
- [x] 5.2 Créer/modifier les fonctions de recherche et détails jeux

---

## Étape 6 : Frontend - Composants

- [x] 6.1 Vérifier que `GameDetails.jsx` affiche correctement les données IGDB
- [x] 6.2 Vérifier que le scanner fonctionne avec les jeux vidéo
- [x] 6.3 Tester l'affichage dans `MyCollections` et `Wishlist`

---

## Étape 7 : Tests et Validation

- [x] 7.1 Tester la recherche de jeux (terme exact, partiel)
- [x] 7.2 Tester les détails d'un jeu (cover, summary, platforms, genres)
- [x] 7.3 Tester le moteur de recommandations
- [x] 7.4 Vérifier la gestion des erreurs (404, rate limit, etc.)

---

## Étape 8 : Documentation

- [x] 8.1 Mettre à jour `CONTEXT/cahier_des_charge.md` si nécessaire
- [x] 8.2 Documenter les endpoints IGDB dans le README du backend