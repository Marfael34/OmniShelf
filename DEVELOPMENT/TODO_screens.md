# OmniShelf - To-Do List : Écrans & Navigation

Ce document liste les tâches nécessaires pour finaliser l'interface utilisateur (UI), la navigation et le système de recherche globale.

## 1. Routage & Navigation

- [x] **Router** :
  - [x] Configurer le tableau de routes (`src/router/router.jsx`) en utilisant ce modèle d'objet pour les liens :
    ```javascript
    {
        path: "/", // chemin de la vue
        element: <Home/>, // élément retourné
    }
    ```
  - [x] Créer le composant `src/router/AppRouter.jsx` avec comme modèle :
    ```javascript
    const AppRouter = () => {
      return <RouterProvider router={Router} />;
    };
    ```
  - [x] Définir l'ensemble des chemins de l'application :
    - [x] `/` (Accueil)
    - [x] `/profile` (Profil)
    - [x] `/my-collections` (Mes Collections)
    - [x] `/wishlist` (Wishlist Commune)
    - [x] `/search` (Recherche avancée)
    - [x] `/details/game/:id` (Vue détaillée : Jeu Vidéo)
    - [x] `/details/manga/:id` (Vue détaillée : Manga)
    - [x] `/details/vinyl/:id` (Vue détaillée : Vinyle)
    - [x] `/details/pop/:id` (Vue détaillée : Figurine POP)
- [x] **NavBar** (dans `src/components/UI/NavBar.jsx`) :
  - [x] Intégrer le logo OmniShelf.
  - [x] Ajouter les liens de navigation.
  - [x] Gérer l'affichage conditionnel : boutons "Connexion / Inscription" (si visiteur) vs bouton "Profil" (si utilisateur connecté via Zustand).

## 2. Écrans Principaux (dans `src/screens/`)

- [x] **Page d'Accueil** (`Home.jsx`) :
  - [x] Message de bienvenue interactif et présentation globale du site.
  - [x] Créer une section visuelle divisée en 4 catégories, chacune avec un background thématique :
    - [x] 🎮 Jeux Vidéo
    - [x] 📚 Manga
    - [x] 💿 Vinyle
    - [x] 🦸‍♂️ Figurine POP
- [] **Page Profil** (`Profile.jsx`) :
  - [] Afficher les informations du compte de l'utilisateur connecté.
  - [] Intégrer une vue d'ensemble des différentes collections possédées par l'utilisateur.
- [] **Page Mes Collections** (`MyCollections.jsx`) :
  - [] Afficher uniquement et en détail l'ensemble des collections de l'utilisateur connecté avec un système de filtres.

## 3. Vues Détaillées par Catégorie

_Note : Chaque vue détaillée doit inclure les boutons d'action "Ajouter à la collection" et "Ajouter à la wishlist"._

- [] **Jeu Vidéo** : Titre, Genre, Nom de l'éditeur, Image, PEGI, et lien d'achat.
- [] **Manga** : Titre, Nom de l'auteur, Genre, Maison d'édition, Image, et lien d'achat.
- [] **Vinyle** : Titre, Nom de l'artiste, Genre, Image, et tracklist (liste des chansons, si disponible).
- [] **Figurine POP** : Numéro de la POP, Nom de la série, Nom du personnage, Image.

## 4. Wishlist Commune

- [ ] **Page Wishlist** (`Wishlist.jsx`) :
  - Afficher une liste de souhaits globale regroupant toutes les thématiques.
  - Intégrer un système de filtres pour rechercher/trier facilement par catégorie ou thématique.

## 5. Fonctionnalité de Recherche

- [ ] **Système de Recherche Avancée** :
  - Créer une barre de recherche (soit dans la NavBar, soit sur une page dédiée).
  - Permettre une recherche multicritères : Titre, Nom d'auteur, Maison d'édition, Nom du studio, PEGI.
  - Afficher les résultats sous forme de grille de cartes.
