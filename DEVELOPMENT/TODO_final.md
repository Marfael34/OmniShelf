# OmniShelf - Finalisation du Projet (Phase 3)

Ce document récapitule les dernières étapes nécessaires pour atteindre une version de production conforme au `cahier_des_charge.md`.

## 1. Backend - Consolidation & Moteur de Recommandation

- [x] **Moteur de Recommandation (Amélioration)** :
  - [x] Implémenter le "Cold Start" : retourner des produits populaires (via RAWG/Google Books) si la collection de l'utilisateur est vide.
  - [x] ~~Finaliser l'algorithme dans `RecommendationService` pour analyser réellement les tags de la collection.~~ (Fait avec OpenLibrary)
- [x] **BFF Proxy (Multi-Sources)** :
  - [x] Intégrer **RAWG API** pour les jeux vidéo.
  - [x] Intégrer **Discogs API** pour les vinyles.
  - [x] Intégrer **Google Books API** pour les mangas/livres.
  - [x] Gérer le fallback gracieux si une API tierce est indisponible.
- [x] **Sécurité & Intégrité** :
  - [x] Ajouter une contrainte d'unicité `user_id` + `external_product_id` dans la base de données pour éviter les doublons de collection.
  - [x] Sécuriser tous les endpoints `#[ApiResource]` avec `#[IsGranted('ROLE_USER')]`.

## 2. Frontend - Gestion de la Collection & Wishlist

- [x] **Gestion Complète (CRUD)** :
  - [x] Implémenter la suppression d'un item (`DELETE /api/collection_items/{id}`).
  - [x] Ajouter un feedback visuel (Toast/Notification) lors d'un ajout ou d'une suppression réussie.
- [x] **Wishlist** :
  - [x] Implémenté via le champ `isWishlist` sur l'entité `CollectionItem`.
  - [x] Filtre dédié ajouté dans `MyCollections`.
  - [x] Bouton dédié dans les écrans de détails.
- [x] **Hydratation & Performance** :
  - [x] Optimiser le chargement de `MyCollections` : utilisation de React Query avec `staleTime` et cache local pour éviter les appels excessifs au proxy.

## 3. PWA & Expérience Mobile

- [x] **Mode Hors-ligne (Offline)** :
  - [x] Implémenter la persistence de la collection dans le `localStorage` pour un affichage instantané sans réseau.
  - [x] Ajouter un indicateur visuel "Mode Hors-ligne" lorsque la connexion est perdue.
- [x] **Scanner HUD Sci-Fi** :
  - [x] Améliorer l'UI du scanner pour un look plus "Sci-Fi" (bordures animées, overlays techniques).
  - [x] ~~Feedback haptique (Vibration) lors du scan.~~ (Fait)
  - [x] Implémentation du bouton "Torche" (via `html5-qrcode` et `applyVideoConstraints`).

## 4. Design & Finitions (Aesthetics)

- [x] **Polissage UI** :
  - [x] Uniformiser les cartes produits entre la Recherche, les Collections et les Recommandations via `ProductCard`.
  - [x] Refondre les pages de détails (`GameDetails`, `MangaDetails`, `VinylDetails`, `PopDetails`) avec un design Premium Sci-Fi et données réelles.
  - [x] Ajouter des micro-animations lors du passage d'un filtre à l'autre dans `MyCollections` (CSS Keyframes).
  - [x] Créer une page de profil utilisateur minimaliste (déconnexion, statistiques réelles).