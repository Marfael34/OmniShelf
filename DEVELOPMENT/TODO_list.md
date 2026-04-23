# OmniShelf - Nouvelle To-Do List (Logique métier & Connexion API)

Ce document liste les tâches restantes basées sur le `CONTEXT/cahier_des_charge.md`. Les interfaces graphiques (UI), la navigation, le PWA Scanner et les composants de base sont terminés. Il faut maintenant implémenter les vraies connexions avec le Backend et achever la configuration d'API Platform.

## 1. Backend - Authentification & API Platform

- [x] **Authentification (JWT)** :
  - [x] Installer et configurer `LexikJWTAuthenticationBundle`.
  - [x] Vérifier la route `POST /api/login_check` pour la génération du token JWT.
  - [x] Créer l'endpoint `POST /api/register` (Controller avec hashage du mot de passe).
- [x] **Gestion de la Collection (CRUD)** :
  - [x] Configurer les attributs `#[ApiResource]` sur les entités (ex: `CollectionItem`) pour exposer les endpoints demandés (`GET`, `POST`, `DELETE`).
  - [x] Mettre en place les filtres et restrictions pour que `GET /api/users/{id}/collection_items` ne retourne que la collection de l'utilisateur concerné.

## 2. Backend - Finalisation du BFF Proxy & Recommandations

- [x] **APIs Tierces (Proxy)** :
  - [x] Remplacer les données factices de `ProxyController::search` et `ProxyController::details` par des appels réels vers les APIs tierces (RAWG, Google Books, Discogs, etc.) via le composant HttpClient de Symfony.
  - [x] Créer ou finaliser la route `GET /api/proxy/scan?ean={ean13}&category={cat}` pour la résolution des codes-barres.
- [x] **Moteur de Recommandation** :
  - [x] Finaliser l'algorithme dans `RecommendationService` pour analyser réellement les tags de la collection et interroger les APIs tierces.

## 3. Frontend - Connexion API & Zustand

- [x] **Authentification** :
  - [x] Créer le service `src/services/api/auth.js` (Axios) pour les requêtes de login/register.
  - [x] Modifier `useAuthStore.js` pour stocker le token JWT, l'injecter dans les en-têtes Axios (Bearer Token) et gérer la persistance.
  - [x] Créer les pages/composants de connexion et inscription (`Login.jsx`, `Register.jsx`).
- [x] **Hydratation "Live Data" (React Query)** :
  - [x] Mettre à jour `MyCollections.jsx` pour interroger `GET /api/users/{id}/collection_items` via `useQuery` et supprimer les données statiques (dummyData).
  - [x] Implémenter l'ajout concret à la collection depuis le Scanner ou les vues détaillées (`POST /api/collection_items`).
  - [x] Corriger l'appel API du scanner dans `ScannerModal.jsx` pour pointer vers `/api/proxy/scan`.

## 4. Frontend - Finalisation PWA & UX

- [ ] **Offline & IndexedDB** :
  - [ ] Implémenter le stockage de la collection de l'utilisateur dans IndexedDB (ex: via `localStorage`) pour un accès immédiat en mode hors-ligne.
- [x] **Skeleton Loaders** :
  - [x] Créer et intégrer des Skeletons (UI de chargement) dans `MyCollections` et `Search` pour patienter pendant les requêtes React Query.
- [ ] **QA** :
  - [ ] Tester les comportements aux marges de la caméra (Scanner PWA) sur différents mobiles.
  - [ ] Confirmer que l'unicité des items en base (produit + utilisateur) empêche les doublons.
