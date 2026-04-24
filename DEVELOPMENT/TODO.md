# OmniShelf - To-Do List

Feuille de route pour le développement du projet, basée sur le document `architecture.md`.

## Phase 0 : Initialisation & Architecture (Terminée)

- [x] Initialiser l'environnement Docker (Apache, PHP 8.4+, MariaDB).
- [x] Créer la structure du projet Symfony 8.
- [x] Installer les dépendances principales (`orm-pack`, `http-client`, `maker-bundle`).
- [x] Définir les standards de code dans `regle.md`.
- [x] Rédiger le document d'architecture `architecture.md`.
- [x] Créer le service `BarcodeLookupService` pour interroger `Open Products Facts`.
- [x] Créer le contrôleur `FunkoController` avec la route `GET /api/scan/{barcode}`.

---

## Phase 1 : Backend - API & Couche de Données

### 1.1. Base de Données (Doctrine)

- [x] Créer l'entité `User` pour l'authentification.
- [x] Créer l'entité `Figurine` pour mettre en cache les données des produits.
  - `id` (int)
  - `barcode` (string, unique)
  - `name`, `brand`, `description`, `image_url`
  - `created_at`
- [x] Créer l'entité `CollectionItem` pour lier un `User` à une `Figurine`.
- [x] Générer et exécuter la première migration de la base de données.

### 1.2. Logique du Scan

- [x] **Mettre à jour `FunkoController`** :
  - Injecter le `FigurineRepository`.
  - **Logique de cache** : Avant d'appeler `BarcodeLookupService`, chercher le code-barres dans la table `Figurine`.
  - Si la figurine est trouvée en base, la retourner directement.
  - Si elle n'est pas trouvée, appeler le service, puis...
  - **Logique de persistance** : Créer une nouvelle instance de l'entité `Figurine` avec les données reçues et la sauvegarder en base avant de la retourner en JSON.

### 1.3. Authentification & Sécurité

- [x] Installer et configurer `lexik/jwt-authentication-bundle`.
- [x] Implémenter la logique de l'endpoint `POST /api/register`.
- [x] Sécuriser les futurs endpoints de collection pour qu'ils ne soient accessibles qu'aux utilisateurs authentifiés.

### 1.4. Gestion de la Collection

- [x] Créer le contrôleur pour `GET /api/collection` qui retourne les `CollectionItem` de l'utilisateur connecté.
- [x] Créer le contrôleur pour `POST /api/collection` qui crée un nouveau `CollectionItem`.
- [x] Créer le contrôleur pour `DELETE /api/collection/{id}` qui supprime un `CollectionItem`.

---

## Phase 2 : Frontend - React PWA

### 2.1. Initialisation du Projet

- [x] Mettre en place un projet React 19 avec Vite.
- [x] Installer et configurer TailwindCSS.
- [x] Installer `vite-plugin-pwa` pour transformer l'application en PWA.
- [x] Installer TanStack Query (`@tanstack/react-query`) et Zustand.

### 2.2. Fonctionnalités

- [x] **Authentification** : Créer les formulaires de connexion/inscription et gérer le token JWT avec Zustand.
- [x] **Scanner** :
  - [x] Intégrer la librairie `html5-qrcode` dans un composant React.
  - [x] Sur détection, appeler la route `/api/scan/{barcode}` via un hook `useQuery` de TanStack Query.
  - [x] Afficher un état de chargement (skeleton) pendant l'appel (Loader HUD Sci-Fi).
  - [x] Afficher les données de la figurine reçues.
- [x] **Collection** :
  - [x] Créer une page qui affiche la collection de l'utilisateur (via `GET /api/collection`).
  - [x] Implémenter les boutons "Ajouter" et "Supprimer" en utilisant le hook `useMutation` de TanStack Query.
  - [x] Utiliser le hook `useOptimistic` pour une mise à jour instantanée de l'interface.

---

## Phase 4 : Corrections & Améliorations (En cours)

### 4.1. Authentification & UI
- [x] **Problème de connexion** : L'interface ne se met pas à jour après la connexion et le profil reste inaccessible. (Fixé: Unification des stores)
- [x] **Affichage Collection** : Afficher un message "aucune collection pour le moment" si la liste est vide. (Mis à jour)

### 4.2. Recherche & Wishlist
- [x] **Recherche de jeux** : Corriger la barre de recherche qui ne retourne aucun résultat pour les jeux. (Amélioré: RAWG Search precise)
- [x] **Recherche Figurine Pop** : Ajouter la recherche par nom, univers et numéro de figurine. (Ajouté: Open Products Facts Search)
- [x] **Nettoyage Wishlist** : Supprimer les données de test/placeholder présentes dans la wishlist. (Refactorisé: Fetch API)

---

## Phase 5 : Stabilisation & Nouvelles Fonctionnalités

### 5.1. Recherche & Suggestion (Bugs persistants)
- [ ] **Recherche Jeux Vidéo** : Investiguer pourquoi aucun jeu n'apparaît (Vérifier logs RAWG et format de réponse).
- [ ] **Recherche Figurines POP** : Investiguer pourquoi aucun résultat ne sort (Vérifier Open Products Facts).
- [ ] **Suggestions** : Réparer le flux de suggestions qui est actuellement cassé.
- [ ] **Persistance Recherche** : Mémoriser et afficher la dernière recherche lors du retour sur la page.
- [ ] **Filtre Mangas** : Restreindre la recherche de livres aux mangas uniquement.

### 5.2. Gestion des Collections & Wishlist
- [ ] **Formulaire de Collection** : Créer un formulaire pour permettre la création de nouvelles collections.
- [ ] **Ajout d'Items** : Implémenter la logique d'ajout d'un produit à une collection spécifique (existante ou nouvelle).
- [ ] **Ajout Wishlist** : Permettre l'ajout d'éléments à la wishlist depuis la recherche ou les détails.

### 5.3. Affiliation & Navigation
- [ ] **Bouton Accueil** : Ajouter un bouton "Accueil" explicite dans la navigation.
- [ ] **Liens Amazon/Fnac** : 
    - [ ] Inclure dynamiquement le nom du produit dans les liens.
    - [ ] Corriger le lien Fnac qui ne pointe pas vers le bon domaine.
