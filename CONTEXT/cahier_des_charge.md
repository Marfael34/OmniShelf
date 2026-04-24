# Spécifications Techniques - OmniShelf

Ce document détaille l'architecture technique, les endpoints d'API, et les fonctionnalités clés du projet OmniShelf, en se basant sur le cahier des charges initial.

## 1. Backend : Symfony 7 & API Platform

La base de données respecte strictement la règle du **"Live Data"**.

> Elle ne stocke que la table `User` et la table `CollectionItem` (contenant `id`, `user_id`, `external_product_id`, `category`, `added_at`).

### Endpoints API Platform

#### Authentification (LexikJWTAuthenticationBundle)

- `POST /api/login_check` : Génération du token JWT.
- `POST /api/register` : Création de compte utilisateur.

#### Gestion de la Collection (CRUD local)

- `GET /api/users/{id}/collection_items` : Récupère la liste des IDs externes possédés par l'utilisateur.
- `POST /api/collection_items` : Ajoute un nouvel item (nécessite `external_product_id` et `category`).
- `DELETE /api/collection_items/{id}` : Supprime un item de la collection.

#### BFF (Backend For Frontend) - Proxy APIs Tierces

_Note : Ces endpoints interrogent les APIs tierces côté serveur pour cacher les clés d'API (Google Books, IGDB API, Discogs, Apify) et retournent un format JSON unifié au front._

- `GET /api/proxy/search?query={q}&category={cat}` : Recherche unifiée.
- `GET /api/proxy/scan?ean={ean13}&category={cat}` : Résolution d'un code-barres.
- `GET /api/proxy/details?external_id={id}&category={cat}` : Récupère les métadonnées complètes d'un produit.

#### Moteur de Recommandation

- `GET /api/users/{id}/recommendations` : Analyse les genres/thèmes des `external_product_id` de l'utilisateur, interroge les APIs tierces avec ces tags, et renvoie une liste de suggestions filtrées (excluant les IDs déjà possédés).

## 2. Architecture Frontend : React + Vite (PWA)

Le frontend doit gérer agressivement les requêtes HTTP simultanées pour hydrater les IDs de la base locale avec les métadonnées des APIs.

### Organisation des composants & State Management

#### State Management

- **Zustand** : Pour le state global synchrone (Store Auth JWT, Theme Mode, Scanner Modal State).
- **React Query (TanStack Query)** : **INDISPENSABLE** pour le "Live Data". Il gérera la mise en cache des requêtes tierces, la déduplication des appels, le `stale-time`, et les états de chargement (loaders skeleton).

#### Structure des dossiers (Feature-based)

```plaintext
src/
├── assets/         # Icônes, styles globaux, manifest.webmanifest
├── components/     # Composants partagés (UI/UX)
│   ├── ui/         # Boutons, Inputs, NeonBorders, Skeletons
│   └── layout/     # Sidebar, BottomNav (Mobile), Header, FloatingScanBtn
├── features/       # Logique métier isolée
│   ├── auth/       # Composants et hooks liés au JWT
│   ├── collection/ # Affichage des cartes "Live Data", filtres
│   ├── scanner/    # Intégration Html5Qrcode, parser EAN
│   └── suggest/    # UI du moteur de recommandation
├── hooks/          # Hooks globaux (ex: useAffiliationLink)
├── services/       # Appels Axios (API Platform)
├── store/          # Zustand stores
└── App.tsx         # Routing (React Router v6) et Service Worker registration
```

### Configuration PWA (Vite)

- Utilisation de `vite-plugin-pwa` avec les stratégies de cache `workbox`.
- **Offline partiel** : Les requêtes `GET /api/users/{id}/collection_items` et les métadonnées déjà hydratées via React Query sont mises en cache dans IndexedDB.

### UI/UX

- Thème Dark Mode strict géré via TailwindCSS (`darkMode: 'class'`).
- Utilisation de classes utilitaires comme `shadow-[0_0_15px_rgba(0,255,128,0.5)]` pour les effets néon.

## 3. Spécifications des Fonctionnalités Clés

### Affiliation Dynamique

Un hook React personnalisé `useAffiliationLink(productName, category, fallbackEan)` sera créé.

**Logique** : À l'affichage d'un produit, les boutons "Acheter sur Amazon" ou "Acheter à la Fnac" génèrent dynamiquement l'URL.

- **Format Amazon** : `https://www.amazon.fr/s?k=[PRODUIT_ENCODE]&tag=[TON_TAG_AMAZON]`
- **Format Fnac** : `https://www.awin1.com/cread.php?awinmid=[ID]&clickref=&p=[URL_FNAC_ENCODEE]`

### Scanner de Code-barres

Intégration de la librairie `Html5-Qrcode`.

**Flux utilisateur** :

1. Clic sur le Floating Action Button (FAB).
2. Ouverture d'une modale plein écran demandant l'accès caméra (`navigator.mediaDevices.getUserMedia`).
3. Détection de l'EAN-13.
4. Feedback haptique (vibration mobile `navigator.vibrate(200)`).
5. Appel à `/api/proxy/scan?ean=...` avec un loader visuel de type "HUD Sci-Fi".

## 4. Plan de Test (QA & Critères d'Acceptation)

### A. Module de Scan EAN-13

- **Test de luminosité** : Vérifier que le scanner permet d'activer le flash du smartphone (API Torch) si l'environnement est sombre.
- **Test EAN Inconnu** : Si l'API tierce retourne une 404, l'UI doit afficher une erreur gracieuse : "Produit non trouvé. Voulez-vous l'ajouter manuellement ?" sans faire crasher l'application.
- **Test de concurrence** : Scanner le même produit deux fois de suite rapidement ne doit pas créer de doublons en base (gestion côté backend via contrainte d'unicité `user_id` + `external_product_id`).
- **Test de format** : Le scanner doit ignorer les QR Codes standards et se limiter aux formats UPC/EAN.

### B. Moteur de Recommandation & Live Data

- **Test du "Cold Start"** : Si un nouvel utilisateur n'a aucun item dans sa collection, l'algorithme doit retourner des recommandations génériques (Les plus populaires du moment via IGDB API/Google Books).
- **Test de performance d'hydratation** : Afficher une collection de 100 items ne doit pas déclencher 100 requêtes HTTP simultanées directes vers les APIs tierces. Vérifier que l'API Platform (BFF) ou React Query batch les requêtes ou gère la pagination efficacement avec des Skeleton Loaders.
- **Test d'exclusion** : Un produit déjà présent dans la collection de l'utilisateur (vérification de `external_product_id`) ne DOIT PAS apparaître dans la section des suggestions.
