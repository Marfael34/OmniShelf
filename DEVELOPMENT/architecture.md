# Architecture Technique - Projet OmniShelf

Ce document décrit l'architecture logicielle globale du projet OmniShelf, en alignement avec les standards définis dans `regle.md` et le `cahier_des_charge.md`.

## 1. Vue d'Ensemble

OmniShelf est une Progressive Web App (PWA) conçue pour la gestion de collections personnelles (Funko Pop, livres, etc.). L'architecture est basée sur une séparation claire entre un frontend moderne (React) et un backend robuste (Symfony) qui sert d'API et de proxy.

### Diagramme Conceptuel

```
┌───────────────────┐      ┌──────────────────────────┐      ┌──────────────────┐
│ Frontend          │      │ Backend (BFF)            │      │ Base de Données  │
│ (React 19 / PWA)  ├─────►│ (Symfony 8 / API)        ├─────►│ (MariaDB)        │
└───────────────────┘      └───────────┬──────────────┘      └──────────────────┘
                                       │
                                       │
                                       ▼
                               ┌──────────────────┐
                               │ APIs Tierces     │
                               │ (OpenProducts,   │
                               │  eBay, etc.)     │
                               └──────────────────┘
```

## 2. Architecture Backend (Symfony 8)

Le backend est construit sur **Symfony 8** et fonctionne en mode **Backend-For-Frontend (BFF)**. Son rôle principal n'est pas de servir des pages web, mais de fournir une API REST sécurisée et optimisée pour le client React.

### Stack Technique

- **Framework**: Symfony 8
- **Serveur**: Apache (via Docker)
- **Langage**: PHP 8.4+ (typage strict)
- **Base de Données**: MariaDB 11.3
- **ORM**: Doctrine

### Schéma de la Base de Données (Principe du "Live Data")

La base de données locale est volontairement minimale. Elle ne stocke que les informations essentielles à l'utilisateur et met en cache les données externes pour limiter les appels API.

1.  **`User`**: Table pour l'authentification des utilisateurs (gérée par `lexik/jwt-authentication-bundle`).

2.  **`Figurine` (Cache d'Items)**: Cette table agit comme un cache local pour les produits scannés ou recherchés.
    - `id` (int): Identifiant unique (Auto-incrément).
    - `barcode` (string, unique): Le code-barres EAN/UPC, qui sert de clé de recherche principale.
    - `name` (string): Nom du produit.
    - `brand` (string, nullable): Marque (ex: "Funko").
    - `description` (text, nullable): Description ou catégories.
    - `image_url` (string, nullable): URL de l'image principale.
    - `created_at` (datetime): Date de la première découverte de l'item.

3.  **`CollectionItem`** (Table de jointure): Lie un utilisateur à une figurine de sa collection.
    - `id` (int)
    - `user_id` (relation ManyToOne vers `User`)
    - `figurine_id` (relation ManyToOne vers `Figurine`)
    - `added_at` (datetime): Date d'ajout à la collection.

### Endpoints d'API Principaux

- `POST /api/register`: Création d'un compte utilisateur.
- `POST /api/login_check`: Authentification et récupération d'un token JWT.
- `GET /api/scan/{barcode}`: **Endpoint central du scan**. Il orchestre la logique de recherche et de mise en cache.
- `GET /api/collection`: Récupère la liste des figurines de la collection de l'utilisateur authentifié.
- `POST /api/collection`: Ajoute une figurine (via son ID) à la collection de l'utilisateur.
- `DELETE /api/collection/{id}`: Supprime un item de la collection.

## 3. Architecture Frontend (React 19)

Le frontend est une **Progressive Web App (PWA)** construite avec React et Vite, conçue pour être rapide, installable et utilisable hors-ligne (partiellement).

### Stack Technique

- **Framework**: React 19 (avec React Compiler)
- **Bundler**: Vite
- **Styling**: TailwindCSS
- **Gestion du state serveur**: TanStack Query (React Query)
- **Gestion du state client**: Zustand

### Principes Clés

- **React Compiler**: Le code est écrit de manière simple, sans `useMemo` ou `useCallback`. Le compilateur se charge d'optimiser les re-renders.
- **TanStack Query**: Toute interaction avec le backend Symfony passe par React Query pour gérer automatiquement le cache, les états de chargement (`isLoading`), les erreurs et la synchronisation des données.
- **Scanner via `html5-qrcode`**: La librairie est intégrée dans un composant React qui, une fois un code-barres détecté, déclenche un appel à l'API `/api/scan/{barcode}` via React Query.

### Structure des Dossiers Frontend

Conformément au fichier `regle.md`, et après consolidation des différentes spécifications, voici l'architecture de dossiers officielle pour le frontend. Elle est conçue pour la clarté, la modularité et le respect strict des standards du projet (React 19 en JS natif, pas de TypeScript).

```plaintext
src/
├── assets/          # Images, polices, icônes globales
├── components/     # Composants UI atomiques et réutilisables (Max 60 lignes)
|   ├── UI          # NavBar, QuickSearch, CategoryLinks, ProductCard
|   ├── Search      # SearchForm, SearchFilters, SearchResults
├── constants/       # toute les constante de l'application et de l'api
├── contexts         # contexte pour l'authentification
├── hooks/           # Hooks personnalisés globaux (useAuth, useLocalStorage)
├── router/          # Fichiers de configuration du routage (contenant "router")
├── screens/         # Écrans de l'application
├── services/        # Logique métier transverse (Analytics, Sentry)
└── store/           # État global (Redux Toolkit, Zustand, Pinia)
---

## 4. Workflow Détaillé : Scan d'une nouvelle Funko Pop

1.  **Scan (Frontend)**: L'utilisateur ouvre la modale de scan. `html5-qrcode` détecte le code-barres `0889698565551`.
2.  **Appel API (Frontend)**: Le hook `useQuery` de React Query est appelé pour l'endpoint `GET /api/scan/0889698565551`. L'UI affiche un composant de chargement (skeleton).
3.  **Réception (Backend)**: Le `FunkoController` reçoit la requête.
4.  **Cache Check (Backend)**: Doctrine cherche dans la table `Figurine` un enregistrement où `barcode` = `0889698565551`.
5.  **Cache Miss (Backend)**: La figurine n'est pas trouvée. Le contrôleur appelle le `BarcodeLookupService`.
6.  **Appel Externe (Backend)**: Le service interroge l'API `Open Products Facts`.
7.  **Persistance (Backend)**: Le service reçoit les données de la figurine "Funko POP! Animation: MHA - Himiko Toga". Il crée une nouvelle entité `Figurine`, la remplit et la sauvegarde en base via l'EntityManager de Doctrine.
8.  **Réponse (Backend)**: Le `FunkoController` retourne une réponse JSON `200 OK` avec les données de la figurine fraîchement créée.
9.  **Mise à jour UI (Frontend)**: React Query reçoit les données, les met en cache et met à jour l'interface pour afficher les détails de la figurine Himiko Toga.
10. **Ajout à la collection (Frontend)**: L'utilisateur clique sur "Ajouter". Un hook `useMutation` de React Query envoie une requête `POST /api/collection` avec l'ID de la figurine.
11. **Sauvegarde Collection (Backend)**: Le backend crée une nouvelle entrée dans la table `CollectionItem` qui lie l'ID de l'utilisateur et l'ID de la figurine.
12. **Feedback (Frontend)**: L'UI se met à jour (par exemple, le bouton "Ajouter" devient "Dans la collection") et la requête pour `GET /api/collection` est automatiquement invalidée et rafraîchie par React Query.
```
